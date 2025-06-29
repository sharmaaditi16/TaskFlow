from flask import Flask,request
import mysql.connector
import bcrypt
from flask import jsonify, session
import jwt
from datetime import datetime, timezone, timedelta
from functools import wraps
from appconf import AppConfig

class User:
    def __init__(self):
        self.conn = AppConfig().conn

    def create_user(self, request=None):
        data=request.json
        username = data.get("username")
        email = data.get("email")
        password = data.get("password") 
        mySalt = bcrypt.gensalt()
        bytePwd = password.encode('utf-8')
        hash_pass = bcrypt.hashpw(bytePwd, mySalt)
        password_hash = hash_pass.decode('utf8')
        cursor = self.conn.cursor()

        sql= "insert into users (username, email, password) values(%s, %s, %s)"
        values = (username, email, password_hash)
        cursor.execute(sql, values)
        self.conn.commit()
        return jsonify({"message": "User added successfully!"})
    
    def get_user_by_id(self, user_id=None):
        cursor = self.conn.cursor()
        cursor.execute("SELECT id, username, email FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        if user:
            return jsonify({"user": user[0]})
        else:
            return jsonify({"message": "User not found"}), 404

