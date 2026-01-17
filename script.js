// script.js – handles Aadhar image upload, sends to n8n webhook, and displays extracted data

// TODO: Replace this placeholder with your actual n8n webhook URL
const N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/aadhaar-upload";

/**
 * Show a temporary toast/notification (simple implementation)
 */
function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.padding = '0.8rem 1.2rem';
  toast.style.background = isError ? 'rgba(255,0,0,0.8)' : 'rgba(0,150,0,0.8)';
  toast.style.color = '#fff';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 2px 12px rgba(0,0,0,0.3)';
  toast.style.zIndex = 1000;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/**
 * Populate the result section with extracted fields.
 */
function populateResult(data) {
  // Fill input values – use empty string if missing
  document.getElementById('name').value = data.name || '';
  document.getElementById('dob').value = data.dob || '';
  document.getElementById('gender').value = data.gender || '';
  document.getElementById('idNumber').value = data.idNumber || '';
}

/**
 * Handle form submission – upload image to n8n webhook.
 */
async function handleUpload(event) {
  event.preventDefault();
  const fileInput = document.querySelector('input[name="file"]');
  if (!fileInput.files.length) {
    showToast('Please select an image file.', true);
    return;
  }
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);

  try {
    showToast('Uploading…');
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server responded with ${response.status}: ${errText}`);
    }

    const result = await response.json();
    // Expected format: { name, dob, aadharNo, address }
    populateResult(result);
    showToast('Extraction successful!');
  } catch (err) {
    console.error('Upload error:', err);
    showToast(`Error: ${err.message}`, true);
  }
}

// Attach listener after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('uploadForm');
  if (form) {
    form.addEventListener('submit', handleUpload);
  }
});
