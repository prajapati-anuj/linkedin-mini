from flask import Flask, jsonify
from flask_cors import CORS
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.posts import posts_bp
from bson import ObjectId
from db import users_collection, posts_collection  # ✅ You need to create/use db.py to define these

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(posts_bp)

@app.route('/api/profile/<user_id>', methods=['GET'])
def get_user_profile(user_id):
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        posts = list(posts_collection.find({"user_id": user_id}))
        for post in posts:
            post['_id'] = str(post['_id'])
            post['user_id'] = post.get('user_id')
            post['author_name'] = user.get('name', 'Unknown')

        user_profile = {
            "name": user.get("name"),
            "bio": user.get("bio", ""),
            "_id": str(user["_id"]),
            "posts": posts
        }
        return jsonify(user_profile), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
