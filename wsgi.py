from appconf import AppConfig
# from flask.ext.cors import CORS, cross_origin

# from app import app

if __name__ == '__main__':
    app = AppConfig().app
    app.run(debug=True)#Starts the Flask

