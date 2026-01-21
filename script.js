let startTime = null;
let completedHours = localStorage.getItem('completedHours')
    ? parseInt(localStorage.getItem('completedHours'))
    : 0;

let logs = localStorage.getItem('logs')
    ? JSON.parse(localStorage.getItem('logs'))
    : [];

let requiredHours = localStorage.getItem('requiredHours')
    ? parseInt(localStorage.getItem('requiredHours'))
    : 0;

document.getElementById("completed").textContent = completedHours;
updateRemaining();

let chart = new Chart(document.getElementById("timeChart"), {
    type: "pie",
    data: {
        labels: ["Completed", "Remaining"],
        datasets: [{
            data: [completedHours, requiredHours - completedHours],
            backgroundColor: ["#4caf50", "#f44336"]
        }]
    }
});

function saveRequiredHours() {
    requiredHours = parseInt(document.getElementById("requiredHours").value);
    localStorage.setItem("requiredHours", requiredHours);
    updateRemaining();
    updateChart();
}

function startDuty() {
    startTime = new Date();
    alert("Duty started at " + startTime.toLocaleTimeString());
}

function endDuty() {
    if (!startTime) {
        alert("You haven't started duty yet!");
        return;
    }

    let endTime = new Date();
    let hours = (endTime - startTime) / (1000 * 60 * 60);
    let today = new Date().toISOString().split('T')[0];

    completedHours += hours;
    logs.push({ date: today, hours: hours });

    localStorage.setItem("logs", JSON.stringify(logs));
    localStorage.setItem("completedHours", completedHours);

    startTime = null;
    document.getElementById("completed").textContent = completedHours.toFixed(2);

    updateRemaining();
    updateChart();
    renderLogs();

    alert("Duty ended at " + endTime.toLocaleTimeString() + ". Hours added: " + hours.toFixed(2) + "You did well!");
}

function addManualHoursI() {
    let date = document.getElementById("manualDate").value;
    let hours = parseFloat(document.getElementById("manualHours").value);

    if (!date || !hours) {
        alert("Please enter both date and hours.");
        return;
    }

    completedHours += hours;
    logs.push({ date: date, hours: hours });

    localStorage.setItem("completedHours", completedHours);
    localStorage.setItem("logs", JSON.stringify(logs));

    document.getElementById("completed").textContent = completedHours.toFixed(2);   
    updateRemaining();
    updateChart();
    renderLogs();
}

function renderLogs() {
    let logList = document.getElementById("log");
    logList.innerHTML = "";
    logs.forEach(log => {
        let li = document.createElement("li");
        li.textContent = `${log.date}: ${log.hours.toFixed(2)} hrs`;
        logList.appendChild(li);
    });
}

renderLogs();

function toggleDarkMode() {
    document.body.classList.toggle("dark");

    let isDark = document.body.classList.contains("dark");
    localStorage.setItem("darkMode", isDark);
}

if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
}

function updateRemaining() {
    let remaining = Math.max(requiredHours - completedHours, 0);
    document.getElementById("remaining").textContent = remaining.toFixed(2);
}

function updateChart() {
    chart.data.datasets[0].data = [completedHours, requiredHours - completedHours];
    chart.update();
}   