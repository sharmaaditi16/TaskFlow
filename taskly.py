from flask import Flask,request
import mysql.connector
import bcrypt
from flask import jsonify, session
import jwt
from datetime import datetime, timezone, timedelta
from functools import wraps
from appconf import AppConfig

class Taskly:

    def __init__(self):
        self.conn = AppConfig().conn
        self.config = AppConfig().app.config

    def get_tasks(self,user_id=None):
        cursor = self.conn.cursor(dictionary=True)
        cursor.execute("SELECT id, title, description, status, due_date, created_at, updated_at from tasks where created_by = %s", (user_id,))
        tasks = cursor.fetchall() 
        return jsonify({"tasks": tasks})

    def add_task(self, request=None,user_id=None):
        data=request.json

        title = data.get("title")
        description = data.get("description")
        status = data.get("status", "pending")            
        due_date = data.get("due_date") 

        cursor = self.conn.cursor()
        query = "INSERT INTO tasks (title, description, status, due_date, created_by) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, (title, description, status, due_date,user_id))
        self.conn.commit()
        task_id = cursor.lastrowid
        cursor.close()
        self.conn.close()
        return jsonify({"message": "Task added successfully", "task_id": task_id}), 201

    def update_task(self,request,user_id=None):
        data=request.get_json()

        cursor = self.conn.cursor()
        task_id = data['id'] #extract values
        title = data['title']
        description = data['description']
        status= data['status']
        due_date = data['due_date']

        if task_id is None or title is None or description is None or status is None or due_date is None:
            return jsonify({"error": "Missing required fields"}), 400
        cursor.execute("UPDATE tasks SET title = %s,description = %s,status = %s,due_date = %s WHERE id = %s AND created_by = %s", (title, description, status, due_date,task_id,user_id))
        self.conn.commit()
        return jsonify({"message": "Task updated successfully"})

    #to get id specified task
    def get_task_by_id(self,task_id, user_id=None): 
        cursor = self.conn.cursor(dictionary=True)  
        cursor.execute("SELECT * FROM tasks WHERE id = %s and created_by = %s", (task_id,user_id))#single tuple
        task = cursor.fetchone() 

        if task:  
            return jsonify({"task": task})
        else:  
            return jsonify({"error": "task not found"}), 404

    def delete_by_id(self,task_id,user_id=None):
        cursor = self.conn.cursor(dictionary=True)  
        cursor.execute("SELECT * FROM tasks WHERE id = %s and created_by = %s", (task_id,user_id))#single tuple
        task = cursor.fetchone() 
        if task is not None:
            query="DELETE from tasks where id="+ str(task_id) +" and created_by = " + str(user_id)
            cursor.execute(query)
            self.conn.commit()
            return jsonify({"message": "Task with ID " + str(task_id) + " deleted successfully"})
        else:
            return jsonify({"error": "task not found"}), 404

    def login(self,request=None):
        data=request.json
        email = data.get("email")  
        cursor = self.conn.cursor(dictionary=True)  
        query = "SELECT * FROM users WHERE email = '" + str(email) + "'"
        cursor.execute(query)
        pass_check_status = False
        token = ""
        for row in cursor:
            p = data.get("password")
            p_assword = p.encode('utf-8')
            pass_check_status = bcrypt.checkpw(p_assword,bytes(row['password'], 'utf-8'))
            token = jwt.encode({'id': row["id"], 'exp': datetime.now(timezone.utc) + timedelta(hours=1)},
                           self.config['SECRET_KEY'], algorithm="HS256")
                
        return jsonify({"login": pass_check_status, "token": token})
