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







