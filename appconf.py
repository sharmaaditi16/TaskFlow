import mysql.connector
from flask import Flask,request
import psycopg2

class AppConfig:
    def __init__(self):
        # self.conn = mysql.connector.connect(
        #     host="ep-yellow-tree-a4zfakw4-pooler.us-east-1.aws.neon.tech",
        #     user="neondb_owner",         
        #     password="npg_pxHh86OMEAeB",  
        #     database="neondb"
        # )
        self.conn = psycopg2.connect("postgres://0197bb1c-e830-777e-8382-a9f5457b1942:f59e2fac-1c64-47c0-a463-ade11887dad6@eu-central-1.db.thenile.dev/task_manager")
        self.app = None  # Placeholder for Flask app instance
        self.app = Flask(__name__)
        self.app.config['SECRET_KEY'] = '3o374eoxq0qiou4'  # Secret key for session management
        self.app.config['JWT_SECRET_KEY'] = '3o374eoxq0qiou4'  # Secret key for JWT
        self.app.config['JWT_TOKEN_LOCATION'] = ['headers']


