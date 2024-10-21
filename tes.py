
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import urllib.parse
username = 'covailabs1'
password = 'KRISHtec@5747'

# Escape the username and password
escaped_username = urllib.parse.quote_plus(username)
escaped_password = urllib.parse.quote_plus(password)

# MongoDB URI with escaped credentials
uri = f"mongodb+srv://{escaped_username}:{escaped_password}@cluster0.mongodb.net/?retryWrites=true&w=majority"


# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)