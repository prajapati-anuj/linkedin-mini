from pymongo import MongoClient

# Replace this with your Atlas connection string
MONGO_URI = "mongodb+srv://AnujPrajapati:MongoAnuj@m0.wey5b3a.mongodb.net/?retryWrites=true&w=majority&appName=m0"

client = MongoClient(MONGO_URI)
db = client['LinkedInMini']  # Your database name

users_collection = db['users']
posts_collection = db['posts']
