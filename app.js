function login(){
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    if(username === "admin" && password === "admin123"){
        document.getElementById("loginPage").classList.add("hidden")
        document.getElementById("dashboard").classList.remove("hidden")
        loadIssues()
}
else{
    alert("Invalid username or password")
}
}

