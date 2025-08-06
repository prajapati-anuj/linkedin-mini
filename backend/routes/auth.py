from flask import Blueprint, request, jsonify
from models import users_col
import bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if users_col.find_one({'email': data['email']}):
        return jsonify({'error': 'User already exists'}), 409
    
    hashed_pw = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    user = {
        'name': data['name'],
        'email': data['email'],
        'password': hashed_pw,
        'bio': data.get('bio', '')
    }
    users_col.insert_one(user)
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users_col.find_one({'email': data['email']})
    if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'bio': user.get('bio', '')
            }
        })
    return jsonify({'error': 'Invalid credentials'}), 401
