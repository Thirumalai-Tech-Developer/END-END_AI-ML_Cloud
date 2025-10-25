import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

STORE_DATA = 'data'
os.mkdir(STORE_DATA) if not os.path.exists(STORE_DATA) else None

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    file_path = os.path.join(STORE_DATA, file.filename)
    file.save(file_path)

    return jsonify({'message': f'File {file.filename} uploaded successfully'}), 200

# @app.route('/preprocess', methods=['POST'])

if __name__ == '__main__':
    app.run(debug=True, port=5000)