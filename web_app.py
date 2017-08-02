from flask import Flask, url_for, flash, render_template, redirect, request, g, send_from_directory
from flask import session as login_session
import locale, os
from werkzeug.utils import secure_filename
from datetime import datetime
import pyrebase
from passlib.hash import pbkdf2_sha256 as crypt
import plivo



UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config['DEBUG']=True
app.secret_key = "RPoint2017"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def main_page():
	return render_template('Home.html')

@app.route('/Home', methods=['GET'])
def Make_Home_Page():
	try:
		send_to_phone_number("050","hellow")
	except:
		print('Caught exception')
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
def send_sms_to():
	return render_template("send_sms_to.html")

#send sms to the phone numbers
@app.route("/get_first_phone_number_list", methods=["GET","POST"])
def get_first_phone_number_list():
	print("here-get_first_phone_number_list")
	req = request.form
	data_list = req['phoneNumberList']
	data_list=str(data_list)
	print('request:')
	print(data_list+"first list")
	print(send_messages(data_list,"http://rpoint.co/results/id",True))
	return redirect(url_for('Make_Home_Page'))

@app.route("/get_second_phone_number_list", methods=["GET","POST"])
def get_second_phone_number_list():
	print("here-get_second_phone_number_list")
	req = request.form
	data_list = req['phoneNumberList']
	data_list=str(data_list)
	print('request:')
	print(data_list+"second list")
	print(send_messages(data_list,"alcohol effects may be reduced within 5 minutes",False))
	return render_template("send_sms_to.html")

		
	

def send_messages(string_list_of_phones,text, is_first):
	print("send message")
	print(string_list_of_phones)
	if string_list_of_phones!="[]":
		print("in the if condition")
		string_list_of_phones=string_list_of_phones[1:-1]
		print(string_list_of_phones)
		string_list_of_phones=string_list_of_phones.split(",")
		for phone_number in string_list_of_phones:
			phone_number=phone_number[1:-1]
			phone_number=phone_number.split("/")
			print(phone_number)
			if is_first:
				text=text[:-2]+phone_number[1]
			send_to_phone_number(phone_number,text)
		#test_plivo()
		return True
	else:
		return False

def send_to_phone_number(phone_number, text):
	# put your own credentials here
	print("here-send_to_phone_number")
	auth_id = "MAZDM1NJZLNZGYNTIWMT"
	auth_token = "ZGY4YTA4MzFlMjc1MTRiYmQ2ZmQxNDYyODdkNDAw"

	p = plivo.RestAPI(auth_id, auth_token)
	print("after p= plivo")
	params = {
	    'src': '972506372990', # Sender's phone number with country code
	    'dst' : '972556669100', # TODO change to the user phone number (parameter)
	    'text' : 'test',#text, # Your SMS Text Message - English
	    'url' : "rpoint-sms.herokuapp.com", # The URL to which with the status of the message is sent
	    'method' : 'POST' # The method used to call the url
	}
	print("after prams")
	response = p.send_message(params)
	print("afret respons=p")
	# Prints the complete response
	print (str(response))









if __name__ == '__main__':
	app.run()
