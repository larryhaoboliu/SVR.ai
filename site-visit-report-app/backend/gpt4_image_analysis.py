import base64
import requests

# OpenAI API Key
api_key = "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"

# Function to encode the image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

# Path to your image
image_path = "C:/Larry/apple.jpg"

# Getting the base64 string
base64_image = encode_image(image_path)

headers = {
  "Content-Type": "application/json",
  "Authorization": f"Bearer {api_key}"
}

payload = {
  "model": "gpt-4o-mini",
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

response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

print(response.json())