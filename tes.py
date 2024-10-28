
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import urllib.parse
username = 'covailabs1'
password = 'KRISHtec@5747'

# Escape the username and password
escaped_username = urllib.parse.quote_plus(username)
escaped_password = urllib.parse.quote_plus(password)

# MongoDB URI with escaped credentials
uri = "mongodb+srv://covailabs1:KRISHtec%405747@bmsdashboard.upate.mongodb.net/?retryWrites=true&w=majority&appName=bmsdashboard"


# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)