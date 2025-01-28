// Function to dynamically update the image preview
function updateImagePreview() {
    const imageInput = document.getElementById('image');
    const preview = document.getElementById('preview');
    const imageUrl = imageInput.value;

    if (imageUrl.trim() === '') {
        // Clear the preview if the input is empty
        preview.src = '';
        preview.alt = 'Image Preview';
    } else {
        // Validate the URL format before assigning it
        try {
            new URL(imageUrl); // Check if it's a valid URL
            preview.src = imageUrl; // Assign if valid
            preview.alt = 'Loading image...';
        } catch (e) {
            console.log('Invalid URL, not setting preview src.');
            preview.src = ''; // Clear the src if invalid
            preview.alt = 'Invalid Image URL';
        }
    }
}

// Check if a warning exists
const warningBox = document.getElementById('warning-box');
if (warningBox.textContent.trim() !== '') {
  warningBox.style.display = 'block'; // Show the warning box if there's a message

  // Optional: Automatically hide the warning box after 5 seconds
  setTimeout(() => {
    warningBox.style.display = 'none';
  }, 5000);
}


// Ensure the preview updates on page load for pre-filled input values
window.addEventListener('DOMContentLoaded', () => {
    updateImagePreview(); // Call this function to set the initial preview
});
