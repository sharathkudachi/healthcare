// Healthcare App JavaScript

// Application State
let currentUser = null;
let currentView = 'auth-page';
let appData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadApplicationData();
    initializeApp();
});

// Load application data
async function loadApplicationData() {
    try {
        const response = await fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/f4a8548f2f77bfdb0d93222969c37882/d708ab65-1a09-4216-9cf0-1ed99abccda4/af628061.json');
        appData = await response.json();
    } catch (error) {
        console.error('Failed to load app data:', error);
        // Fallback data
        appData = {
            sample_users: [
                {
                    id: 1,
                    name: "John Smith",
                    email: "john.smith@email.com",
                    role: "patient",
                    age: 35,
                    phone: "+1-555-0123",
                    policy_id: "POL001",
                    medical_conditions: ["Hypertension", "Diabetes Type 2"]
                },
                {
                    id: 2,
                    name: "Dr. Sarah Johnson", 
                    email: "dr.johnson@hospital.com",
                    role: "doctor",
                    specialization: "Cardiology",
                    hospital: "City General Hospital",
                    years_experience: 12,
                    rating: 4.8
                },
                {
                    id: 3,
                    name: "Admin User",
                    email: "admin@healthcare.com", 
                    role: "admin",
                    permissions: ["user_management", "claims_approval", "analytics_view"]
                }
            ],
            insurance_policies: [
                {
                    policy_id: "POL001",
                    user_id: 1,
                    policy_type: "Comprehensive Health",
                    coverage_amount: 500000,
                    premium: 12000,
                    start_date: "2024-01-01",
                    end_date: "2024-12-31", 
                    status: "Active",
                    family_members: 3
                }
            ],
            claims: [
                {
                    claim_id: "CLM001",
                    policy_id: "POL001", 
                    user_id: 1,
                    claim_type: "Hospitalization",
                    claim_amount: 25000,
                    claimed_amount: 22500,
                    status: "Approved",
                    date_filed: "2024-06-15",
                    date_processed: "2024-06-20",
                    hospital: "City General Hospital",
                    description: "Emergency cardiac procedure"
                },
                {
                    claim_id: "CLM002",
                    policy_id: "POL001",
                    user_id: 1, 
                    claim_type: "Pharmacy",
                    claim_amount: 1500,
                    claimed_amount: 0,
                    status: "Under Review",
                    date_filed: "2024-08-01", 
                    hospital: "MedPlus Pharmacy",
                    description: "Monthly diabetes medication"
                }
            ],
            appointments: [
                {
                    appointment_id: "APT001",
                    patient_id: 1,
                    doctor_id: 2,
                    date: "2024-09-15",
                    time: "10:00 AM",
                    type: "Regular Checkup",
                    status: "Confirmed", 
                    notes: "Follow-up for diabetes management"
                }
            ],
            hospitals: [
                {
                    hospital_id: "HOSP001",
                    name: "City General Hospital", 
                    address: "123 Main Street, Downtown",
                    phone: "+1-555-0100",
                    specialties: ["Cardiology", "Orthopedics", "Emergency Medicine"],
                    network_partner: true,
                    rating: 4.5,
                    coordinates: {"lat": 40.7128, "lng": -74.0060}
                },
                {
                    hospital_id: "HOSP002",
                    name: "Metro Health Center",
                    address: "456 Oak Avenue, Midtown", 
                    phone: "+1-555-0200",
                    specialties: ["Internal Medicine", "Pediatrics", "Dermatology"],
                    network_partner: true,
                    rating: 4.2,
                    coordinates: {"lat": 40.7589, "lng": -73.9851}
                }
            ],
            symptom_checker_data: [
                {
                    symptoms: ["fever", "cough", "fatigue"],
                    possible_conditions: [
                        {
                            condition: "Common Cold",
                            probability: 75,
                            urgency: "Low", 
                            recommendation: "Rest and hydration. See doctor if symptoms persist beyond 7 days."
                        },
                        {
                            condition: "Flu",
                            probability: 60,
                            urgency: "Medium",
                            recommendation: "Monitor symptoms. See doctor if fever exceeds 101°F for more than 3 days."
                        }
                    ]
                },
                {
                    symptoms: ["chest pain", "shortness of breath"],
                    possible_conditions: [
                        {
                            condition: "Heart Attack", 
                            probability: 40,
                            urgency: "High",
                            recommendation: "Seek immediate emergency medical attention. Call 911."
                        },
                        {
                            condition: "Anxiety Attack",
                            probability: 35,
                            urgency: "Medium", 
                            recommendation: "Practice breathing exercises. Consult healthcare provider if recurring."
                        }
                    ]
                }
            ],
            dashboard_stats: {
                admin: {
                    total_users: 1250,
                    active_policies: 987,
                    pending_claims: 45,
                    approved_claims_this_month: 123, 
                    total_hospitals: 156,
                    revenue_this_month: 1250000
                },
                doctor: {
                    total_patients: 89,
                    appointments_today: 8,
                    appointments_this_week: 35,
                    pending_prescriptions: 12,
                    avg_rating: 4.8
                },
                patient: {
                    active_policies: 1,
                    claims_filed: 2, 
                    upcoming_appointments: 1,
                    health_score: 85,
                    last_checkup: "2024-07-15"
                }
            },
            notifications: [
                {
                    id: 1,
                    user_id: 1,
                    title: "Appointment Reminder",
                    message: "You have an appointment with Dr. Johnson tomorrow at 10:00 AM",
                    type: "appointment",
                    date: "2024-09-14",
                    read: false
                },
                {
                    id: 2,
                    user_id: 1,
                    title: "Claim Update", 
                    message: "Your claim CLM002 is under review",
                    type: "claim",
                    date: "2024-08-02",
                    read: true
                }
            ]
        };
    }
}

// Initialize application
function initializeApp() {
    setupEventListeners();
    showView('auth-page');
}

// Event Listeners
function setupEventListeners() {
    // Chat input enter key
    document.addEventListener('keypress', function(e) {
        if (e.target.id === 'chat-input' && e.key === 'Enter') {
            sendMessage();
        }
    });

    // Modal close on outside click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target.id);
        }
    });

    // Search and filter event listeners
    document.addEventListener('input', function(e) {
        if (e.target.id === 'hospital-search') {
            filterHospitals();
        }
    });

    document.addEventListener('change', function(e) {
        if (e.target.id === 'specialty-filter') {
            filterHospitals();
        }
    });
}

// Authentication
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const role = document.getElementById('login-role').value;
    
    // Simulate authentication
    const user = appData.sample_users.find(u => u.email === email && u.role === role);
    
    if (user) {
        currentUser = user;
        showSuccessMessage('Login successful!');
        initializeDashboard();
    } else {
        showErrorMessage('Invalid credentials. Try: john.smith@email.com (patient), dr.johnson@hospital.com (doctor), or admin@healthcare.com (admin)');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const role = document.getElementById('register-role').value;
    
    // Simulate user creation
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        role: role
    };
    
    appData.sample_users.push(newUser);
    currentUser = newUser;
    showSuccessMessage('Registration successful!');
    initializeDashboard();
}

function logout() {
    currentUser = null;
    showView('auth-page');
    hideNavigation();
    showSuccessMessage('Logged out successfully!');
}

function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

// Dashboard Initialization
function initializeDashboard() {
    showNavigation();
    setupUserInterface();
    
    switch(currentUser.role) {
        case 'patient':
            showView('patient-dashboard');
            loadPatientDashboard();
            break;
        case 'doctor':
            showView('doctor-dashboard');
            loadDoctorDashboard();
            break;
        case 'admin':
            showView('admin-dashboard');
            loadAdminDashboard();
            break;
    }
}

function setupUserInterface() {
    // Set user name in navbar
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = currentUser.name;
    }
    
    // Show appropriate navigation
    const navSections = document.querySelectorAll('.nav-section');
    navSections.forEach(section => section.classList.remove('active'));
    
    const activeNav = document.getElementById(`${currentUser.role}-nav`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
    
    // Load notifications
    loadNotifications();
}

// Navigation
function showNavigation() {
    const navbar = document.getElementById('navbar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    if (navbar) navbar.style.display = 'flex';
    if (sidebar) sidebar.style.display = 'block';
    if (mainContent) mainContent.classList.add('with-sidebar');
}

function hideNavigation() {
    const navbar = document.getElementById('navbar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    if (navbar) navbar.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';
    if (mainContent) mainContent.classList.remove('with-sidebar');
}

function showView(viewId) {
    // Hide all views
    const views = document.querySelectorAll('.dashboard-view, .view-content, .auth-container');
    views.forEach(view => view.style.display = 'none');
    
    // Show requested view
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.style.display = 'block';
        currentView = viewId;
    }
    
    // Update active navigation
    updateActiveNavigation(viewId);
    
    // Load view-specific data
    loadViewData(viewId);
}

function updateActiveNavigation(viewId) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    const activeNavItem = document.querySelector(`[onclick="showView('${viewId}')"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
}

// Dashboard Loading Functions
function loadPatientDashboard() {
    loadPatientPolicyDetails();
    loadUpcomingAppointments();
    loadPatientStats();
}

function loadPatientPolicyDetails() {
    const policy = appData.insurance_policies.find(p => p.user_id === currentUser.id);
    const detailsContainer = document.getElementById('patient-policy-details');
    
    if (policy && detailsContainer) {
        detailsContainer.innerHTML = `
            <div class="policy-item">
                <span class="policy-label">Policy Type</span>
                <span class="policy-value">${policy.policy_type}</span>
            </div>
            <div class="policy-item">
                <span class="policy-label">Coverage</span>
                <span class="policy-value">$${policy.coverage_amount.toLocaleString()}</span>
            </div>
            <div class="policy-item">
                <span class="policy-label">Premium</span>
                <span class="policy-value">$${policy.premium.toLocaleString()}/year</span>
            </div>
            <div class="policy-item">
                <span class="policy-label">Status</span>
                <span class="policy-value status status--success">${policy.status}</span>
            </div>
            <div class="policy-item">
                <span class="policy-label">Family Members</span>
                <span class="policy-value">${policy.family_members}</span>
            </div>
        `;
    }
}

function loadUpcomingAppointments() {
    const appointments = appData.appointments.filter(a => a.patient_id === currentUser.id);
    const container = document.getElementById('upcoming-appointments');
    
    if (container) {
        if (appointments.length > 0) {
            container.innerHTML = appointments.map(apt => `
                <div class="appointment-item">
                    <div class="appointment-date">${apt.date} at ${apt.time}</div>
                    <div class="appointment-type">${apt.type}</div>
                    <div class="appointment-doctor">Dr. ${getDoctorName(apt.doctor_id)}</div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p>No upcoming appointments</p>';
        }
    }
}

function loadPatientStats() {
    const healthScore = document.getElementById('health-score-value');
    if (healthScore) {
        healthScore.textContent = appData.dashboard_stats.patient.health_score;
    }
}

function loadDoctorDashboard() {
    // Doctor dashboard is already populated with static data in HTML
    // In a real app, this would load dynamic data
}

function loadAdminDashboard() {
    // Load admin chart
    setTimeout(() => {
        loadAdminChart();
    }, 100);
}

function loadAdminChart() {
    const ctx = document.getElementById('claims-chart');
    if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Claims Processed',
                    data: [65, 78, 90, 81, 95, 123],
                    backgroundColor: '#1FB8CD',
                    borderColor: '#1FB8CD',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// View Data Loading
function loadViewData(viewId) {
    switch(viewId) {
        case 'patient-claims':
            loadPatientClaims();
            break;
        case 'patient-policies':
            loadPatientPolicies();
            break;
        case 'symptom-checker':
            loadSymptomChecker();
            break;
        case 'hospital-locator':
            loadHospitalLocator();
            break;
        case 'appointments':
            loadAppointments();
            break;
        case 'admin-claims':
            loadAdminClaims();
            break;
    }
}

function loadPatientPolicies() {
    const policies = appData.insurance_policies.filter(p => p.user_id === currentUser.id);
    const container = document.getElementById('patient-policies');
    
    if (container) {
        const policiesHTML = policies.map(policy => `
            <div class="card">
                <div class="card__body">
                    <h3>${policy.policy_type}</h3>
                    <div class="policy-details">
                        <div class="policy-item">
                            <span class="policy-label">Policy ID</span>
                            <span class="policy-value">${policy.policy_id}</span>
                        </div>
                        <div class="policy-item">
                            <span class="policy-label">Coverage Amount</span>
                            <span class="policy-value">$${policy.coverage_amount.toLocaleString()}</span>
                        </div>
                        <div class="policy-item">
                            <span class="policy-label">Premium</span>
                            <span class="policy-value">$${policy.premium.toLocaleString()}/year</span>
                        </div>
                        <div class="policy-item">
                            <span class="policy-label">Status</span>
                            <span class="policy-value status status--success">${policy.status}</span>
                        </div>
                        <div class="policy-item">
                            <span class="policy-label">Valid Until</span>
                            <span class="policy-value">${formatDate(policy.end_date)}</span>
                        </div>
                    </div>
                    <div style="margin-top: 16px;">
                        <button class="btn btn--primary btn--sm" onclick="downloadECard('${policy.policy_id}')">
                            <i class="fas fa-download"></i> Download E-Card
                        </button>
                        <button class="btn btn--outline btn--sm" onclick="viewPolicyDocument('${policy.policy_id}')">
                            <i class="fas fa-file-pdf"></i> View Policy
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Create a wrapper if the view doesn't exist
        if (!document.getElementById('patient-policies')) {
            const mainContent = document.getElementById('main-content');
            const policiesView = document.createElement('div');
            policiesView.id = 'patient-policies';
            policiesView.className = 'view-content';
            policiesView.style.display = 'none';
            policiesView.innerHTML = `
                <div class="view-header">
                    <h1><i class="fas fa-shield-alt"></i> My Policies</h1>
                    <p>Manage your insurance policies and documents</p>
                </div>
                <div id="policies-container">${policiesHTML}</div>
            `;
            mainContent.appendChild(policiesView);
        } else {
            const policiesContainer = document.getElementById('policies-container') || container;
            policiesContainer.innerHTML = policiesHTML;
        }
    }
}

function loadAppointments() {
    const appointments = appData.appointments.filter(a => a.patient_id === currentUser.id);
    
    // Create appointments view if it doesn't exist
    if (!document.getElementById('appointments')) {
        const mainContent = document.getElementById('main-content');
        const appointmentsView = document.createElement('div');
        appointmentsView.id = 'appointments';
        appointmentsView.className = 'view-content';
        appointmentsView.style.display = 'none';
        appointmentsView.innerHTML = `
            <div class="view-header">
                <h1><i class="fas fa-calendar-alt"></i> Appointments</h1>
                <button class="btn btn--primary" onclick="bookNewAppointment()">
                    <i class="fas fa-plus"></i> Book Appointment
                </button>
            </div>
            <div id="appointments-list"></div>
        `;
        mainContent.appendChild(appointmentsView);
    }
    
    const container = document.getElementById('appointments-list');
    if (container) {
        if (appointments.length > 0) {
            container.innerHTML = appointments.map(apt => `
                <div class="card" style="margin-bottom: 16px;">
                    <div class="card__body">
                        <div class="appointment-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <div>
                                <h4 style="margin: 0;">${apt.type}</h4>
                                <p style="margin: 4px 0; color: var(--color-text-secondary);">Dr. ${getDoctorName(apt.doctor_id)}</p>
                            </div>
                            <span class="status ${getStatusClass(apt.status)}">${apt.status}</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                            <div>
                                <strong>Date:</strong> ${apt.date}
                            </div>
                            <div>
                                <strong>Time:</strong> ${apt.time}
                            </div>
                            <div>
                                <strong>Notes:</strong> ${apt.notes}
                            </div>
                        </div>
                        <div style="margin-top: 12px;">
                            <button class="btn btn--outline btn--sm" onclick="rescheduleAppointment('${apt.appointment_id}')">
                                <i class="fas fa-calendar-alt"></i> Reschedule
                            </button>
                            <button class="btn btn--outline btn--sm" onclick="cancelAppointment('${apt.appointment_id}')">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = `
                <div class="card">
                    <div class="card__body">
                        <p>No appointments scheduled</p>
                        <button class="btn btn--primary" onclick="bookNewAppointment()">
                            <i class="fas fa-plus"></i> Book Your First Appointment
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

function loadPatientClaims() {
    const claims = appData.claims.filter(c => c.user_id === currentUser.id);
    const container = document.getElementById('claims-list');
    
    if (container) {
        container.innerHTML = claims.map(claim => `
            <div class="claim-card">
                <div class="claim-header">
                    <div>
                        <div class="claim-id">Claim ID: ${claim.claim_id}</div>
                        <div class="claim-type">${claim.claim_type}</div>
                    </div>
                    <div class="claim-amount">$${claim.claim_amount.toLocaleString()}</div>
                </div>
                <div class="claim-details">
                    <div class="claim-detail">
                        <span class="claim-detail-label">Status</span>
                        <span class="claim-detail-value">
                            <span class="status ${getStatusClass(claim.status)}">${claim.status}</span>
                        </span>
                    </div>
                    <div class="claim-detail">
                        <span class="claim-detail-label">Hospital</span>
                        <span class="claim-detail-value">${claim.hospital}</span>
                    </div>
                    <div class="claim-detail">
                        <span class="claim-detail-label">Date Filed</span>
                        <span class="claim-detail-value">${formatDate(claim.date_filed)}</span>
                    </div>
                    <div class="claim-detail">
                        <span class="claim-detail-label">Description</span>
                        <span class="claim-detail-value">${claim.description}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function loadSymptomChecker() {
    const symptoms = [
        'fever', 'cough', 'fatigue', 'headache', 'sore throat', 'runny nose',
        'chest pain', 'shortness of breath', 'nausea', 'vomiting', 'diarrhea',
        'muscle aches', 'joint pain', 'dizziness', 'skin rash'
    ];
    
    const container = document.getElementById('symptom-grid');
    if (container) {
        container.innerHTML = symptoms.map(symptom => `
            <div class="symptom-item">
                <input type="checkbox" id="symptom-${symptom}" value="${symptom}">
                <label for="symptom-${symptom}">${symptom.charAt(0).toUpperCase() + symptom.slice(1)}</label>
            </div>
        `).join('');
    }
}

function loadHospitalLocator() {
    const container = document.getElementById('hospitals-grid');
    if (container) {
        container.innerHTML = appData.hospitals.map(hospital => `
            <div class="hospital-card">
                <div class="hospital-header">
                    <h4 class="hospital-name">${hospital.name}</h4>
                    <div class="hospital-rating">
                        <i class="fas fa-star"></i>
                        <span>${hospital.rating}</span>
                    </div>
                </div>
                <div class="hospital-info">
                    <div><i class="fas fa-map-marker-alt"></i> ${hospital.address}</div>
                    <div><i class="fas fa-phone"></i> ${hospital.phone}</div>
                    <div class="hospital-specialties">
                        ${hospital.specialties.map(spec => `<span class="specialty-tag">${spec}</span>`).join('')}
                    </div>
                </div>
                <div class="hospital-actions">
                    <button class="btn btn--primary btn--sm" onclick="contactHospital('${hospital.hospital_id}')">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                    <button class="btn btn--outline btn--sm" onclick="getDirections('${hospital.hospital_id}')">
                        <i class="fas fa-directions"></i> Directions
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function loadAdminClaims() {
    const container = document.getElementById('admin-claims-list');
    if (container) {
        container.innerHTML = appData.claims.map(claim => `
            <div class="claim-card">
                <div class="claim-header">
                    <div>
                        <div class="claim-id">Claim ID: ${claim.claim_id}</div>
                        <div class="claim-type">${claim.claim_type}</div>
                        <div class="claim-user">Patient: ${getUserName(claim.user_id)}</div>
                    </div>
                    <div class="claim-amount">$${claim.claim_amount.toLocaleString()}</div>
                </div>
                <div class="claim-details">
                    <div class="claim-detail">
                        <span class="claim-detail-label">Status</span>
                        <span class="claim-detail-value">
                            <span class="status ${getStatusClass(claim.status)}">${claim.status}</span>
                        </span>
                    </div>
                    <div class="claim-detail">
                        <span class="claim-detail-label">Hospital</span>
                        <span class="claim-detail-value">${claim.hospital}</span>
                    </div>
                    <div class="claim-detail">
                        <span class="claim-detail-label">Date Filed</span>
                        <span class="claim-detail-value">${formatDate(claim.date_filed)}</span>
                    </div>
                </div>
                ${claim.status === 'Under Review' ? `
                    <div class="claim-actions">
                        <button class="btn btn--primary btn--sm" onclick="approveClaim('${claim.claim_id}')">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn btn--outline btn--sm" onclick="rejectClaim('${claim.claim_id}')">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }
}

// Symptom Checker
function analyzeSymptoms() {
    const checkedSymptoms = Array.from(document.querySelectorAll('#symptom-grid input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    if (checkedSymptoms.length === 0) {
        showErrorMessage('Please select at least one symptom.');
        return;
    }
    
    // Find matching conditions
    const results = [];
    appData.symptom_checker_data.forEach(data => {
        const matchingSymptoms = data.symptoms.filter(s => checkedSymptoms.includes(s));
        if (matchingSymptoms.length > 0) {
            const matchScore = matchingSymptoms.length / data.symptoms.length;
            data.possible_conditions.forEach(condition => {
                results.push({
                    ...condition,
                    matchScore: matchScore,
                    probability: Math.round(condition.probability * matchScore)
                });
            });
        }
    });
    
    // Sort by probability
    results.sort((a, b) => b.probability - a.probability);
    
    // Display results
    const resultsContainer = document.getElementById('symptom-results');
    const analysisContainer = document.getElementById('symptom-analysis');
    
    if (results.length > 0) {
        analysisContainer.innerHTML = results.slice(0, 3).map(result => `
            <div class="condition-card urgency-${result.urgency.toLowerCase()}">
                <div class="condition-header">
                    <span class="condition-name">${result.condition}</span>
                    <span class="condition-probability">${result.probability}%</span>
                </div>
                <div class="condition-urgency">
                    <strong>Urgency:</strong> <span class="status status--${result.urgency.toLowerCase()}">${result.urgency}</span>
                </div>
                <div class="condition-recommendation">
                    <strong>Recommendation:</strong> ${result.recommendation}
                </div>
            </div>
        `).join('');
        
        resultsContainer.style.display = 'block';
    } else {
        analysisContainer.innerHTML = '<p>No matching conditions found. Please consult a healthcare provider if symptoms persist.</p>';
        resultsContainer.style.display = 'block';
    }
}

// Claims Management
function showNewClaimModal() {
    showModal('new-claim-modal');
}

function submitClaim(event) {
    event.preventDefault();
    
    // Simulate claim submission
    const newClaim = {
        claim_id: 'CLM' + String(Date.now()).slice(-3),
        policy_id: appData.insurance_policies.find(p => p.user_id === currentUser.id)?.policy_id,
        user_id: currentUser.id,
        claim_type: event.target.querySelector('select').value,
        claim_amount: parseInt(event.target.querySelector('input[type="number"]').value),
        claimed_amount: 0,
        status: 'Under Review',
        date_filed: new Date().toISOString().split('T')[0],
        hospital: event.target.querySelector('input[type="text"]').value,
        description: event.target.querySelector('textarea').value
    };
    
    appData.claims.push(newClaim);
    hideModal('new-claim-modal');
    showSuccessMessage('Claim submitted successfully!');
    
    if (currentView === 'patient-claims') {
        loadPatientClaims();
    }
}

function approveClaim(claimId) {
    const claim = appData.claims.find(c => c.claim_id === claimId);
    if (claim) {
        claim.status = 'Approved';
        claim.claimed_amount = claim.claim_amount * 0.9; // 90% approved
        claim.date_processed = new Date().toISOString().split('T')[0];
        showSuccessMessage('Claim approved successfully!');
        loadAdminClaims();
    }
}

function rejectClaim(claimId) {
    const claim = appData.claims.find(c => c.claim_id === claimId);
    if (claim) {
        claim.status = 'Rejected';
        claim.date_processed = new Date().toISOString().split('T')[0];
        showSuccessMessage('Claim rejected.');
        loadAdminClaims();
    }
}

// Hospital Actions
function contactHospital(hospitalId) {
    const hospital = appData.hospitals.find(h => h.hospital_id === hospitalId);
    if (hospital) {
        showSuccessMessage(`Calling ${hospital.name} at ${hospital.phone}`);
    }
}

function getDirections(hospitalId) {
    const hospital = appData.hospitals.find(h => h.hospital_id === hospitalId);
    if (hospital) {
        showSuccessMessage(`Opening directions to ${hospital.name}`);
    }
}

// Appointment Functions
function bookNewAppointment() {
    showSuccessMessage('Appointment booking feature coming soon!');
}

function rescheduleAppointment(appointmentId) {
    showSuccessMessage('Appointment rescheduled successfully!');
}

function cancelAppointment(appointmentId) {
    const appointment = appData.appointments.find(a => a.appointment_id === appointmentId);
    if (appointment) {
        appointment.status = 'Cancelled';
        showSuccessMessage('Appointment cancelled successfully!');
        loadAppointments();
    }
}

// Policy Functions
function downloadECard(policyId) {
    showSuccessMessage('E-Card download started!');
}

function viewPolicyDocument(policyId) {
    showSuccessMessage('Opening policy document...');
}

// Notifications
function loadNotifications() {
    const notifications = appData.notifications.filter(n => n.user_id === currentUser.id);
    const container = document.getElementById('notifications-list');
    const badge = document.getElementById('notification-badge');
    
    const unreadCount = notifications.filter(n => !n.read).length;
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
    
    if (container) {
        container.innerHTML = notifications.map(notif => `
            <div class="notification-item ${!notif.read ? 'unread' : ''}">
                <div class="notification-title">${notif.title}</div>
                <div class="notification-message">${notif.message}</div>
                <div class="notification-date">${formatDate(notif.date)}</div>
            </div>
        `).join('');
    }
}

function toggleNotifications() {
    const panel = document.getElementById('notifications-panel');
    if (panel) {
        panel.classList.toggle('open');
    }
}

// Chatbot
function toggleChatbot() {
    const messages = document.getElementById('chatbot-messages');
    const input = document.getElementById('chatbot-input');
    
    if (messages && input) {
        if (messages.style.display === 'none' || messages.style.display === '') {
            messages.style.display = 'flex';
            input.style.display = 'flex';
        } else {
            messages.style.display = 'none';
            input.style.display = 'none';
        }
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chatbot-messages');
    
    if (input && messagesContainer && input.value.trim()) {
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.textContent = input.value;
        messagesContainer.appendChild(userMessage);
        
        // Simulate bot response
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            botMessage.textContent = getBotResponse(input.value);
            messagesContainer.appendChild(botMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
        
        input.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function getBotResponse(message) {
    const responses = [
        "I can help you with policy information, claims, and health questions.",
        "For medical emergencies, please call 911 immediately.",
        "You can check your policy details in the dashboard.",
        "To file a claim, go to the Claims section and click 'File New Claim'.",
        "Our network hospitals are available in the Hospital Locator.",
        "Remember to take your medications as prescribed.",
        "Regular check-ups are important for maintaining good health."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

function showProfile() {
    showSuccessMessage('Profile functionality coming soon!');
}

// Search and Filter Functions
function filterHospitals() {
    const searchTerm = document.getElementById('hospital-search')?.value.toLowerCase() || '';
    const selectedSpecialty = document.getElementById('specialty-filter')?.value || '';
    
    let filteredHospitals = appData.hospitals;
    
    if (searchTerm) {
        filteredHospitals = filteredHospitals.filter(hospital => 
            hospital.name.toLowerCase().includes(searchTerm) ||
            hospital.address.toLowerCase().includes(searchTerm)
        );
    }
    
    if (selectedSpecialty) {
        filteredHospitals = filteredHospitals.filter(hospital =>
            hospital.specialties.includes(selectedSpecialty)
        );
    }
    
    // Update display
    const container = document.getElementById('hospitals-grid');
    if (container) {
        container.innerHTML = filteredHospitals.map(hospital => `
            <div class="hospital-card">
                <div class="hospital-header">
                    <h4 class="hospital-name">${hospital.name}</h4>
                    <div class="hospital-rating">
                        <i class="fas fa-star"></i>
                        <span>${hospital.rating}</span>
                    </div>
                </div>
                <div class="hospital-info">
                    <div><i class="fas fa-map-marker-alt"></i> ${hospital.address}</div>
                    <div><i class="fas fa-phone"></i> ${hospital.phone}</div>
                    <div class="hospital-specialties">
                        ${hospital.specialties.map(spec => `<span class="specialty-tag">${spec}</span>`).join('')}
                    </div>
                </div>
                <div class="hospital-actions">
                    <button class="btn btn--primary btn--sm" onclick="contactHospital('${hospital.hospital_id}')">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                    <button class="btn btn--outline btn--sm" onclick="getDirections('${hospital.hospital_id}')">
                        <i class="fas fa-directions"></i> Directions
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Utility Functions
function getDoctorName(doctorId) {
    const doctor = appData.sample_users.find(u => u.id === doctorId && u.role === 'doctor');
    return doctor ? doctor.name.replace('Dr. ', '') : 'Unknown';
}

function getUserName(userId) {
    const user = appData.sample_users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getStatusClass(status) {
    switch(status) {
        case 'Approved': 
        case 'Confirmed':
        case 'Active':
            return 'status--success';
        case 'Rejected': 
        case 'Cancelled':
            return 'status--error';
        case 'Under Review': 
        case 'Pending':
            return 'status--warning';
        default: 
            return 'status--info';
    }
}

function showSuccessMessage(message) {
    showToast(message, 'success');
}

function showErrorMessage(message) {
    showToast(message, 'error');
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-error)'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1003;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}