from flask import Flask, render_template, request, redirect, url_for, make_response
import json
app = Flask(__name__)
app.secret_key = "|\|||<|-|||_"

@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('home.html', val='', msg='')

@app.route('/reef', methods=['POST'])
def reef():
    reef1 = request.form['reef']
    with open('results.json') as file:
        dict1 = json.load(file)
        if reef1 in dict1.keys():
            bleachingLevel = dict1[reef1]['Percent_Bleaching']
            Exposure = dict1[reef1]['Exposure']
            turb = dict1[reef1]['Turbidity']
            dateYear = dict1[reef1]['Date_Year']
            loc = dict1[reef1]['coords']
            Temperature_Kelvin = dict1[reef1]['Temperature_Kelvin']
            state=""
            if int(bleachingLevel.removesuffix('%')) > 60:
                state = "bad"
            elif int(bleachingLevel.removesuffix('%')) > 30:
                state="ok"
            else:
                state="cool"
            return render_template('reef.html', bl = bleachingLevel, e=Exposure, dy=dateYear, tk=Temperature_Kelvin, t=turb, name=reef1, c=loc, state=state)
        else:
            return render_template('home.html', val=reef1, msg='Something went wrong. Check your spelling.')