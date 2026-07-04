// Form validation for the contact form
function validateForm() {
  var name = document.forms['contactForm']['name'].value;
  var email = document.forms['contactForm']['email'].value;
  var message = document.forms['contactForm']['message'].value;

  if (name.trim() == '' || email.trim() == '' || message.trim() == '') {
    alert('Please fill in all fields in the contact form.');
    return false;
  }
  return true;
}

// Modal pop-up for watch details
function showModal() {
  var modal = document.getElementById('watchModal');
  modal.style.display = 'block';
}

// Close modal on clicking the close button
function closeModal() {
  var modal = document.getElementById('watchModal');
  modal.style.display = 'none';
}

// Event listener for modal close button
document.getElementById('closeModalBtn').addEventListener('click', closeModal);