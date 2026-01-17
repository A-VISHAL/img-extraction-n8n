📘 README.md – Aadhaar OCR Auto-Fill Workflow (n8n + Docker)
🚀 Overview

This project is an automated workflow built using n8n and Docker that extracts key information from Aadhaar-like ID card images. Users upload an image through a Webhook endpoint, and the system processes it using the OCR.Space pre-built OCR API, then returns structured data including:

Name

Gender

ID Number

Address (if available)

The extracted output can be used to auto-fill forms, KYC demo workflows, or identity-based automation without installing any OCR tools locally.

🛠 Features

✔ Accepts image uploads via Webhook

✔ Uses OCR.Space API (Free tier)

✔ Extracts Name, Gender, ID number

✔ Custom parsing using JavaScript Code node

✔ Works fully inside Docker

✔ No Tesseract or ML model setup required

📂 Workflow Structure
Webhook → File Write → HTTP OCR Request → Code Parser → Respond to Webhook

1. Webhook Node

Receives Aadhaar image as binary (file0).

2. File Node

Saves the uploaded file to /tmp/aadhaar.png.

3. HTTP Request Node

Sends the image to OCR.Space using:

Body Type: Form-Data

File: n8n Binary File (file0)

Query/Body Params: apikey, language=eng

4. Code Node

Extracts structured fields using regex:

const text = $json.ParsedResults[0].ParsedText;
const id = text.match(/\d{4}\s\d{4}\s\d{4}/)?.[0] || "";
const gender = text.match(/\b(Male|Female)\b/i)?.[0] || "";

const lines = text.split("\n").map(l => l.trim()).filter(l => l);
let name = "";
for (const l of lines) {
  if (/aadhaar/i.test(l) || /\b(male|female)\b/i.test(l) || /\d{4}/.test(l)) continue;
  name = l;
  break;
}

return {
  json: { name, gender, idNumber: id, rawText: text }
};

5. Respond to Webhook

Returns the final JSON for frontend auto-fill.

🔧 Requirements

Docker installed

n8n running in any environment

OCR.Space API key (use FREE helloworld key for testing)

▶️ How to Run

Start n8n in Docker:

docker run -it --rm -p xxxx:xxxx -v ~/.n8n:/home/node/.n8n n8nio/n8n


Open in browser:

http://localhost:xxxx


Trigger Webhook by uploading an image at:

http://localhost:xxxx/webhook-test/aadhaar-upload

📦 Output Example
{
  "name": "Cristiano Ronaldo",
  "gender": "Male",
  "idNumber": "9876 5432 1098"
}

📝 Notes

This is a demo system (not official Aadhaar verification).

Works with any ID card or text image.

You can replace OCR.Space with any other OCR provider.
