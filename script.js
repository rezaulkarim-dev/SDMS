// Initial Mock Data for Shelters in Chattogram
const shelters = [
    {
        id: 1,
        name: "Halishahar High School Shelter",
        area: "Halishahar H-Block",
        capacity: 300,
        occupied: 180,
        lastUpdated: "10 mins ago"
    },
    {
        id: 2,
        name: "Patenga Multipurpose Cyclone Shelter",
        area: "Patenga Sea Beach Road",
        capacity: 400,
        occupied: 400,
        lastUpdated: "4 mins ago"
    },
    {
        id: 3,
        name: "Agrabad Govt. Colony School",
        area: "Agrabad",
        capacity: 250,
        occupied: 120,
        lastUpdated: "18 mins ago"
    },
    {
        id: 4,
        name: "Bakalia Govt. High School",
        area: "Bakalia",
        capacity: 350,
        occupied: 290,
        lastUpdated: "25 mins ago"
    },
    {
        id: 5,
        name: "Anwara Coastal Relief Center",
        area: "Anwara",
        capacity: 500,
        occupied: 500,
        lastUpdated: "2 mins ago"
    },
    {
        id: 6,
        name: "Khulshi Community Center Shelter",
        area: "GEC / Khulshi",
        capacity: 200,
        occupied: 85,
        lastUpdated: "30 mins ago"
    }
];

let currentFilter = 'all';
let volunteerTotal = 128;

// Render Shelters to the Page
function renderShelters() {
    const grid = document.getElementById('shelterGrid');
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    grid.innerHTML = '';

    let openCount = 0;

    shelters.forEach(shelter => {
        const isFull = shelter.occupied >= shelter.capacity;
        if (!isFull) openCount++;

        // Filter by Status (All / Available / Full)
        if (currentFilter === 'available' && isFull) return;
        if (currentFilter === 'full' && !isFull) return;

        // Filter by Search Box Text
        const matchesSearch = shelter.name.toLowerCase().includes(searchQuery) ||
                              shelter.area.toLowerCase().includes(searchQuery);
        if (!matchesSearch) return;

        // Calculate Percentage for Progress Bar
        const percentage = Math.min(Math.round((shelter.occupied / shelter.capacity) * 100), 100);
        const barColor = isFull ? '#dc2626' : (percentage > 80 ? '#f59e0b' : '#16a34a');

        const card = document.createElement('div');
        card.className = 'shelter-card';
        card.innerHTML = `
            <div class="shelter-top">
                <h3>${shelter.name}</h3>
                <span class="status-badge ${isFull ? 'status-full' : 'status-available'}">
                    ${isFull ? '🔴 FULL' : '🟢 Space Available'}
                </span>
            </div>
            <p class="shelter-info">📍 <strong>Location:</strong> ${shelter.area}</p>
            <div>
                <small><strong>Capacity:</strong> ${shelter.occupied} / ${shelter.capacity} people (${percentage}%)</small>
                <div class="capacity-bar-bg">
                    <div class="capacity-bar-fill" style="width: ${percentage}%; background-color: ${barColor};"></div>
                </div>
            </div>
            <div class="shelter-meta">
                <span>🕒 Updated: ${shelter.lastUpdated}</span>
                <span><strong>${shelter.capacity - shelter.occupied}</strong> spots left</span>
            </div>
        `;
        grid.appendChild(card);
    });

    // Update Top Stat Card for Open Shelters
    document.getElementById('openShelterCount').innerText = openCount;
}

// Search Input Trigger
function filterShelters() {
    renderShelters();
}

// Filter Buttons Trigger (All / Available / Full)
function filterByStatus(status, btnElement) {
    currentFilter = status;
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    renderShelters();
}

// Populate Dropdown inside Manager Modal
function populateManagerDropdown() {
    const select = document.getElementById('manageShelterSelect');
    select.innerHTML = '';
    shelters.forEach(shelter => {
        const option = document.createElement('option');
        option.value = shelter.id;
        option.innerText = `${shelter.name} (Max: ${shelter.capacity})`;
        select.appendChild(option);
    });
}

// Open and Close Popup Modals
function openModal(modalId) {
    if (modalId === 'loginModal') {
        populateManagerDropdown();
    }
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Handle Volunteer Form Submission
function submitVolunteer(event) {
    event.preventDefault();
    const name = document.getElementById('volName').value;
    const area = document.getElementById('volArea').value;
    const skill = document.getElementById('volSkill').value;

    volunteerTotal++;
    document.getElementById('volunteerCount').innerText = volunteerTotal;

    alert(`Thank you, ${name}! You are registered for ${skill} in ${area}.`);
    document.getElementById('volunteerForm').reset();
    closeModal('volunteerModal');
}

// Handle Shelter Manager Capacity Update
function updateShelterCapacity(event) {
    event.preventDefault();
    const shelterId = parseInt(document.getElementById('manageShelterSelect').value);
    const newOccupancy = parseInt(document.getElementById('newOccupancy').value);

    const shelter = shelters.find(s => s.id === shelterId);
    if (shelter) {
        if (newOccupancy > shelter.capacity) {
            alert(`Error: Occupancy cannot exceed maximum capacity of ${shelter.capacity}.`);
            return;
        }
        shelter.occupied = newOccupancy;
        shelter.lastUpdated = "Just now";
        renderShelters();
        alert(`Updated ${shelter.name} capacity to ${newOccupancy}/${shelter.capacity}!`);
        document.getElementById('managerForm').reset();
        closeModal('loginModal');
    }
}

// Close Modal if Clicking Outside Box
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// Load Shelters When Page Opens
window.onload = function() {
    renderShelters();
};