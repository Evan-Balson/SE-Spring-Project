// Get the elements
const searchBtn = document.getElementById("search-btn");
const dropdown = document.getElementById("search-dropdown");
const searchInput = document.getElementById("search-input");  // Get the search input field

// Toggle dropdown visibility when clicking the search button
searchBtn.addEventListener("click", function(event) {
  event.preventDefault(); // Prevent the default link action
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});

// Close the dropdown and clear the input if you click anywhere outside of it
document.addEventListener("click", function(event) {
  if (!searchBtn.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.style.display = "none";  // Hide the dropdown
    searchInput.value = "";  // Clear the input field
  }
});

// When the small image is selected display it in frame
script
  function setMainImage(src) {
    document.getElementById('mainImage').src = src;
  }


script
  // Function to handle product click
  function handleProductClick(productId) {
    // Create a form to send the product ID to the backend using POST
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/'; // The route where the POST request should go
    
    // Create an input field to hold the product ID
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'product_id';  // Name should match the one in your controller
    input.value = productId;
    
    form.appendChild(input);
    
    // Submit the form to trigger the POST request
    document.body.appendChild(form);
    form.submit();
  }

script
  // /js/features.js
  window.addEventListener('DOMContentLoaded', function() {
  // Get the container that holds redirect information
  const container = document.getElementById("redirectPageContainer");
  
  // If the container doesn't exist on this page, do nothing
  if (!container) return;

  // Extract our redirect parameters from the data attributes
  let seconds = parseInt(container.dataset.seconds, 10);
  let redirectUrl = container.dataset.redirectUrl || "/";

  // Countdown logic
  function displaySeconds() {
    if (seconds > 0) {
      seconds--;
      document.getElementById("secondsdisplay").innerText =
        "This Page Will Be Redirected In " + seconds + " Seconds...";
    } else {
      document.getElementById("secondsdisplay").innerText = "Redirecting now...";
      redirectPage();
    }
  }

  // Perform the actual redirect
  function redirectPage() {
    window.location = redirectUrl;
  }

  // Kick off the countdown once per second
  setInterval(displaySeconds, 1000);
});







