from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    avatar_color = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    analyses = db.relationship('Analysis', backref='user', lazy=True)

class Analysis(db.Model):
    __tablename__ = 'analysis'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)
    input_preview = db.Column(db.String(200))
    risk_score = db.Column(db.Integer)
    safe_version = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
