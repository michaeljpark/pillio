document.addEventListener('DOMContentLoaded', () => {
    // Determine if we should fetch JSON or use fallback data (for local file opening without server)
    
    // Containers
    const recentListContainer = document.getElementById('recent-list');
    const fullListContainer = document.getElementById('full-visits-list');
    
    // Views
    const homeView = document.getElementById('home-view');
    const visitsView = document.getElementById('visits-view');
    
    // Navigation
    const navHome = document.getElementById('nav-home');
    const navVisits = document.getElementById('nav-visits');
    const seeMoreLink = document.getElementById('home-see-more');
    const searchInput = document.getElementById('visit-search');

    let allVisitsData = [];

    // Fallback data in case fetch fails on file:// protocol
    const fallbackData = [
        {
          "id": 1,
          "hospital": "Toronto General Hospital",
          "date": "February 2, 2026",
          "time": "2:30 PM",
          "locationDetail": "Direct to Cardiology, 4th Floor",
          "department": "Cardiology Department",
          "departmentIcon": "bx-pulse",
          "mainIcon": "bx-plus-medical",
          "status": "Scheduled Visit",
          "statusIcon": "bx-calendar",
          "statusClass": "status-future",
          "timestamp": "2026-02-02T14:30:00",
          "prescription": {
              "doctorName": "Dr. Emily Wong",
              "doctorNote": "Follow-up consultation for arrhythmia management. Patient to bring home blood pressure logs. EKG scheduled prior to visit.",
              "medications": [
                  { "name": "Bisoprolol", "dosage": "5mg", "quantity": "Refill if needed" }
              ],
              "instructions": "Do not consume caffeine 4 hours prior to the appointment. Wear loose clothing for EKG."
          }
        },
        {
          "id": 2,
          "hospital": "St. Michael's Hospital",
          "date": "January 20, 2026",
          "time": "11:15 AM",
          "locationDetail": "Room B 304",
          "department": "Radiology",
          "departmentIcon": "bx-aperture",
          "mainIcon": "bx-radio-circle-marked",
          "status": "Assessment Ready",
          "statusIcon": "bx-check-circle",
          "statusClass": "status-ready",
          "timestamp": "2026-01-20T11:15:00",
          "prescription": {
              "doctorName": "Dr. James Peterson",
              "doctorNote": "MRI of the Lumbar Spine completed. Results indicate mild disc herniation at L4-L5 level with slight nerve root impingement. No spinal stenosis observed.",
              "medications": [
                  { "name": "Naproxen", "dosage": "500mg", "quantity": "14 Tablets" },
                  { "name": "Cyclobenzaprine", "dosage": "10mg", "quantity": "10 Tablets" }
              ],
              "instructions": "Engage in gentle physiotherapy. Avoid heavy lifting (>10lbs). Follow up with Orthopedics in 2 weeks."
          }
        },
        {
          "id": 3,
          "hospital": "Mount Sinai Hospital",
          "date": "January 12, 2026",
          "time": "9:00 AM",
          "locationDetail": "Emergency Wing, Triage",
          "department": "Emergency Room",
          "departmentIcon": "bx-plus-medical",
          "mainIcon": "bx-shield-plus",
          "status": "Assessment Ready",
          "statusIcon": "bx-check-circle",
          "statusClass": "status-ready",
          "timestamp": "2026-01-12T09:00:00",
          "prescription": {
              "doctorName": "Dr. Sarah Chen",
              "doctorNote": "Patient presents with sudden onset of high fever (<span class='number-font'>39°C</span>), severe myalgia, and fatigue. Rapid antigen test confirmed Influenza A. Respiratory status stable with clear lungs.",
              "medications": [
                  { "name": "Oseltamivir (Tamiflu)", "dosage": "75mg", "quantity": "10 Capsules" },
                  { "name": "Acetaminophen", "dosage": "500mg", "quantity": "20 Tablets" },
                  { "name": "Dextromethorphan", "dosage": "15mg", "quantity": "1 Bottle" }
              ],
              "instructions": "Strict isolation for 5 days. Maintain high fluid intake and rest. Monitor temperature every 6 hours. Seek immediate care if shortness of breath or confusion occurs."
          }
        },
        {
          "id": 4,
          "hospital": "Sunnybrook Health Sciences",
          "date": "January 5, 2026",
          "time": "4:00 PM",
          "department": "Orthopedics",
          "departmentIcon": "bx-bone",
          "mainIcon": "bx-health",
          "status": "Report Pending",
          "statusIcon": "bx-file",
          "statusClass": "status-pending",
          "timestamp": "2026-01-05T16:00:00",
           "prescription": {
              "doctorName": "Dr. Robert Miller",
              "doctorNote": "Initial consultation for right knee pain. Suspected meniscus tear. MRI ordered to confirm diagnosis. Physical examination shows limited range of motion.",
              "medications": [
                   { "name": "Topical Diclofenac", "dosage": "1%", "quantity": "1 Tube" }
              ],
              "instructions": "Apply ice to the affected area for 20 minutes, 3 times a day. Use crutches if weight-bearing is painful."
          }
        },
        {
          "id": 5,
          "hospital": "Women's College Hospital",
          "date": "December 14, 2025",
          "time": "3:45 PM",
          "department": "Family Practice",
          "departmentIcon": "bx-clinic",
          "mainIcon": "bx-user",
          "status": "Archived Visit",
          "statusIcon": "bx-history",
          "statusClass": "status-archived",
          "timestamp": "2025-12-14T15:45:00",
           "prescription": {
              "doctorName": "Dr. Lisa Ray",
              "doctorNote": "Annual physical examination. All vitals within normal range. Blood work ordered for cholesterol and glucose screening. Vaccinations updated.",
              "medications": [],
              "instructions": "Maintain regular exercise routine and balanced diet. Schedule follow-up if blood work results appear abnormal."
          }
        },
        {
          "id": 6,
          "hospital": "North York General",
          "date": "November 28, 2025",
          "time": "10:30 AM",
          "department": "Dermatology",
          "departmentIcon": "bx-body",
          "mainIcon": "bx-layer",
          "status": "Archived Visit",
          "statusIcon": "bx-history",
          "statusClass": "status-archived",
          "timestamp": "2025-11-28T10:30:00",
           "prescription": {
              "doctorName": "Dr. Kevin Park",
              "doctorNote": "Evaluation of eczema flair-up on forearms. Prescribed corticosteroid cream. Discussed potential allergic triggers.",
              "medications": [
                  { "name": "Hydrocortisone Cream", "dosage": "2.5%", "quantity": "30g Tube" },
                   { "name": "Cetirizine", "dosage": "10mg", "quantity": "30 Tablets" }
              ],
              "instructions": "Apply cream thinly twice daily for 1 week. Use fragrance-free moisturizers."
          }
        },
        {
          "id": 7,
          "hospital": "SickKids",
          "date": "October 15, 2025",
          "time": "1:00 PM",
          "department": "Pediatrics",
          "departmentIcon": "bx-face",
          "mainIcon": "bx-happy",
          "status": "Archived Visit",
          "statusIcon": "bx-history",
          "statusClass": "status-archived",
          "timestamp": "2025-10-15T13:00:00",
           "prescription": {
              "doctorName": "Dr. Amanda Blue",
              "doctorNote": "Consultation regarding seasonal allergies. Patient reports sneezing and itchy eyes. Recommended over-the-counter antihistamines.",
              "medications": [
                   { "name": "Loratadine (Claritin)", "dosage": "5mg", "quantity": "Over-the-counter" }
              ],
              "instructions": "Avoid outdoor activities during high pollen count days. Keep windows closed."
          }
        }
    ];

    
    /* 
      ATTEMPT TO FETCH visits.json 
    */
    fetch('visits.json')
        .then(response => {
            if (!response.ok) throw new Error("Could not fetch visits.json");
            return response.json();
        })
        .then(data => {
            allVisitsData = data;
            initializeData(data);
        })
        .catch(err => {
            console.warn("Using fallback data", err);
            allVisitsData = fallbackData;
            initializeData(fallbackData);
        });

    function initializeData(visits) {
        // Sort descending
        visits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Render Hero Section (Most recent Assessment Ready)
        renderHeroCard(visits);

        // Render Home (Top 2)
        renderRecentVisits(visits.slice(0, 2));
        
        // Render All Visits Page
        renderGroupedVisits(visits, fullListContainer);
    }

    function renderHeroCard(visits) {
        // Find the most recent visit with status 'Assessment Ready'
        // If none found, fallback to the most recent visit of any kind or default text
        const assessment = visits.find(v => v.status === 'Assessment Ready') || visits[0];
        
        if (assessment) {
            const heroTitle = document.getElementById('hero-title');
            const heroDesc = document.getElementById('hero-desc');
            const heroBadge = document.getElementById('hero-badge');
            const heroCard = document.querySelector('.hero-card');

            // Update DOM
            // User requested: "St. Michael's Hospital should be there... shows the location and the date and time"
            // We set Title to Hospital Name for prominence, or keep "Recent Assessment" and put details in body.
            // Let's put the specific Event Name or Status in Badge, and Hospital in Title.
            
            heroBadge.textContent = "ASSESSMENT READY"; // Or use assessment.status.toUpperCase()
            heroTitle.textContent = assessment.hospital; // Default Text

            const heroTopRight = document.getElementById('hero-top-right');
            // Clear previous content
            if (heroTopRight) heroTopRight.innerHTML = '';

            // BACKGROUND IMAGE LOGIC
            if (assessment.hospital === "St. Michael's Hospital") {
                // Logo on Top Right
                if (heroTopRight) {
                    heroTopRight.innerHTML = `<img src="St_Michaels_Full_White.png" alt="Logo" style="height: 32px; width: auto; opacity: 0.9;">`;
                }

                // Apply specific background image with dark green overlay
                // Increased opacity for darkness, added contrast filter
                heroCard.style.backgroundImage = `
                    linear-gradient(135deg, rgba(20, 50, 40, 0.92) 0%, rgba(20, 50, 40, 0.75) 100%),
                    url('st-mikes-hospital.jpg')
                `;
                heroCard.style.backgroundSize = 'cover';
                heroCard.style.backgroundPosition = 'center';
                // Improve contrast
                heroCard.style.filter = 'contrast(1.15) saturate(1.1)';
                 
                heroTitle.style.textShadow = "0 2px 4px rgba(0,0,0,0.8)";
                
                // Move text down to avoid overlap with logo - Reduced from 48px to 32px for mobile
                heroTitle.style.marginTop = "32px";
                // Decrease font size slightly (from 22px to 20px)
                heroTitle.style.fontSize = "20px";
                // Reduce bottom margin to tighten gap with "Radiology"
                heroTitle.style.marginBottom = "4px";
            } else {
                // Reset to default gradient if necessary (although CSS handles default)
                // Assuming CSS has the default solid/gradient green
                heroCard.style.backgroundImage = ''; 
                heroCard.style.filter = 'none';
                heroTitle.style.textShadow = "none";
                heroTitle.style.marginTop = "";
                heroTitle.style.fontSize = ""; // Reset font size
                heroTitle.style.marginBottom = ""; // Reset margin
            }
            
            // Optional location detail string
            const locDetail = assessment.locationDetail ? ` &bull; <span style="font-family: 'Inter', sans-serif;">${assessment.locationDetail}</span>` : '';

            // Compact layout for mobile view
            heroDesc.innerHTML = `
                <span style="display:block; font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 15px; margin-bottom: 1px;">${assessment.department}</span>
                <span style="display:block; font-family: 'Raleway', sans-serif; font-size: 13px; margin-bottom: 3px;">Toronto, Ontario${locDetail}</span>
                <span style="display:block; font-family: 'Inter', sans-serif; font-size: 12px; opacity: 0.8;">${assessment.date} &bull; ${assessment.time}</span>
            `;
        }
    }

    function renderRecentVisits(visits) {
        recentListContainer.innerHTML = '';
        visits.forEach(visit => {
            recentListContainer.appendChild(createCard(visit));
        });
    }

    function renderGroupedVisits(visits, container) {
        container.innerHTML = '';
        
        if (visits.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding:20px; color:#888;">No visits found.</p>';
            return;
        }

        // Group by Month Year
        const grouped = {};
        visits.forEach(visit => {
            const dateObj = new Date(visit.timestamp);
            const monthYear = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!grouped[monthYear]) {
                grouped[monthYear] = [];
            }
            grouped[monthYear].push(visit);
        });

        for (const [groupName, groupVisits] of Object.entries(grouped)) {
            const titleEl = document.createElement('h3');
            titleEl.className = 'month-title';
            titleEl.textContent = groupName;
            container.appendChild(titleEl);

            const listEl = document.createElement('div');
            listEl.className = 'card-list';
            groupVisits.forEach(visit => {
                listEl.appendChild(createCard(visit));
            });
            container.appendChild(listEl);
        }
    }

    function createCard(visit) {
        const card = document.createElement('div');
        card.className = 'card';
        // Add location detail to department line if available
        // User requested numbers to have different font (Inter), so we apply it to locationDetail which contains numbers
        const categoryText = visit.locationDetail 
            ? `${visit.department} <span style="opacity: 0.7; font-weight: normal; font-family: 'Inter', sans-serif;">• ${visit.locationDetail}</span>`
            : visit.department;

        card.innerHTML = `
            <div class="card-header">
                <div class="icon-box dark">
                    <i class='bx ${visit.mainIcon}'></i>
                </div>
                <div class="card-title-group">
                    <h4>${visit.hospital}</h4>
                    <div class="card-meta" style="font-family: 'Inter', sans-serif;">
                        <span>${visit.date}</span>
                        <span class="separator">•</span>
                        <span>${visit.time}</span>
                    </div>
                    <div class="card-category">
                        <i class='bx ${visit.departmentIcon}'></i>
                        <span>${categoryText}</span>
                    </div>
                </div>
            </div>
            <div class="card-divider"></div>
            <div class="card-footer">
                <div class="status ${visit.statusClass}">
                    <i class='bx ${visit.statusIcon}'></i>
                    <span>${visit.status}</span>
                </div>
                <button class="btn-secondary">View Details</button>
            </div>
        `;
        
        // Add interaction
        const btn = card.querySelector('.btn-secondary');
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => this.style.transform = 'scale(1)', 100);
            
            // Trigger Recap logic for this specific visit card
            if (visit.prescription) {
                startRecap(visit);
            } else {
                // Fallback if no prescription data exists (should not happen with current JSON)
                console.warn("No prescription data for this visit");
            }
        });

        return card;
    }

    // --- Interaction Logic ---

    // Switch Views
    function switchToHome() {
        homeView.style.display = 'block';
        visitsView.style.display = 'none';
        
        navHome.classList.add('active'); 
        navVisits.classList.remove('active');
        
        // Icon Switching
        navHome.querySelector('ion-icon').setAttribute('name', 'grid');
        navVisits.querySelector('ion-icon').setAttribute('name', 'albums-outline');
    }

    function switchToVisits() {
        homeView.style.display = 'none';
        visitsView.style.display = 'block';
        
        navVisits.classList.add('active');
        navHome.classList.remove('active');

        // Icon Switching
        navVisits.querySelector('ion-icon').setAttribute('name', 'albums');
        navHome.querySelector('ion-icon').setAttribute('name', 'grid-outline');
    }

    // Event Listeners
    navHome.addEventListener('click', switchToHome);
    navVisits.addEventListener('click', switchToVisits);
    seeMoreLink.addEventListener('click', switchToVisits);

    // FAB Overlay Logic
    const mainFab = document.getElementById('main-fab');
    const fabOverlay = document.getElementById('fab-overlay');
    const overlayClose = document.getElementById('overlay-close');
    
    // View Switching Elements
    const viewPrescription = document.getElementById('view-prescription');
    const viewDetails = document.getElementById('view-details');
    const btnShowDetails = document.getElementById('btn-show-details');
    const btnBackDetails = document.getElementById('btn-back-details');

    // Details Elements
    const detailNote = document.getElementById('detail-note');
    const detailMedsList = document.getElementById('detail-meds-list');
    const detailInstructions = document.getElementById('detail-instructions');
    const detailDocInfo = document.getElementById('detail-doc-info');
    const btnReconnect = document.querySelector('.btn-reconnect');

    if (mainFab) {
        mainFab.addEventListener('click', () => {
             fabOverlay.classList.add('active');
             
             // Match Body Background to Overlay (Lime)
             document.body.style.backgroundColor = '#E1FF7F';
             // Remove App Container Shadow for flat look
             document.querySelector('.app-container').style.boxShadow = 'none';

             // Hide tracking widget if active
             if (window.isTrackingActive) {
                 const trackingWidget = document.getElementById('active-tracking-widget');
                 if (trackingWidget) trackingWidget.style.display = 'none';
             }

             // Reset to main card view when opening
             showCardView();
             // Populate details (assuming ID 3 for this demo as per instructions)
             const prescriptionVisit = allVisitsData.find(v => v.id === 3) || allVisitsData.find(v => v.status === "Assessment Ready");
             if (prescriptionVisit) {
                 populateDetails(prescriptionVisit);
             }
        });
    }

    if (overlayClose) {
        overlayClose.addEventListener('click', () => {
            fabOverlay.classList.remove('active');
            
            // Revert Background and Shadow
            document.body.style.backgroundColor = '';
            document.querySelector('.app-container').style.boxShadow = '';

            // Show tracking widget if active
            if (window.isTrackingActive) {
                const trackingWidget = document.getElementById('active-tracking-widget');
                if (trackingWidget) trackingWidget.style.display = 'block';
            }
        });
    }

    // Detail View Logic
    if (btnShowDetails) {
        btnShowDetails.addEventListener('click', () => {
            viewPrescription.classList.remove('active');
            viewDetails.classList.add('active');
        });
    }

    if (btnBackDetails) {
        btnBackDetails.addEventListener('click', () => {
            showCardView();
        });
    }

    if (btnReconnect) {
        btnReconnect.addEventListener('click', () => {
            window.open('https://michaeljpark.github.io/portfolio2026/index.html', '_blank');
        });
    }

    function showCardView() {
        viewDetails.classList.remove('active');
        viewPrescription.classList.add('active');
        viewPrescription.scrollTop = 0; // Reset scroll
    }

    function populateDetails(visit) {
        if (!visit.prescription) return;
        
        const rx = visit.prescription;
        
        // 1. Doctor Note
        detailNote.innerHTML = rx.doctorNote;
        
        // 2. Medications
        detailMedsList.innerHTML = ''; // Clear previous
        if (rx.medications && rx.medications.length > 0) {
            rx.medications.forEach(med => {
                const medDiv = document.createElement('div');
                medDiv.className = 'med-item';
                medDiv.innerHTML = `
                    <h4 class="med-name">${med.name}</h4>
                    <p class="med-dosage number-font">${med.dosage}</p>
                    <i class='bx bx-capsule med-icon'></i>
                `;
                detailMedsList.appendChild(medDiv);
            });
        }

        // 3. Instructions
        detailInstructions.textContent = rx.instructions;

        // 4. Doctor Info Footer
        if (detailDocInfo) {
            detailDocInfo.textContent = `${rx.doctorName} / ${visit.hospital}`;
        }
    }

    // Search Logic
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        
        if (!term) {
             // Reset to original full sorted list if empty
             // We need to re-group because renderGroupedVisits expects a flat list to group
            renderGroupedVisits(allVisitsData, fullListContainer);
            return;
        }

        const filtered = allVisitsData.filter(visit => {
            return visit.hospital.toLowerCase().includes(term) ||
                   visit.department.toLowerCase().includes(term) ||
                   visit.status.toLowerCase().includes(term);
        });

        renderGroupedVisits(filtered, fullListContainer);
    });

    // Immediate Help / Chat Logic
    const btnImmediateHelp = document.getElementById('btn-immediate-help');
    const helpOverlay = document.getElementById('help-overlay');
    const helpClose = document.getElementById('help-close');
    const appContainer = document.querySelector('.app-container');
    
    // Chat Elements
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const btnSend = document.getElementById('btn-send-message');
    const btnVoice = document.getElementById('btn-voice-input');
    const btnNextStepOverlay = document.getElementById('btn-next-step-overlay');
    const chatSuggestions = document.getElementById('chat-suggestions');
    
    let currentStep = 0;
    let isProcessing = false;
    
    // Suggestion Data
    const suggestionsData = {
        0: [
            "High Fever (39°C) & Chills",
            "Severe Migraine with Aura",
            "Sudden Chest Pain"
        ],
        1: [
            "Started today, Pain 8/10",
            "2 days ago, Pain 5/10",
            "Over a week, Mild pain"
        ],
        2: [
            "No medical history",
            "I have Asthma",
            "Diabetic (Type 2)"
        ]
    };

    if (btnImmediateHelp && helpOverlay) {
        btnImmediateHelp.addEventListener('click', (e) => {
            const rect = btnImmediateHelp.getBoundingClientRect();
            let x, y;
            
            if (appContainer) {
                const containerRect = appContainer.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                x = centerX - containerRect.left;
                y = centerY - containerRect.top;
            } else {
                x = rect.left + rect.width / 2;
                y = rect.top + rect.height / 2;
            }

            helpOverlay.style.setProperty('--help-origin-x', `${x}px`);
            helpOverlay.style.setProperty('--help-origin-y', `${y}px`);
            
            void helpOverlay.offsetWidth;
            helpOverlay.classList.add('active');
            
            // Match Body Background to Overlay
            document.body.style.backgroundColor = '#E1FF7F';

            // Initialize Chat
            startAssessment();
        });
    }

    if (helpClose) {
        helpClose.addEventListener('click', () => {
            helpOverlay.classList.remove('active');
            // Revert Body Background
            document.body.style.backgroundColor = ''; 
        });
    }
    
    // Chat Functionality
    function startAssessment() {
        chatMessages.innerHTML = ''; // Clear chat
        currentStep = 0;
        isProcessing = false;
        
        // Reset View Visibility
        const chatView = document.getElementById('chat-view-container');
        const erView = document.getElementById('er-view-container');
        const transView = document.getElementById('transport-view-container');
        const sumView = document.getElementById('summary-view-container');
        
        if (chatView) chatView.style.display = 'flex';
        if (erView) erView.style.display = 'none';
        if (transView) transView.style.display = 'none';
        if (sumView) sumView.style.display = 'none';
        
        document.querySelector('.chat-footer-action').style.display = 'none';
        
        chatSuggestions.style.display = 'flex';
        chatMessages.style.display = 'flex';

        // Reset Footer Button (keep disabled logic just in case)
        if (btnNextStepOverlay) {
            btnNextStepOverlay.classList.add('disabled');
            btnNextStepOverlay.disabled = true;
            btnNextStepOverlay.textContent = "Next Step";
        }
        
        // Initial Greeting
        addMessage("doctor", "Hello. I'm Pillio.ai. I'm here to assess your condition. Briefly describe your symptoms or emergency.");
        
        // Show Step 0 Suggestions
        showSuggestions(0);
    }
    
    function showSuggestions(stepIndex) {
        chatSuggestions.innerHTML = ''; // Clear existing
        if (!suggestionsData[stepIndex]) return;

        suggestionsData[stepIndex].forEach(text => {
            const chip = document.createElement('div');
            chip.className = 'suggestion-chip';
            chip.innerHTML = formatMessage(text);
            chip.addEventListener('click', () => {
                chatInput.value = text;
                handleUserResponse();
            });
            chatSuggestions.appendChild(chip);
        });
        
        // Ensure scroll stays at bottom so suggestions are seen
        requestAnimationFrame(() => {
             chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }
    
    function addMessage(sender, text) {
        const container = document.createElement('div');
        container.className = `message-container ${sender}`;
        
        // Simplified: No Header/Icon
        const htmlContent = `<div class="message-bubble ${sender}">${formatMessage(text)}</div>`;
        
        container.innerHTML = htmlContent;
        chatMessages.appendChild(container);
        
        // Force scroll to bottom
        requestAnimationFrame(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }

    function formatMessage(text) {
        // Wrap numbers in span.number-font
        return text.replace(/(\d+[\d\.,]*)/g, '<span class="number-font">$1</span>');
    }
    
    async function handleUserResponse() {
        const text = chatInput.value.trim();
        if (!text || isProcessing) return;
        
        // Add User Message
        addMessage("user", text);
        chatInput.value = '';
        chatSuggestions.innerHTML = ''; // Clear suggestions on send
        isProcessing = true;
        
        // Simulate thinking delay
        await new Promise(r => setTimeout(r, 1000));
        
        processStep(text);
        isProcessing = false;
    }
    
    function processStep(userText) {
        // Simple State Machine for 3-Step Assessment
        if (currentStep === 0) {
            // Step 1: Analyze Initial Symptoms -> Ask for Duration/Severity
            addMessage("doctor", "I understand. How long have you been experiencing these symptoms? And on a scale of 1-10, how severe is the pain/discomfort?");
            currentStep++;
            showSuggestions(1);
        } else if (currentStep === 1) {
            // Step 2: Analyze Severity -> Ask for History using Medical Persona
            addMessage("doctor", "Noted. Do you have any existing medical conditions or are you currently taking any medications that I should be aware of?");
            currentStep++;
            showSuggestions(2);
        } else if (currentStep === 2) {
            // Step 3: Final Analysis & Summary
            const summary = generateSummary(userText);
             // ... rest of code
            addMessage("doctor", `Based on your input, here is my assessment:<br><br>
            <strong>Summary:</strong> ${summary.text}<br>
            <strong>Recommendations:</strong><br>
            1. Monitor temperature every 4 hours.<br>
            2. Stay hydrated and rest.<br>
            3. Visit Urgent Care if symptoms persist for 24h.<br><br>
            ${summary.hashtags}`);
            
            // Enable Footer Button
            if (btnNextStepOverlay) {
                // Show the container
                document.querySelector('.chat-footer-action').style.display = 'block';
                btnNextStepOverlay.classList.remove('disabled');
                btnNextStepOverlay.disabled = false;
                btnNextStepOverlay.textContent = "Reserve ER Near Me";

                // Add Back to Home button for this step
                const btnBack = document.createElement('button');
                btnBack.textContent = "Back to Home";
                btnBack.className = "btn-secondary-action"; 
                btnBack.style.marginTop = "12px";
                btnBack.style.width = "100%";
                btnBack.style.background = "transparent";
                btnBack.style.border = "1px solid #1A1A1A";
                btnBack.style.padding = "16px";
                btnBack.style.borderRadius = "50px";
                btnBack.style.color = "#1A1A1A";
                btnBack.style.fontWeight = "700";
                
                // Insert after the Reserve button if not already there
                const parent = btnNextStepOverlay.parentNode;
                if (!parent.querySelector('.btn-secondary-action')) {
                    parent.appendChild(btnBack);
                }

                btnBack.addEventListener('click', () => {
                    helpOverlay.classList.remove('active');
                });
            }
            
            // Hide Input and Suggestions as requested
            document.querySelector('.chat-input-area').style.display = 'none';
            chatSuggestions.style.display = 'none';

            currentStep++; // End of flow
        } else {
            addMessage("doctor", "If your condition worsens, please call 911 immediately. Is there anything else?");
        }
    }
    
    function generateSummary(userText) {
        // Extract basic keywords for symptoms
        const commonSymptoms = [
            'fever', 'headache', 'cough', 'pain', 'nausea', 'dizziness', 'fatigue',
            'rash', 'swelling', 'bleeding', 'breathing', 'chest', 'stomach'
        ];
        
        let detected = [];
        const textLower = userText.toLowerCase();
        
        commonSymptoms.forEach(s => {
            if (textLower.includes(s)) detected.push(s);
        });
        
        // Fallback if no specific keywords found
        if (detected.length === 0) detected = ['GeneralMalise', 'UnspecifiedPain'];
        
        return {
            text: `Patient reports symptoms consistent with ${detected.join(', ')}. Assessment indicates need for monitoring.`,
            hashtags: ''
        };
    }

    // Handle Next Stage Button Click
    if (btnNextStepOverlay) {
        btnNextStepOverlay.addEventListener('click', () => {
             // Go to ER List View
             document.getElementById('chat-view-container').style.display = 'none';
             document.getElementById('er-view-container').style.display = 'flex';
             loadERList();
        });
    }

    // ER List Logic
    const erListContainer = document.getElementById('er-list');
    const erData = [
        { id: 1, name: "Toronto General Hospital", wait: 14, waitLabel: "Waiting", distance: "1.2 km" },
        { id: 2, name: "St. Michael's Hospital", wait: 8, waitLabel: "Waiting", distance: "2.4 km" },
        { id: 3, name: "Mount Sinai Hospital", wait: 22, waitLabel: "Waiting", distance: "0.8 km" },
        { id: 4, name: "SickKids", wait: 5, waitLabel: "Waiting", distance: "3.1 km" }
    ];

    function loadERList() {
        if (!erListContainer) return;
        erListContainer.innerHTML = '';
        
        erData.forEach(er => {
            const card = document.createElement('div');
            card.className = 'er-card';
            card.dataset.id = er.id;
            
            // Format: Name / Distance + Details / Wait Time
            card.innerHTML = `
                <div class="er-card-info">
                    <div class="er-name">${er.name}</div>
                    <div class="er-details">
                        <span class="er-dist">${er.distance}</span>
                        <span class="separator">•</span>
                        <span>Emergency Dept</span>
                    </div>
                </div>
                <div class="er-wait-box">
                    <div class="er-wait-num">${er.wait}</div>
                    <div class="er-wait-label">${er.waitLabel}</div>
                </div>
            `;
            
            card.addEventListener('click', () => {
                 // Toggle selection
                 card.classList.toggle('selected');
                 checkSelection();
            });
            
            erListContainer.appendChild(card);
        });
        
        // Initial check
        checkSelection();
    }

    function checkSelection() {
        const btnConfirmER = document.getElementById('btn-confirm-er');
        if (!btnConfirmER) return;
        
        const selected = document.querySelectorAll('.er-card.selected');
        
        // Dynamic Button Text Logic
        if (selected.length > 1) {
             btnConfirmER.innerHTML = "Confirm Selection<br><span style='font-size: 11px; font-weight: 400; opacity: 0.8;'>System will automatically find the best option for you</span>";
             btnConfirmER.style.height = "auto"; // Allow growth
        } else {
             btnConfirmER.innerHTML = "Confirm Selection";
        }
        
        if (selected.length > 0) {
            btnConfirmER.classList.remove('disabled');
            btnConfirmER.disabled = false;
            btnConfirmER.style.opacity = '1';
            btnConfirmER.style.cursor = 'pointer';
        } else {
            btnConfirmER.classList.add('disabled');
            btnConfirmER.disabled = true;
            btnConfirmER.style.opacity = '0.5';
            btnConfirmER.style.cursor = 'not-allowed';
        }
    }

    const btnConfirmER = document.getElementById('btn-confirm-er');
    if (btnConfirmER) {
        btnConfirmER.addEventListener('click', () => {
             // Logic for confirmation
             const selected = document.querySelectorAll('.er-card.selected');
             if (selected.length > 0) {
                 // Move to Transport View
                 document.getElementById('er-view-container').style.display = 'none';
                 document.getElementById('transport-view-container').style.display = 'flex';
             } else {
                 alert("Please select at least one Emergency Room.");
             }
        });
    }

    // Transport Logic
    const transportCards = document.querySelectorAll('.transport-card');
    const btnConfirmTransport = document.getElementById('btn-confirm-transport');
    
    transportCards.forEach(card => {
        card.addEventListener('click', () => {
            // Deselect others (Single selection only for now?)
            // User implies choice: "Ambulance OR Non-Medical". So exclusive.
            transportCards.forEach(c => c.classList.remove('selected'));
            
            card.classList.add('selected');
            
            // Enable button
            if (btnConfirmTransport) {
                btnConfirmTransport.classList.remove('disabled');
                btnConfirmTransport.disabled = false;
                btnConfirmTransport.style.opacity = '1';
                btnConfirmTransport.style.cursor = 'pointer';
            }
        });
    });

    if (btnConfirmTransport) {
        btnConfirmTransport.addEventListener('click', () => {
            const selected = document.querySelector('.transport-card.selected');
            // const selectedERs = document.querySelectorAll('.er-card.selected').length; // Unused for now

            if (selected) {
                 const type = selected.dataset.type;
                 let methodDisplay = 'Ambulance';
                 let widgetDetail = '14 min away'; // Default

                 if (type === 'rideshare') {
                     methodDisplay = 'Uber / Lyft';
                     widgetDetail = '3 min away';
                 }
                 if (type === 'walk') {
                     methodDisplay = 'By Walk';
                     widgetDetail = '0.8 km left';
                 }
                 
                 // Update Summary View
                 document.getElementById('summary-transport-method').textContent = methodDisplay;
                 
                 // Store detail for widget
                 window.trackingDetail = widgetDetail;

                 // Transition to Summary View
                 document.getElementById('transport-view-container').style.display = 'none';
                 document.getElementById('summary-view-container').style.display = 'flex';
            }
        });
    }

    // Finish Flow Logic
    const btnFinishFlow = document.getElementById('btn-finish-flow');
    if (btnFinishFlow) {
        btnFinishFlow.addEventListener('click', () => {
             // Close overlay
             helpOverlay.classList.remove('active');
             // Revert Body Background
             document.body.style.backgroundColor = '';
             
             // Disable "Get Immediate Help" button
             if (btnImmediateHelp) {
                 btnImmediateHelp.classList.add('disabled-fab');
                 btnImmediateHelp.style.pointerEvents = 'none';
                 btnImmediateHelp.style.opacity = '0.5';
                 btnImmediateHelp.style.backgroundColor = '#ccc'; // Grey out
                 btnImmediateHelp.style.color = '#666';
             }
             
             // Set Global Tracking State
             window.isTrackingActive = true;

             // Show Tracking Widget
             const trackingWidget = document.getElementById('active-tracking-widget');
             if (trackingWidget) {
                 // Update Detail Text
                 const detailEl = document.getElementById('tracking-status-detail');
                 if (detailEl && window.trackingDetail) {
                     detailEl.textContent = window.trackingDetail;
                 }
                 trackingWidget.style.display = 'block';
             }

             // Reset Views (delayed)
             setTimeout(() => {
                document.getElementById('chat-view-container').style.display = 'flex';
                document.getElementById('er-view-container').style.display = 'none';
                document.getElementById('transport-view-container').style.display = 'none';
                document.getElementById('summary-view-container').style.display = 'none';
                transportCards.forEach(c => c.classList.remove('selected'));
             }, 500);
        });
    }

    // Event Listeners for Chat
    btnSend.addEventListener('click', handleUserResponse);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserResponse();
    });

    // Voice Recognition (Web Speech API)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        
        btnVoice.addEventListener('click', () => {
            if (btnVoice.classList.contains('listening')) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });
        
        recognition.onstart = () => {
            btnVoice.classList.add('listening');
        };
        
        recognition.onend = () => {
            btnVoice.classList.remove('listening');
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            // Optional: Auto-send or just let user edit?
            // User requirement: "input by voice... in chat window". Usually implies filling it.
            // I'll leave it for review/send to confirm.
            chatInput.focus();
        };
        
        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            btnVoice.classList.remove('listening');
        };
    } else {
        btnVoice.style.display = 'none'; // Hide if not supported
        console.log("Web Speech API not supported");
    }

    /* 
       CALENDAR FEATURE
    */
    const calendarBtn = document.querySelector('.notification-btn');
    const calendarOverlay = document.getElementById('calendar-overlay');
    const calendarCloseBtn = document.getElementById('calendar-close');
    const calendarGrid = document.getElementById('calendar-grid');
    const calendarHeader = document.getElementById('calendar-month-year');
    const calendarIcon = calendarBtn ? calendarBtn.querySelector('ion-icon') : null;
    
    // Navigation Buttons
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    let currentCalendarDate = new Date();

    if (calendarBtn && calendarOverlay) {
        calendarBtn.addEventListener('click', () => {
            // Show Overlay
            calendarOverlay.style.display = 'flex';
            // Change Icon to filled
            if (calendarIcon) calendarIcon.setAttribute('name', 'calendar');
            
            // Reset to today when opening
            currentCalendarDate = new Date();
            renderCalendar(currentCalendarDate);
        });

        if (calendarCloseBtn) {
            calendarCloseBtn.addEventListener('click', closeCalendar);
        }
        
        // Close on clicking outside modal
        calendarOverlay.addEventListener('click', (e) => {
             if (e.target === calendarOverlay) {
                closeCalendar();
             }
        });

        // Month Navigation
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
                renderCalendar(currentCalendarDate);
            });
        }
        
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
                renderCalendar(currentCalendarDate);
            });
        }
    }

    function closeCalendar() {
        calendarOverlay.style.display = 'none';
        if (calendarIcon) calendarIcon.setAttribute('name', 'calendar-outline');
    }

    function renderCalendar(date) {
        if (!calendarGrid || !calendarHeader) return;
        
        calendarGrid.innerHTML = '';
        
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Set Header
        const monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"];
        calendarHeader.innerText = `${monthNames[month]} ${year}`;
        
        // Days calculation
        const firstDayIndex = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();
        
        const today = new Date();
        
        // Helper to check for visits
        const hasVisitOnDate = (d, m, y) => {
            if (!allVisitsData) return false;
            return allVisitsData.some(visit => {
                // Parse timestamp
                const vDate = new Date(visit.timestamp);
                return vDate.getDate() === d && vDate.getMonth() === m && vDate.getFullYear() === y;
            });
        };

        // Padding days
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('calendar-day', 'empty');
            calendarGrid.appendChild(emptyDiv);
        }

        // Real days
        for (let i = 1; i <= lastDay; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day');
            dayDiv.innerText = i;
            
            // Check if Today
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayDiv.classList.add('today');
            }
            
            // Check for Visits
            if (hasVisitOnDate(i, month, year)) {
                dayDiv.classList.add('has-visit');
            }
            
            calendarGrid.appendChild(dayDiv);
        }
    }

    /*
       STORY / RECAP FEATURE
       - For "View Details" on Hero Card
    */
    const recapOverlay = document.getElementById('recap-overlay');
    const recapCloseBtn = document.getElementById('recap-close');
    const recapContent = document.getElementById('story-content');
    const recapTapArea = document.getElementById('story-tap-area');
    const btnHeroViewDetails = document.querySelector('.hero-bottom .btn-primary');
    const btnStoryPrev = document.getElementById('story-prev');
    const btnStoryNext = document.getElementById('story-next');
    
    let currentRecapVisit = null;
    let currentSlideIndex = 0;
    let slideTimer = null;
    const slideDuration = 4000; // 4 seconds per slide for auto-advance

    // ... (Hero Button Listener logic remains shared/same if we don't touch it)

    if (btnStoryPrev) {
        btnStoryPrev.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling to tap area
            prevSlide();
        });
    }

    if (btnStoryNext) {
        btnStoryNext.addEventListener('click', (e) => {
            e.stopPropagation();
            nextSlide();
        });
    }

    function startRecap(visit) {
        currentRecapVisit = visit;
        currentSlideIndex = 0;
        if (recapOverlay) recapOverlay.style.display = 'flex'; // Ensure overlay var is reachable or get it again
        // Note: recapOverlay is defined globally? No, let's ensure we have it.
        const overlay = document.getElementById('recap-overlay');
        if (overlay) overlay.style.display = 'flex';
        
        // Reset Bars
        document.querySelectorAll('.story-bar-fill').forEach(bar => {
            bar.style.width = '0%';
            bar.style.transition = 'none';
        });

        renderSlide(0);
    }

    function closeRecap() {
        const overlay = document.getElementById('recap-overlay');
        if (overlay) overlay.style.display = 'none';
        clearTimeout(slideTimer);
        currentRecapVisit = null;
    }

    if (recapCloseBtn) {
        recapCloseBtn.addEventListener('click', closeRecap);
    }

    if (recapTapArea) {
        recapTapArea.addEventListener('click', (e) => {
            nextSlide();
        });
    }

    function prevSlide() {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            renderSlide(currentSlideIndex);
        }
    }

    function nextSlide() {
        if (currentSlideIndex < 2) {
            currentSlideIndex++;
            renderSlide(currentSlideIndex);
        } else {
            // End of slideshow - stop
            clearTimeout(slideTimer);
            // Ensure last bar is full visually
            const currentBar = document.getElementById(`story-bar-${currentSlideIndex}`);
            if (currentBar) {
               currentBar.style.transition = 'width 0.2s linear';
               currentBar.style.width = '100%';
            }
        }
    }

    function renderSlide(index) {
        clearTimeout(slideTimer);
        
        // Correctly set state for ALL bars based on current index
        for (let i = 0; i < 3; i++) {
             const bar = document.getElementById(`story-bar-${i}`);
             if (!bar) continue;

             if (i < index) {
                 // Previous bars should be full immediately
                 bar.style.transition = 'none'; 
                 bar.style.width = '100%';
             } else if (i > index) {
                 // Future bars should be empty immediately
                 bar.style.transition = 'none'; 
                 bar.style.width = '0%';
             } else {
                 // Current bar: Reset to 0 then animate
                 bar.style.transition = 'none';
                 bar.style.width = '0%';
                 
                 // Force reflow
                 void bar.offsetWidth; 
                 
                 // Start clean animation
                 setTimeout(() => {
                    bar.style.transition = `width ${slideDuration}ms linear`;
                    bar.style.width = '100%';
                 }, 50);
             }
        }

        // Content Generation
        let htmlContent = '';
        const p = currentRecapVisit.prescription;

        // Dark text colors for Lime background
        const textColor = '#1A1A1A';
        const accentColor = '#143228'; // Dark Green for headings
        const subTextColor = 'rgba(26, 26, 26, 0.7)';
        const cardBg = 'rgba(20, 50, 40, 0.05)';

        // Helper to apply number font
        const formatNums = (str) => {
            if (typeof str !== 'string') return str;
            return str.replace(/(\d+)/g, `<span style="font-family: 'Inter', sans-serif;">$1</span>`);
        };

        const mainFont = "'Raleway', sans-serif";
        const numFont = "'Inter', sans-serif"; // Sub-font for numbers

        if (currentRecapVisit.status === 'Scheduled Visit') {
            // SCHEDULED VISIT LAYOUT
             if (index === 0) {
                 // 1. HOSPITAL INFO
                 htmlContent = `
                    <div style="animation: fadeIn 0.5s ease; color: ${textColor}; font-family: ${mainFont};">
                        <h2 style="font-family: ${mainFont}; font-size: 24px; font-weight: 700; margin-bottom: 24px; color: ${accentColor};">
                            Hospital info
                        </h2>
                        <div style="font-size: 24px; font-weight: 800; line-height: 1.2; margin-bottom: 16px;">
                            ${currentRecapVisit.hospital}
                        </div>
                        <div style="font-size: 18px; margin-bottom: 8px; font-weight: 600; opacity: 0.9;">
                            ${currentRecapVisit.department}
                        </div>
                         <div style="display: flex; align-items: start; gap: 8px; margin-top: 24px; opacity: 0.8;">
                             <i class='bx bx-map' style="font-size: 20px; margin-top: 3px;"></i>
                             <div style="font-family: ${mainFont}; font-size: 16px; line-height: 1.5;">
                                 ${formatNums(currentRecapVisit.locationDetail || 'Main Entrance')}
                             </div>
                         </div>
                    </div>
                 `;
            } else if (index === 1) {
                 // 2. DOCTOR INFO
                 htmlContent = `
                    <div style="animation: fadeIn 0.5s ease; color: ${textColor}; font-family: ${mainFont};">
                        <h2 style="font-family: ${mainFont}; font-size: 24px; font-weight: 700; margin-bottom: 32px; color: ${accentColor};">
                            Doctor info
                        </h2>
                        <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 32px;">
                             <img src="profileicon.png" alt="Doctor" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(0,0,0,0.1); margin-bottom: 16px;">
                             <div style="font-size: 22px; font-weight: 700;">${p.doctorName || 'Dr. Assigned'}</div>
                             <div style="font-size: 14px; opacity: 0.7;">Attending Physician</div>
                        </div>
                        <div style="background: ${cardBg}; padding: 20px; border-radius: 16px;">
                            <div style="font-size: 14px; opacity: 0.6; margin-bottom: 8px;">NOTE</div>
                            <div style="font-size: 16px; line-height: 1.5;">
                                ${formatNums(p.doctorNote || 'Please arrive 15 minutes early for check-in procedures.')}
                            </div>
                        </div>
                    </div>
                 `;
            } else if (index === 2) {
                 // 3. TIME INFO
                 htmlContent = `
                    <div style="animation: fadeIn 0.5s ease; color: ${textColor}; font-family: ${mainFont};">
                         <h2 style="font-family: ${mainFont}; font-size: 24px; font-weight: 700; margin-bottom: 40px; color: ${accentColor};">
                            Date & Time
                        </h2>
                        <div style="text-align: center; margin-bottom: 40px;">
                            <div style="font-size: 18px; opacity: 0.8; margin-bottom: 8px;">SCHEDULED FOR</div>
                            <div style="font-size: 32px; font-weight: 700; margin-bottom: 12px; line-height: 1.2;">
                                ${formatNums(currentRecapVisit.date)}
                            </div>
                            <div style="font-family: ${numFont}; font-size: 48px; font-weight: 700; color: ${accentColor};">
                                ${formatNums(currentRecapVisit.time)}
                            </div>
                        </div>
                        
                        <div style="margin-top: 40px; text-align: center;">
                            <div style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: ${accentColor}; color: #E1FF7F; border-radius: 50px; font-weight: 700; font-size: 14px; cursor: pointer;">
                                <i class='bx bx-calendar-event'></i>
                                <span>Add to Calendar</span>
                            </div>
                        </div>
                    </div>
                 `;
            }

        } else if (index === 0) {
            // DOCTOR'S NOTE (Modified Sizing + Context Header)
            const headerHtml = `
                <div style="margin-bottom: 20px; border-bottom: 1px solid rgba(20,50,40,0.1); padding-bottom: 16px;">
                    <div style="font-weight: 700; font-size: 15px; color: ${accentColor}; opacity: 0.9; margin-bottom: 4px;">
                        ${currentRecapVisit.hospital}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: ${subTextColor};">
                        <span>${currentRecapVisit.department}</span>
                        <span style="font-family: ${numFont};">${currentRecapVisit.date}</span>
                    </div>
                </div>
            `;

            htmlContent = `
                <div style="animation: fadeIn 0.5s ease; color: ${textColor}; font-family: ${mainFont};">
                    ${headerHtml}
                    <h2 style="font-family: ${mainFont}; font-size: 20px; font-weight: 700; margin-bottom: 20px; color: ${accentColor};">
                        Doctor's note
                    </h2>
                    <div style="font-family: ${mainFont}; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                        ${formatNums(p.doctorNote)}
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 20px;">
                        <img src="profileicon.png" alt="Doctor" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(0,0,0,0.1);">
                        <div>
                            <div style="font-weight: 600; font-size: 16px;">${p.doctorName}</div>
                            <div style="font-size: 13px; color: ${subTextColor};">Attending Physician</div>
                        </div>
                    </div>
                </div>
            `;
        } else if (index === 1) {
            // PRESCRIBED MEDICATION (Modified Sizing)
            const medsHtml = p.medications ? p.medications.map(m => `
                <div style="margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid rgba(20,50,40,0.1);">
                    <div style="font-weight: 700; font-size: 18px; margin-bottom: 8px; color: ${textColor}; font-family: ${mainFont};">
                        ${formatNums(m.name)}
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px; font-family: ${numFont};">
                        <div style="background: transparent; border: 1px solid ${accentColor}; color: ${accentColor}; padding: 4px 12px; border-radius: 50px; font-weight: 600; font-size: 13px;">
                            ${formatNums(m.dosage)}
                        </div>
                        <div style="font-size: 14px; color: ${subTextColor};">
                            ${formatNums(m.quantity)}
                        </div>
                    </div>
                </div>
            `).join('') : '';

            htmlContent = `
                <div style="animation: fadeIn 0.5s ease; color: ${textColor}; font-family: ${mainFont};">
                    <h2 style="font-family: ${mainFont}; font-size: 20px; font-weight: 700; margin-bottom: 24px; color: ${accentColor};">
                         Prescribed medication
                    </h2>
                    <div style="margin-top: 16px;">
                        ${medsHtml}
                    </div>
                </div>
            `;
        } else if (index === 2) {
            // INSTRUCTIONS (Modified Sizing)
            htmlContent = `
                <div style="animation: fadeIn 0.5s ease; color: ${textColor}; font-family: ${mainFont};">
                    <h2 style="font-family: ${mainFont}; font-size: 20px; font-weight: 700; margin-bottom: 24px; color: ${accentColor};">
                         Instructions
                    </h2>
                    <div style="font-family: ${mainFont}; font-size: 16px; line-height: 1.5;">
                        ${formatNums(p.instructions)}
                    </div>
                    <div style="margin-top: 32px; text-align: center;">
                        <div style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: ${accentColor}; color: #E1FF7F; border-radius: 50px; font-weight: 700; font-size: 14px; cursor: pointer;">
                            <span>Reconnect with Doctor</span>
                        </div>
                    </div>
                </div>
            `;
        }

        recapContent.innerHTML = htmlContent;

        // Toggle Next Button Visibility
        if (btnStoryNext) {
            if (index === 2) {
                btnStoryNext.style.visibility = 'hidden';
                btnStoryNext.style.pointerEvents = 'none';
            } else {
                btnStoryNext.style.visibility = 'visible';
                btnStoryNext.style.pointerEvents = 'auto';
            }
        }

        // Auto Advance
        // Only valid for slide 0 and 1. Slide 2 stops.
        if (index < 2) {
            slideTimer = setTimeout(() => {
                nextSlide();
            }, slideDuration);
        } else {
            // Last slide: Fill bar over duration then stop? 
            // Or just fill bar via animation and stop timer?
            // Actually renderSlide sets bar width to 100% with duration.
            // We just don't set a timer to call nextSlide() which handles the end logic.
            // The bar animation (CSS transition) happens in renderSlide.
            // But we might want to know when it finishes? No need if we just stay there.
        }
    }

    // Attach Event Listener for View Details Button
    const btnViewDetails = document.getElementById('btn-view-details');
    if (btnViewDetails) {
        btnViewDetails.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("View Details clicked");
            // Find Assessment Ready visit
            const assessment = allVisitsData.find(v => v.status === 'Assessment Ready') || allVisitsData[0];
            if (assessment) {
                if (!assessment.prescription) {
                    // Fallback dummy prescription if missing
                    assessment.prescription = {
                        doctorName: "Dr. Unknown",
                        doctorNote: "No specific notes available.",
                        medications: [],
                        instructions: "Please contact your provider."
                    };
                }
                startRecap(assessment);
            } else {
                console.warn("No assessment data found.");
            }
        });
    }

    // Handle Loading Overlay
    window.addEventListener('load', () => {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 1000); 
        }
    });

});
