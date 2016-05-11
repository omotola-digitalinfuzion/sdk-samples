from flask import Flask, request, redirect, url_for, send_from_directory, render_template,jsonify
app = Flask(__name__)

import json

# @app.route('/<path:path>')
# def static_proxy(path):
#     console.log(path)
#     # send_static_file will guess the correct MIME type
#     return app.send_static_file(path)

@app.route("/")
def hello():
    return app.send_static_file('hello_world.html')

@app.route("/template_navbar")
def template_navbar():
    return render_template('navbar.html',options={'items':["About","Help"]})

@app.route("/template_navbar_fixed")
def template_navbar_fixed():
    return render_template('navbar_fixed.html')

@app.route("/template_navbar_static")
def template_navbar_static():
    return render_template('navbar_static.html')

@app.route("/contents/<page>")
def content(page):
    return app.send_static_file(page)

@app.route("/api/<param>")
def resful_api(param):
    if param.lower() in ['file_menu']:
        return jsonify({'items':['New','Open','Exit']})
    return jsonify({'your_request':'all the fails'})

if __name__ == "__main__":
    print(app.url_map)
    app.run(debug=True)