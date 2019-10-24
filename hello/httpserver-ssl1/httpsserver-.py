import os

from flask import Flask
from flask import render_template

app = Flask(__name__)


@app.route("/")
def hello():
    return render_template(os.path.join(os.path.dirname(__file__), 'index.html'))


if __name__ == "__main__":
    context = (os.path.join(os.path.dirname(__file__), 'ca.crt'), os.path.join(os.path.dirname(__file__), 'ca.key'))
    app.run(host='127.0.0.1', port=8999, ssl_context=context, threaded=True, debug=True)
