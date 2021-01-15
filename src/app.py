import json
import os
from flask import Flask, render_template, jsonify, redirect, request, url_for, make_response, session
import requests
import pymongo
from requests.auth import HTTPBasicAuth
from flask_cors import CORS, cross_origin
from datetime import timedelta

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.secret_key = "super secret key"

agworldUsername = 'temp'
agworldPassword = 'temp'
username = ''
password = ''
myclient = ''
db = ''
mycol = ''

def initializeDB():
    global myclient
    global db
    global mycol
    with open('./app/key.json') as f:
        apikey = json.load(f)
    myclient = pymongo.MongoClient(apikey['mongoDBkey'])
    db = myclient["AgSmartDB"]
    mycol = db["Users"]

@app.route('/find_session', methods = ['GET', 'POST'])
def get_session():
    if request.method == 'GET':
        if username != '':
            query = {"username": str(username)}
            result = mycol.find(query)
            if agworldUsername!='temp' and agworldPassword != 'temp':
                with open('./app/key.json') as f:
                    apikey = json.load(f)
                headers = {'Content-Type': 'application/vnd.api+json','Accept': 'application/vnd.api+json','Api-Token':apikey['agworldAPI']}
                response = requests.get('https://us.agworld.co/user_api/v1/farms/120061',headers = headers,auth=HTTPBasicAuth(agworldUsername, agworldPassword))
                t = response.json()
                t = t['data']
                response = requests.get('https://us.agworld.co/user_api/v1/fields?filter[farm_id]=120061&season_id=163976',headers = headers,auth=HTTPBasicAuth(agworldUsername, agworldPassword))
                d = response.json()
                d = d['data']
                return json.dumps({"msg":"200", "name":result[0]['name'], "address":result[0]['address'], "code":"SUCCESS", "response_farms":t, 'response_fields': d,"zoom": 7})
            else:
                print('failed')
            return json.dumps({"msg":"200", "code":"SUCCESS","name":result[0]['name'], "address":result[0]['address'], "response": [], "zoom": 17})
    return json.dumps({"msg":"400", "code":"FAILED"})

@app.route('/login_validation', methods = ['GET', 'POST'])
def verify_login_creds():
    global username
    global password
    global agworldUsername
    global agworldPassword
    if request.method == 'POST':
        initializeDB()
        data = request.get_json()
        query = {"username": str(data['username'])}
        result = mycol.find(query)
        result_json = mycol.find_one(query)
        print(result)
        if 'agworldUsername' in result_json:
            agworldUsername = result_json['agworldUsername']
            agworldPassword = result_json['agworldPassword']
        if result.count() !=0:
            if str(result[0]['password']) == str(data['password']) and str(result[0]['username']) == str(data['username']):
                username = data['username']
                password = data['password']
                return json.dumps({"msg":"200", "response":"SUCCESS","name":result[0]['name'], "address":result[0]['address']})
    return json.dumps({"msg":"400", "response":"FAILED"})

@app.route('/verify_agworld_login', methods = ['GET', 'POST'])
def verify_agworld_login():
    global agworldPassword
    global agworldUsername
    if request.method == 'POST':
        apikey = {}
        data = request.get_json()
        #print(json.dumps(data))
        with open('./app/key.json') as f:
            apikey = json.load(f)
        response = requests.get('https://us.agworld.co/user_api/v1/fields/?api_token='+apikey['agworldAPI'],auth=HTTPBasicAuth(data['username'], data['password']))
        if response.status_code == 200:
            if data['checkbox'] == True:
                mycol.update_one({"username": username}, {'$set':{"agworldUsername": agworldUsername, "agworldPassword": agworldPassword}})
            agworldUsername = data['username']
            agworldPassword = data['password']
            return json.dumps({"msg":"200", "response":"SUCCESS"})
    return json.dumps({"msg":"404"})

@app.route('/getagworldFarms', methods = ['GET', 'POST'])
def get_agworldFarms():
    if request.method == 'GET':
        with open('./app/key.json') as f:
            apikey = json.load(f) #farms/117513/
        headers = {'Content-Type': 'application/vnd.api+json','Accept': 'application/vnd.api+json','Api-Token':apikey['agworldAPI']}
        response = requests.get('https://us.agworld.co/user_api/v1/farms/120061',headers = headers,auth=HTTPBasicAuth(agworldUsername, agworldPassword))
        #print(response.status_code)
        t = response.json()
        t = t['data']
        #print(t)
        if response.status_code == 200:
            return json.dumps({"msg":"200", "result":"SUCCESS", "response_farms": t, "zoom": 7})
    return json.dumps({"msg":"404"})

@app.route('/getagworldFields', methods = ['GET', 'POST'])
def get_agworldFields():
    if request.method == 'GET':
        with open('./app/key.json') as f:
            apikey = json.load(f) #farms/117513/
        headers = {'Content-Type': 'application/vnd.api+json','Accept': 'application/vnd.api+json','Api-Token':apikey['agworldAPI']}
        response = requests.get('https://us.agworld.co/user_api/v1/activities?filter[name]=Winter+Forage+Planting&page[size]=100',headers = headers,auth=HTTPBasicAuth(agworldUsername, agworldPassword))
        result = response.json()
        response = requests.get('https://us.agworld.co/user_api/v1/activities?filter[name]=Discing&page[size]=100',headers = headers,auth=HTTPBasicAuth(agworldUsername, agworldPassword))
        result1 = response.json()
        result['data'] = result['data'] + result1['data']
        result = result['data']
        #print(json.dumps(result))
        if response.status_code == 200:
            return json.dumps({"msg":"200", "result":"SUCCESS", "response_fields":result, "zoom": 7})
    return json.dumps({"msg":"404"})

@app.route('/file_data_upload', methods = ['GET', 'POST'])
def file_data_upload():
    if request.method == 'POST':
        data = request.get_json()
        mycol.update_one({"username": username}, {'$set':{"water in gallons": data['dataFromExcel']}})
        return json.dumps({"msg":"200", "result":"SUCCESS"})
    return json.dumps({"msg":"400", "result":"FAILED"})
@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

if __name__ == '__main__':
    app.run()
    