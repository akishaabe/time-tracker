let startTime = null;
let completedHours = localStorage.getItem('completedHours')
    ? parseInt(localStorage.getItem('completedHours'))
    : 0;

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

    completedHours += hours;
    localStorage.setItem("completedHours", completedHours);

    startTime = null;
    document.getElementById("completed").textContent = completedHours.toFixed(2);
    updateRemaining();
    updateChart();

    alert("Duty ended at " + endTime.toLocaleTimeString() + ". Hours added: " + hours.toFixed(2) + "You did well!");
}

function updateRemaining() {
    let remaining = Math.max(requiredHours - completedHours, 0);
    document.getElementById("remaining").textContent = remaining.toFixed(2);
}

function updateChart() {
    chart.data.datasets[0].data = [completedHours, requiredHours - completedHours];
    chart.update();
}   