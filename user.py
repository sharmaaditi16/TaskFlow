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

        cursor = self.conn.cursor()

        sql= "insert into users (username, email, password) values(%s, %s, %s)"
        values = (username, email, hash_pass)
        cursor.execute(sql, values)
        self.conn.commit()
        return jsonify({"message": "User added successfully!"})
    
    def get_user_by_id(self, user_id=None):
        cursor = self.conn.cursor(dictionary=True)
        cursor.execute("SELECT id, username, email FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        if user:
            return jsonify({"user": user})
        else:
            return jsonify({"message": "User not found"}), 404

