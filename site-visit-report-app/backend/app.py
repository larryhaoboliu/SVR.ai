import base64
import requests
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# OpenAI API Key
api_key = os.getenv("OPENAI_API_KEY")  # It's better to use environment variables for security

# Function to encode the image to base64
def encode_image(image_file):
    return base64.b64encode(image_file.read()).decode('utf-8')

# Endpoint to handle image analysis
@app.route("/analyze-image", methods=["POST"])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image = request.files['image']

    try:
        # Encode the image to base64
        base64_image = encode_image(image)

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }

        payload = {
            "model": "gpt-4o-mini",  # Use the correct GPT model
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "What’s in this image?"
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 300
        }

        # Send the request to OpenAI API
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

        # Return the generated description or error
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            app.logger.error(f"OpenAI API error: {response.status_code} - {response.text}")
            return jsonify({"error": response.text}), response.status_code

    except Exception as e:
        app.logger.error(f"Error processing image: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Run Flask on port 5001
