// Section navigation
function showSection(id) {
    const sections = document.querySelectorAll('.premium-section');
    sections.forEach(sec => sec.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// Health Score Calculator
function calculateHealthScore() {
    const age = parseInt(document.getElementById("scoreAge").value);
    const weight = parseFloat(document.getElementById("scoreWeight").value);
    const height = parseFloat(document.getElementById("scoreHeight").value) / 100;
    const symptoms = document.getElementById("scoreSymptoms").value.split(',').filter(s => s.trim() !== '');
    const lifestyle = parseInt(document.getElementById("scoreLifestyle").value);

    // BMI
    const bmi = weight / (height * height);

    // Simple scoring logic
    let score = 100;
    if (age > 50) score -= 15;
    if (bmi < 18.5 || bmi > 25) score -= 15;
    score -= symptoms.length * 5;
    score -= lifestyle * 3;

    if (score < 0) score = 0;

    document.getElementById("healthScoreResult").innerHTML = `<p>💯 Health Score: ${score}/100</p>`;
}

// Smart Emergency Assistant
function callAmbulance() {
    window.location.href = "tel:108";
}

function openNearbyHospitals() {
    window.open("https://www.google.com/maps/search/hospital+near+me/", "_blank");
}

function shareLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            document.getElementById("emergencyResult").innerHTML = 
                `📍 Your Location: <a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">View on Google Maps</a>`;
        });
    } else {
        alert("Geolocation not supported");
    }
}

function showBloodBanks() {
    document.getElementById("emergencyResult").innerHTML = `
        <ul>
            <li><a href="https://www.indianredcross.org/ircs/program/bloodbank/" target="_blank">National Blood Bank Directory</a></li>
            <li>Local hospitals usually provide blood bank contacts</li>
        </ul>
    `;
}

// Heart & Oxygen Level Detector
function calculateHeartOxygen() {
    const heart = parseInt(document.getElementById("heartRate").value);
    const oxygen = parseInt(document.getElementById("oxygenLevel").value);
    let heartScore = 10;
    let oxygenScore = 10;

    if (heart < 60 || heart > 100) heartScore -= 3;
    if (oxygen < 95) oxygenScore -= 3;

    if (heartScore < 0) heartScore = 0;
    if (oxygenScore < 0) oxygenScore = 0;

    document.getElementById("heartOxygenResult").innerHTML =
        `<p>❤️ Heart Rate Score: ${heartScore}/10</p>
         <p>🩸 Oxygen Level Score: ${oxygenScore}/10</p>`;
}












// --- Rating Unlock System ---
const stars = document.querySelectorAll("#rating-stars .star");
let selectedRating = 0;

stars.forEach(star => {
    star.addEventListener("mouseover", () => highlightStars(star.dataset.value));
    star.addEventListener("click", () => {
        selectedRating = star.dataset.value;
        localStorage.setItem("symptomaxRating", selectedRating);
        unlockPremium();
    });
});

function highlightStars(rating) {
    stars.forEach(star => {
        if(star.dataset.value <= rating){
            star.classList.add("selected");
        } else {
            star.classList.remove("selected");
        }
    });
}

document.getElementById("submitRating").addEventListener("click", () => {
    if(selectedRating > 0) unlockPremium();
    else alert("Please select a rating first!");
});

function unlockPremium() {
    document.getElementById("rating-panel").style.display = "none";
    document.getElementById("premium-content").style.display = "block";
}

// Check if already unlocked
if(localStorage.getItem("symptomaxRating")) unlockPremium();

// --- Heart & Oxygen Health Detector ---
function calculateHeartOxygen() {
    const heart = parseInt(document.getElementById("heartInput").value);
    const oxygen = parseInt(document.getElementById("oxygenInput").value);
    let heartScore = 0;
    let oxygenScore = 0;

    if(heart >= 60 && heart <= 100) heartScore = 10;
    else if(heart < 60) heartScore = 7;
    else if(heart > 100) heartScore = 5;

    if(oxygen >= 95 && oxygen <= 100) oxygenScore = 10;
    else if(oxygen >= 90) oxygenScore = 7;
    else oxygenScore = 5;

    const avgScore = Math.round((heartScore + oxygenScore)/2);
    document.getElementById("heartOxygenResult").innerHTML = `<p>Health Rating: ${avgScore}/10</p>`;
}











// Load numbers from local storage on page load
window.onload = function() {
    for (let i = 1; i <= 2; i++) {
        const number = localStorage.getItem('emergencyNumber' + i);
        if (number) {
            document.getElementById('emergencyNumber' + i).value = number;
            showCallButton(i, number);
        }
    }
}

// Save number to local storage
function saveNumber(slot) {
    const input = document.getElementById('emergencyNumber' + slot);
    const number = input.value.trim();
    if(number) {
        localStorage.setItem('emergencyNumber' + slot, number);
        showCallButton(slot, number);
        alert('Number saved!');
    } else {
        alert('Please enter a valid number.');
    }
}

// Edit number
function editNumber(slot) {
    document.getElementById('emergencyNumber' + slot).focus();
}

// Show call button
function showCallButton(slot, number) {
    const callBtn = document.getElementById('callNumber' + slot);
    callBtn.href = 'tel:' + number;
    callBtn.style.display = 'inline-block';
}
