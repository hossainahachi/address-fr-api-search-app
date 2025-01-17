from flask import Flask, request, render_template, jsonify
import requests

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q', '').strip()
    limit = request.args.get('limit', 5)

    # Validate the limit parameter
    try:
        limit = int(limit)
        if limit < 1 or limit > 99:  # Validate limit range
            return jsonify({'error': 'The "limit" parameter must be between 1 and 99'}), 400
    except ValueError:
        return jsonify({'error': 'The "limit" parameter must be a valid integer'}), 400

    if not query:  # Ensure the query is not empty
        return jsonify({'error': 'The "q" parameter cannot be empty'}), 400

    # French address API endpoint
    api_url = f"https://api-adresse.data.gouv.fr/search/?q={query}&limit={limit}"
    try:
        print("api_url=" + api_url)
        response = requests.get(api_url)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
