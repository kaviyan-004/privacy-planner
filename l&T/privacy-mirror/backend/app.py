import os
import random
import base64
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from models import db, User, Analysis
from dotenv import load_dotenv
import anthropic
import json

load_dotenv()

app = Flask(__name__)
# Enable CORS; frontend will likely run on localhost:5173
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174", "http://localhost:3000"])

app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'dev_key')
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASE_DIR, 'database.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = None

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"error": "Unauthorized"}), 401

with app.app_context():
    db.create_all()

# Claude API setup
anthropic_api_key = os.environ.get('ANTHROPIC_API_KEY')
client = anthropic.Anthropic(api_key=anthropic_api_key) if anthropic_api_key and anthropic_api_key != 'your_claude_api_key_here' else None

# ----------- AUTH ROUTES -----------

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already taken"}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    colors = ["#7b2fff", "#a855f7", "#ff4d4d", "#ff8c42", "#06d6a0", "#4cc9f0", "#ffd166"]
    avatar_color = random.choice(colors)

    new_user = User(username=username, email=email, password=hashed_pw, avatar_color=avatar_color)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True, "message": "User created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)
        return jsonify({
            "success": True, 
            "user": {
                "id": user.id, "username": user.username, "email": user.email, "avatar_color": user.avatar_color
            }
        })
    return jsonify({"error": "Invalid email or password"}), 401

@app.route('/api/logout', methods=['POST', 'GET'])
@login_required
def logout():
    logout_user()
    return jsonify({"success": True})

@app.route('/api/me', methods=['GET'])
def get_me():
    if current_user.is_authenticated:
        return jsonify({
            "authenticated": True,
            "user": {
                "id": current_user.id, "username": current_user.username, 
                "email": current_user.email, "avatar_color": current_user.avatar_color
            }
        })
    return jsonify({"authenticated": False})


# ----------- API ROUTES -----------

@app.route('/api/analyze', methods=['POST'])
def analyze_post():
    if request.content_type and request.content_type.startswith('multipart/form-data'):
        post_text = request.form.get('post_text', '')
        csv_content = request.form.get('csv_content', '')
        image = request.files.get('image')
    else:
        data = request.json or {}
        post_text = data.get('post_text', '')
        csv_content = data.get('csv_content', '')
        image = None
    
    if not client:
        # Dynamic Rule-Based Analysis
        post_lower = post_text.lower()
        
        found_locations = [loc for loc in ["chennai", "goa", "delhi", "mumbai", "bangalore", "park", "beach", "resort", "mall", "airport"] if loc in post_lower]
        found_routines = [rout for rout in ["morning", "evening", "8am", "9am", "tomorrow", "every monday", "daily"] if rout in post_lower]
        found_personal = [pers for pers in ["home", "alone", "parents", "empty", "bought", "my phone", "address"] if pers in post_lower]
        
        risk_score = 0
        risk_tags = []
        terminal_lines = ["$ scanning input data..."]
        hacker_steps = []
        hacker_actions = []
        removed_items = []
        profile = {}
        
        if found_locations:
            risk_score += 40
            risk_tags.append("Location")
            loc_cap = found_locations[0].title()
            terminal_lines.append(f"$ location_found: {loc_cap}")
            hacker_steps.append(f"Identified location tag: {loc_cap}")
            profile["📍 Location"] = loc_cap
            removed_items.extend(found_locations)
            
        if found_routines:
            risk_score += 30
            risk_tags.append("Routine")
            terminal_lines.append(f"$ checking routine pattern: {found_routines[0]}")
            hacker_steps.append(f"Analyzed routine pattern: {found_routines[0]}")
            profile["🕒 Routine"] = found_routines[0]
            removed_items.extend(found_routines)
            
        if found_personal:
            risk_score += 35
            risk_tags.append("Personal Info")
            terminal_lines.append(f"$ personal_info_extracted: {found_personal[0]}")
            hacker_steps.append(f"Found sensitive info: {found_personal[0]}")
            profile["🏠 Living/Status"] = found_personal[0]
            removed_items.extend(found_personal)
            
        if image:
            risk_score += 20
            risk_tags.append("Image Data")
            terminal_lines.append(f"$ analyzing image metadata and content...")
            hacker_steps.append(f"Extracted EXIF data and background details from {getattr(image, 'filename', 'image')}")
            removed_items.append("image background details")
            profile["📸 Image"] = "Metadata Present"
            
        if not profile:
            profile["👤 Status"] = "Unknown"
        
        if not risk_tags:
            risk_tags.append("Low Risk")
            terminal_lines.append("$ no critical threats detected.")
            hacker_steps.append("Attempted to find information but nothing obvious was exposed.")
        
        risk_score = min(risk_score, 100)
        risk_level = "HIGH RISK" if risk_score >= 70 else ("MEDIUM RISK" if risk_score >= 40 else "LOW RISK")
        
        terminal_lines.append(f"$ risk_score: {risk_score}/100")
        if risk_score > 50:
            terminal_lines.append("$ profile compiled. target identified.")
            hacker_actions.append("Potential physical stalking or social engineering")
        else:
            terminal_lines.append("$ insufficient data for targeting.")
            
        import re
        safe_version = post_text
        for item in removed_items:
            # Simple case-insensitive replacement to sanitize text
            try:
                safe_version = re.sub(item, '[REDACTED]', safe_version, flags=re.IGNORECASE)
            except:
                pass
                
        if not removed_items and not image:
            safe_version = post_text if post_text else "No post text provided."
        elif not post_text and image:
            safe_version = "Consider cropping or blurring the image background before posting."
            
        return jsonify({
            "profile": profile,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "risk_tags": risk_tags,
            "hacker_steps": hacker_steps,
            "terminal_lines": terminal_lines,
            "hacker_actions": hacker_actions,
            "safe_version": safe_version,
            "removed_info": ", ".join(removed_items) or "None",
            "timeline_scores": [20, 45, 85] if csv_content else []
        })
        
    prompt = f"Analyze this social media post for privacy risks:\n{post_text}\nCSV context:\n{csv_content}\n\nReturn ONLY a JSON object with keys: profile (dict of at least 6 keys: 👤 Profile Type, 📍 Location, 🕒 Routine, 🎯 Interests, 💰 Finance, 🏠 Living, 📱 Device, 🎂 Age Range depending on findings), risk_score (integer), risk_level (string), risk_tags (array of strings), hacker_steps (array of strings), terminal_lines (array of strings simulating hacker commands starting with $), hacker_actions (array of strings), safe_version (string), removed_info (string), timeline_scores (array of ints if csv present). No extra text."
    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            system="You are a cybersecurity privacy analysis engine. Return ONLY valid JSON with no markdown or explanation.",
            messages=[{"role": "user", "content": prompt}]
        )
        return jsonify(json.loads(response.content[0].text))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/image', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    file = request.files['image']
    
    if not client:
        return jsonify({
            "detections": [
                {"category": "Text", "value": "Visible street name", "risk": "HIGH RISK"},
                {"category": "Location", "value": "Home entrance", "risk": "HIGH RISK"}
            ],
            "risk_score": 90,
            "recommendations": ["Crop the left side", "Blur text"]
        })
        
    image_data = base64.b64encode(file.read()).decode('utf-8')
    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            system="You are an image privacy analyzer. Look at this image and detect all private information. Return ONLY valid JSON with keys: 'detections' (list of objects with 'category', 'value', 'risk'), 'risk_score' (0-100 integer), 'recommendations' (list of strings).",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "image", "source": {"type": "base64", "media_type": file.content_type, "data": image_data}},
                        {"type": "text", "text": "Analyze this image."}
                    ]
                }
            ]
        )
        return jsonify(json.loads(response.content[0].text))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/caption', methods=['POST'])
def analyze_caption():
    data = request.json
    caption = data.get('caption', '')
    platform = data.get('platform', '')
    
    if not client:
        return jsonify({
            "detected_risks": [{"category": "Location", "value": "Anna Nagar park", "severity": "HIGH RISK"}],
            "safe_caption": "Out enjoying the day! 😊",
            "removed_items": ["Anna Nagar park"]
        })
        
    prompt = f"Caption: {caption}\nPlatform: {platform}\nReturn ONLY JSON with: detected_risks (list of objects with category, value, severity), safe_caption, removed_items (list of strings)."
    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            system="Analyze caption for privacy risks. Return ONLY JSON.",
            messages=[{"role": "user", "content": prompt}]
        )
        return jsonify(json.loads(response.content[0].text))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    history = data.get('history', [])
    
    if not client:
        return jsonify({"reply": "I am a mock privacy advisor. I see you want to stay safe online! Never share your home location."})
        
    msgs = [{"role": m['role'], "content": m['content']} for m in history]
    msgs.append({"role": "user", "content": message})
    
    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            system="You are a friendly but alarming AI privacy security expert. Analyze posts and give advice in 3 to 6 sentences. Use emojis. Always suggest a safer alternative at the end.",
            messages=msgs
        )
        return jsonify({"reply": response.content[0].text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/whatif', methods=['POST'])
def whatif():
    data = request.json
    scenario = data.get('scenario', '')
    post_context = data.get('post_context', '')
    
    if not client:
        return jsonify({
            "steps": ["Attacker searches your username", "Finds location tag", "Narrows street"],
            "conclusion": "In just a few steps your home is exposed.",
            "time_estimate": "10 to 20 minutes",
            "tips": ["Private account", "Delay posting"]
        })
        
    prompt = f"Scenario: {scenario}\nContext: {post_context}\nReturn ONLY JSON with: steps (list of strings), conclusion (string), time_estimate (string), tips (list of strings)."
    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            system="You are simulating an attacker's thought process. Return ONLY valid JSON.",
            messages=[{"role": "user", "content": prompt}]
        )
        return jsonify(json.loads(response.content[0].text))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/save', methods=['POST'])
@login_required
def save_analysis():
    data = request.json
    new_analysis = Analysis(
        user_id=current_user.id,
        type=data.get('type'),
        input_preview=data.get('input_preview', '')[:200],
        risk_score=data.get('risk_score', 0),
        safe_version=data.get('safe_version', '')
    )
    db.session.add(new_analysis)
    db.session.commit()
    return jsonify({"success": True})

@app.route('/api/my-analyses', methods=['GET'])
@login_required
def my_analyses():
    analyses = Analysis.query.filter_by(user_id=current_user.id).order_by(Analysis.created_at.desc()).all()
    results = []
    for a in analyses:
        results.append({
            "id": a.id,
            "type": a.type,
            "input_preview": a.input_preview,
            "risk_score": a.risk_score,
            "date": a.created_at.isoformat()
        })
    return jsonify({"analyses": results})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
