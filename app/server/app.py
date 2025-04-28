from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/square', methods=['POST'])
def square_number():
    print(f"Received data: {request.get_json()}")
    data = request.get_json()
    number = data.get('number')

    if number is None:
        return jsonify({'error': 'No number provided'}), 400

    result = number ** 2
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)

