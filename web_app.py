from flask import Flask, url_for, flash, render_template, redirect, request, g, send_from_directory
from flask import session as login_session
import locale, os
from werkzeug.utils import secure_filename
from datetime import datetime
import pyrebase
from passlib.hash import pbkdf2_sha256 as crypt
from twilio.rest import Client



UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.secret_key = "RPoint2017"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def main_page():
	return render_template('Home.html')

@app.route('/Home', methods=['GET'])
def Make_Home_Page():
	return render_template('Home.html')

@app.route('/About')
def Make_About_Page():
	return render_template('About.html')

@app.route('/Alternatives')
def Make_Alternatives_Page():
	return render_template('Alternatives.html')

@app.route('/Contact')
def Make_Contact_Page():
	return render_template('Contact.html')

@app.route("/results/<int:id>")
def Results(id):
	return render_template("Results.html", id=id)



@app.route("/GoogleMaps/<string:types>/<int:id>")
def googlemap(types, id):
	typeslist = types.split(',')
	print(typeslist)
	return render_template("Maps.html", types = typeslist)


@app.route("/done/<int:id>")
def DonePage(id):
	return render_template("DonePage.html")

#return 2 dict of phone numbers to send an sms
@app.route("/send_sms_to")
def send_sms_to_page():
	return render_template("send_sms_to.html")

#send sms to the phone numbers
@app.route("/send_sms", methods=["POST"])
def send_sms():
	req = request.form
	data_list = str(req['phoneNumberList'])
	send_text(data_list)
		
	

def send_text(string_list_of_phones):
	print('request:')
	print(string_list_of_phones)
	list_of_phones=list_of_phones[1:]
	list_of_phones=list_of_phones[:-1]
	list_of_phones=list_of_phones.split(",")

def test_twilio():
	# put your own credentials here
	account_sid = "ACd5fdfa3be844be02e00316862ada2cb0"
	auth_token = "4274acec9b0379ca63fc68b2a151899b"

	client = Client(account_sid, auth_token)
	
	client.messages.create(
    to="+972506372990",
    from_="+972556669100",
    body="This is the ship that made the Kessel Run in fourteen parsecs?",
    media_url="https://c1.staticflickr.com/3/2899/14341091933_1e92e62d12_b.jpg")





if __name__ == '__main__':
	app.run()
