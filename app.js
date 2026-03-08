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

function displayIssues(issues) {
  const container = document.getElementById("issuesContainer");
  const countElement = document.getElementById("issueCount");
  
  countElement.innerText = `${issues.length} Issues`;
  
  container.innerHTML = "";

  issues.forEach((issue) => {
    const borderColor = issue.status === "open" ? "border-green-500" : "border-purple-500";
    
    const priorityColor = 
      issue.priority === "HIGH" ? "text-red-500" : 
      issue.priority === "MEDIUM" ? "text-yellow-500" : "text-gray-500";

    container.innerHTML += `
      <div onclick="openIssueModal('${issue.id}')" class="bg-white p-5 rounded-xl shadow border-t-4 ${borderColor} cursor-pointer hover:shadow-lg transition-all flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-sm text-gray-800 leading-tight line-clamp-2">${issue.title}</h3>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 ${priorityColor}">${issue.priority}</span>
          </div>
          <p class="text-gray-500 text-xs mb-3 line-clamp-2">${issue.description}</p>
          
          <div class="flex gap-2 mb-4">
            <span class="bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded font-bold">BUG</span>
            <span class="bg-yellow-100 text-yellow-600 text-[10px] px-2 py-1 rounded font-bold">HELP WANTED</span>
          </div>
        </div>

        <div class="border-t pt-3">
          <p class="text-[11px] text-gray-600 font-medium">#${issue.id} by ${issue.author}</p>
          <p class="text-[10px] text-gray-400 mt-1">${new Date(issue.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    `;
  });
}

function filterIssues(type) {
  const buttons = ["btn-all", "btn-open", "btn-closed"];
  buttons.forEach(id => document.getElementById(id).classList.remove("active-tab"));
  document.getElementById(`btn-${type}`).classList.add("active-tab");

  let filteredData = allIssues;
  if (type === "open") {
    filteredData = allIssues.filter(i => i.status === "open");
  } else if (type === "closed") {
    filteredData = allIssues.filter(i => i.status === "closed");
  }

  displayIssues(filteredData);
}

async function searchIssue() {
  const searchText = document.getElementById("searchInput").value;
  if (!searchText) return loadIssues();

  toggleSpinner(true);
  try {
    const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`);
    const data = await response.json();
    displayIssues(data.data);
  } catch (error) {
    console.error("Search error:", error);
  } finally {
    toggleSpinner(false);
  }
}

async function openIssueModal(id) {
  try {
    const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const data = await response.json();
    const issue = data.data;

    const modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = `
      <div class="space-y-4">
        <div>
          <span class="px-2 py-1 rounded text-[10px] font-bold ${issue.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}">
            ${issue.status.toUpperCase()}
          </span>
          <h2 class="text-xl font-bold mt-2 text-gray-800">${issue.title}</h2>
        </div>
        
        <p class="text-gray-600 text-sm leading-relaxed">${issue.description}</p>
        
        <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg text-sm">
          <div>
            <p class="text-gray-400 text-xs">Assignee</p>
            <p class="font-semibold text-gray-700">${issue.author}</p>
          </div>
          <div>
            <p class="text-gray-400 text-xs">Priority</p>
            <p class="font-semibold text-red-500">${issue.priority}</p>
          </div>
        </div>
        
        <button onclick="closeModal()" class="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
          Close Details
        </button>
      </div>
    `;
    document.getElementById("issueModal").classList.remove("hidden");
  } catch (error) {
    alert("Error loading details.");
  }
}

function closeModal() {
  document.getElementById("issueModal").classList.add("hidden");
}

function toggleSpinner(show) {
  const spinner = document.getElementById("spinner");
  if (show) {
    spinner.classList.remove("hidden");
  } else {
    spinner.classList.add("hidden");
  }
}