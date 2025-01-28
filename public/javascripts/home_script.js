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
        // Set the preview source to the input value
        preview.src = imageUrl;
        preview.alt = 'Loading image...';
    }
}
