#!flask/bin/python
from flask import Flask, jsonify
import requests

app = Flask(__name__)

@app.route('/')
def index():
  return "Hello, World!"

@app.route('/signed_data', methods=['GET'])
def signed_map():
  r = requests.get('http://data.seattle.gov/resource/kb3s-zi3s.json')
  json_data = r.json()
  return jsonify({'data': json_data})

if __name__ == '__main__':
  app.run(debug=True)


