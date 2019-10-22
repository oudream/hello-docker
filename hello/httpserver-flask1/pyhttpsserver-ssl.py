from OpenSSL import SSL
from flask import Flask
from flask import render_template

app = Flask(__name__)
context = SSL.Context(SSL.SSLv23_METHOD)
context.use_privatekey_file('/Users/rwang/testssl/test.key')
context.use_certificate_file('/Users/rwang/testssl/test.crt')


@app.route("/")
def hello():
	return render_template("index.html")

if __name__ == "__main__":
    app.run(host='127.0.0.1',port=8443,
        debug = True, ssl_context=context)