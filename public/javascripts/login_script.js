const warningBox = document.getElementById('warning-box');
if (warningBox.textContent.trim() !== '') {
  warningBox.style.display = 'block'; // Show the warning box if there's a message

  // Optional: Automatically hide the warning box after 5 seconds
  setTimeout(() => {
    warningBox.style.display = 'none';
  }, 5000);
}