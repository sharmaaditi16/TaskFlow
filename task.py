from flask import Flask,request, jsonify  # Import Flask and request
from flask_cors import CORS  # Import CORS
from taskly import Taskly
from functools import wraps
import jwt
from user import User
from appconf import AppConfig

app = AppConfig().app
CORS(app)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        headers = request.headers
        token = headers.get("token")
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User().get_user_by_id(data['id'])
            user_id = current_user.json.get('user', {}).get('id')
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        if 'task_id' in kwargs:
            return f(kwargs.get('task_id'),user_id)

        return f(user_id)
    return decorated

@app.route('/tasks',methods=['GET']) 
@token_required
def get_tasks(user_id):
    taskly = Taskly()
    return taskly.get_tasks(user_id)

#post api to insert values
@app.route('/tasks', methods=['POST'])
@token_required
def add_task(user_id):
    taskly = Taskly()
    return taskly.add_task(request, user_id)

#to get id specified task
@app.route('/tasks/<int:task_id>',methods=['GET'])
@token_required
def get_task_by_id_d(task_id,user_id):
    taskly = Taskly()
    return taskly.get_task_by_id(task_id,user_id)

# # to update task by id using put request
@app.route('/tasks', methods=['PUT'])
@token_required
def update_task(user_id):
    taskly = Taskly()
    return taskly.update_task(request, user_id)

# # to delete task by id using delete request
@app.route('/tasks/<task_id>', methods=['DELETE'])
@token_required
def delete_by_id(task_id,user_id):
    taskly = Taskly()
    return taskly.delete_by_id(task_id,user_id)

# #post api to insert values
@app.route('/create-user', methods=['POST'])
def create_user():
    user = User()
    return user.create_user(request)

# #to get id specified task
@app.route('/login',methods=['POST'])
def login():
    taskly = Taskly()
    return taskly.login(request)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)#Starts the Flask

