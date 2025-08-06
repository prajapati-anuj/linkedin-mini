from flask import Blueprint, request, jsonify
from models import posts_col, users_col
from datetime import datetime
from bson import ObjectId

posts_bp = Blueprint('posts', __name__)

@posts_bp.route('/posts', methods=['GET'])
def get_posts():
    posts = list(posts_col.find())
    for post in posts:
        post['_id'] = str(post['_id'])
    return jsonify(posts)

@posts_bp.route('/posts', methods=['POST'])
def create_post():
    data = request.json
    user = users_col.find_one({'_id': ObjectId(data['user_id'])})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    post = {
        'user_id': data['user_id'],
        'author_name': user['name'],
        'content': data['content'],
        'timestamp': datetime.utcnow().isoformat()
    }
    posts_col.insert_one(post)
    return jsonify({'message': 'Post created successfully'})
