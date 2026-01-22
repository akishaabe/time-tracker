let startTime = null;

let completedHours = localStorage.getItem("completedHours")
    ? parseFloat(localStorage.getItem("completedHours"))
    : 0;

let requiredHours = localStorage.getItem("requiredHours")
    ? parseFloat(localStorage.getItem("requiredHours"))
    : 0;

let logs = localStorage.getItem("logs")
    ? JSON.parse(localStorage.getItem("logs"))
    : [];

document.getElementById("completed").textContent = completedHours.toFixed(2);
updateRemaining();

/* ===== CHART SETUP ===== */
const ctx = document.getElementById("ojtChart").getContext("2d");

let chart = new Chart(ctx, {
    type: "doughnut",
    data: {
        labels: ["Completed", "Remaining"],
        datasets: [{
            data: [
                completedHours,
                Math.max(requiredHours - completedHours, 0)
            ],
            backgroundColor: ["#22c55e", "#e5e7eb"],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
            legend: {
                position: "bottom"
            }
        }
    }
});

/* ===== FUNCTIONS ===== */

function saveRequiredHours() {
    requiredHours = parseFloat(document.getElementById("requiredHours").value);
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
    let today = new Date().toISOString().split("T")[0];

    completedHours += hours;
    logs.push({ date: today, hours });

    localStorage.setItem("completedHours", completedHours);
    localStorage.setItem("logs", JSON.stringify(logs));

    startTime = null;
    document.getElementById("completed").textContent = completedHours.toFixed(2);

    updateRemaining();
    updateChart();
    renderLogs();

    alert(`Duty ended. ${hours.toFixed(2)} hours added 💪`);
}

function addManualHours() {
    let date = document.getElementById("manualDate").value;
    let hours = parseFloat(document.getElementById("manualHours").value);

    if (!date || !hours) {
        alert("Please enter date and hours.");
        return;
    }

    completedHours += hours;
    logs.push({ date, hours });

    localStorage.setItem("completedHours", completedHours);
    localStorage.setItem("logs", JSON.stringify(logs));

    document.getElementById("completed").textContent = completedHours.toFixed(2);

    updateRemaining();
    updateChart();
    renderLogs();
}

function renderLogs() {
    let logList = document.getElementById("logs");
    logList.innerHTML = "";

    logs.forEach(log => {
        let li = document.createElement("li");
        li.textContent = `${log.date} — ${log.hours.toFixed(2)} hrs`;
        logList.appendChild(li);
    });
}

renderLogs();

function updateRemaining() {
    let remaining = Math.max(requiredHours - completedHours, 0);
    document.getElementById("remaining").textContent = remaining.toFixed(2);
}

function updateChart() {
    chart.data.datasets[0].data = [
        completedHours,
        Math.max(requiredHours - completedHours, 0)
    ];
    chart.update();
}

/* ===== DARK MODE ===== */
function toggleDarkMode() {
    document.body.classList.toggle("dark");
    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );
}

if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
}

/* ===== EXPORTS ===== */
function exportCSV() {
    let csv = "Date,Hours\n";
    logs.forEach(log => {
        csv += `${log.date},${log.hours.toFixed(2)}\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "ojt_logs.csv";
    a.click();
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    doc.text("OJT Daily Logs", 10, 10);

    let y = 20;
    logs.forEach(log => {
        doc.text(`${log.date} - ${log.hours.toFixed(2)} hrs`, 10, y);
        y += 8;
    });

    doc.save("ojt_logs.pdf");
}
