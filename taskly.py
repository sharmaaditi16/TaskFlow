from flask import Flask,request
import mysql.connector
import bcrypt
from flask import jsonify, session
import jwt
from datetime import datetime, timezone, timedelta
from functools import wraps
from appconf import AppConfig
from transformers import pipeline


class Taskly:

    def __init__(self):
        self.conn = AppConfig().conn
        self.config = AppConfig().app.config

    def get_tasks(self,user_id=None):
        cursor = self.conn.cursor()
        cursor.execute("SELECT id, title, description, status, due_date, created_at, updated_at from tasks where created_by = %s", (user_id,))
        tasks = cursor.fetchall() 
        cursor.close()
        self.conn.close()
        if not tasks:
            return jsonify({"message": "No tasks found"}), 404
        response = []
        for task in tasks:
            task_dict = {
                "id": task[0],
                "title": task[1],
                "description": task[2],
                "status": task[3],
                "due_date": task[4],
                "created_at": task[5],
            }
            # Convert datetime objects to ISO format strings
            for key in ["due_date", "created_at"]:
                if isinstance(task_dict[key], datetime):
                    task_dict[key] = task_dict[key].isoformat()
        response.append(task_dict)
        return jsonify({"tasks": response}), 200

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
        return jsonify({"message": "Task added successfully"}), 201

    def update_task(self,request,user_id=None):
        data=request.get_json()

        cursor = self.conn.cursor()
        task_id = data.get("id")
        title = data.get("title")
        description = data.get("description")
        status = data.get("status")
        due_date = data.get("due_date")

        if task_id is None or title is None or description is None or status is None or due_date is None:
            return jsonify({"error": "Missing required fields"}), 400
        cursor.execute("UPDATE tasks SET title = %s,description = %s,status = %s,due_date = %s WHERE id = %s AND created_by = %s", (title, description, status, due_date,task_id,user_id))
        self.conn.commit()
        return jsonify({"message": "Task updated successfully"})

    #to get id specified task
    def get_task_by_id(self,task_id, user_id=None): 
        cursor = self.conn.cursor()  
        cursor.execute("SELECT * FROM tasks WHERE id = %s and created_by = %s", (task_id,user_id))#single tuple
        task = cursor.fetchone() 
        if task is None:
            return jsonify({"error": "Task not found"}), 404
        task_dict = {
            "id": task[0],
            "title": task[1],
            "description": task[2],
            "status": task[3],
            "due_date": task[4],
            "created_at": task[5],
        }

        if task:  
            return jsonify({"task": task_dict}), 200
        else:  
            return jsonify({"error": "task not found"}), 404

    def delete_by_id(self,task_id,user_id=None):
        cursor = self.conn.cursor()  
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
        cursor = self.conn.cursor()  # Use dictionary=True for named access
        query = "SELECT * FROM users WHERE email = '" + str(email) + "'"
        cursor.execute(query)
        pass_check_status = False
        token = ""
        user = cursor.fetchone()
        p = data.get("password")
        p_assword = p.encode('utf-8')
        pass_check_status = bcrypt.checkpw(p_assword,bytes(user[3], 'utf-8'))
        token = jwt.encode({'id': user[0], 'exp': datetime.now(timezone.utc) + timedelta(hours=1)},
                           self.config['SECRET_KEY'], algorithm="HS256")
                
        return jsonify({"login": pass_check_status, "token": token})
    
    def copilot_suggest(self, request):
        data = request.json
        input_text = data.get("input", "")
        prompt = f"Help me with: {input_text}"

        try:
            result = self.generator(prompt, max_new_tokens=100)
            response = jsonify({"answer": result[0]["generated_text"]})
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        except Exception as e:
            return jsonify({"error": str(e)}), 500


