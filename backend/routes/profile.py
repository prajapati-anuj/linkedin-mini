from flask import Blueprint, request, jsonify
from models import users_col, posts_col
from bson.objectid import ObjectId

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/profile/<user_id>', methods=['GET'])
def get_profile(user_id):
    user = users_col.find_one({'_id': ObjectId(user_id)})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    posts = list(posts_col.find({'user_id': user_id}))
    for post in posts:
        post['_id'] = str(post['_id'])
    return jsonify({
        'name': user['name'],
        'email': user['email'],
        'bio': user.get('bio', ''),
        'posts': posts
    })
