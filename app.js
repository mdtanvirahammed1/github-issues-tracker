let allIssues = [];

function login() {
  const usernameInput = document.getElementById("username").value;
  const passwordInput = document.getElementById("password").value;

  if (usernameInput === "admin" && passwordInput === "admin123") {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    loadIssues();
  } else {
    alert("Invalid username or password! Please try again.");
  }
} 

async function loadIssues() {
  toggleSpinner(true);
  try {
    const response = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await response.json();
    allIssues = data.data;
    displayIssues(allIssues);
  } catch (error) {
    console.error("Error loading issues:", error);
    alert("Failed to fetch data from the server.");
  } finally {
    toggleSpinner(false);
  }
}