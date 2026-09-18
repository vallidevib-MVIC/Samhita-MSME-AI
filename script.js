document.addEventListener('DOMContentLoaded', () => {
    const TOTAL_STEPS = 8;
    let currentStep = 1;

    const form = document.getElementById('enrollment-form');
    const stepsWrapper = document.getElementById('steps-wrapper');
    const progressLine = document.getElementById('progress-line');
    const btnNext = document.getElementById('btn-next');
    const btnBack = document.getElementById('btn-back');
    const btnSubmit = document.getElementById('btn-submit');
    const aiRatingSlider = document.getElementById('ai_rating');
    const aiRatingVal = document.getElementById('ai_rating_val');

    // Setup Progress Bar Steps
    const icons = [
        '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>',
        '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>',
        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line>',
        '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>',
        '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',
        '<circle cx="12" cy="12" r="3"></circle><line x1="19.4" y1="15" x2="21.4" y2="15.5"></line><line x1="19.4" y1="9" x2="21.4" y2="8.5"></line><line x1="15" y1="19.4" x2="15.5" y2="21.4"></line><line x1="9" y1="19.4" x2="8.5" y2="21.4"></line><line x1="4.6" y1="15" x2="2.6" y2="15.5"></line><line x1="4.6" y1="9" x2="2.6" y2="8.5"></line><line x1="9" y1="4.6" x2="8.5" y2="2.6"></line><line x1="15" y1="4.6" x2="15.5" y2="2.6"></line>',
        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>'
    ];

    for (let i = 1; i <= TOTAL_STEPS; i++) {
        const step = document.createElement('div');
        step.className = `step-indicator ${i === 1 ? 'active' : ''}`;
        step.id = `step-ind-${i}`;
        step.style.cursor = 'pointer';
        step.innerHTML = `${i} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons[i - 1]}</svg>`;
        step.addEventListener('click', () => {
            updateStepValidationUI(currentStep);
            currentStep = i;
            updateProgress();
            window.scrollTo(0, 0);
        });
        stepsWrapper.appendChild(step);
    }

    // Handlers for Custom Radio & Checkbox styling
    document.querySelectorAll('.radio-card input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function () {
            const groupName = this.name;
            document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
                r.closest('.radio-card').classList.remove('selected');
            });
            if (this.checked) {
                this.closest('.radio-card').classList.add('selected');
            }
        });
    });

    document.querySelectorAll('.check-card input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            // Check for max limits
            const group = this.closest('.max-3-check');
            if (group) {
                const groupName = this.name;
                const checkedCount = document.querySelectorAll(`input[name="${groupName}"]:checked`).length;
                if (checkedCount > 3) {
                    this.checked = false;
                    alert("You can only select a maximum of 3 options.");
                    return;
                }
                // Update badge counter
                const countEl = document.getElementById(`count_${groupName}`);
                if (countEl) {
                    const current = document.querySelectorAll(`input[name="${groupName}"]:checked`).length;
                    countEl.textContent = `${current} / 3`;
                }
            }

            if (this.checked) {
                this.closest('.check-card').classList.add('selected');
            } else {
                this.closest('.check-card').classList.remove('selected');
            }
        });
    });

    // Slider sync
    aiRatingSlider.addEventListener('input', function () {
        aiRatingVal.textContent = this.value;
    });

    // Email sync for organizer info
    const emailInput = document.querySelector('input[name="contact_email"]');
    emailInput.addEventListener('input', function () {
        const email = this.value || 'name@example.com';
        // Simulating mapped user updates
    });

    function updateProgress() {
        // Update Sections
        document.querySelectorAll('.form-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(`section-${currentStep}`).classList.add('active');

        // Update Indicators
        for (let i = 1; i <= TOTAL_STEPS; i++) {
            const ind = document.getElementById(`step-ind-${i}`);
            ind.className = 'step-indicator';
            if (i < currentStep) ind.classList.add('completed');
            if (i === currentStep) ind.classList.add('active');
        }

        // Update Progress Bar
        const progressPercentage = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;
        progressLine.style.width = `${progressPercentage}%`;

        // Update Buttons
        btnBack.style.display = currentStep > 1 ? 'inline-flex' : 'none';

        if (currentStep === TOTAL_STEPS) {
            btnNext.style.display = 'none';
            btnSubmit.style.display = 'inline-flex';
            populateReviewSection();
        } else {
            btnNext.style.display = 'inline-flex';
            btnSubmit.style.display = 'none';
        }
    }

    function updateStepValidationUI(step) {
        const currentSection = document.getElementById(`section-${step}`);
        const inputs = currentSection.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                isValid = false;
            }
        });

        if (step === 1) {
            const pass1 = currentSection.querySelector('input[name="contact_password"]').value;
            const pass2 = currentSection.querySelector('input[name="contact_password_confirm"]').value;
            if (pass1 !== pass2 || !pass1) {
                isValid = false;
            }
        }

        const indicator = document.getElementById(`step-ind-${step}`);
        if (!isValid) {
            indicator.classList.add('invalid');
        } else {
            indicator.classList.remove('invalid');
        }
    }

    function populateReviewSection() {
        const getVal = (name) => {
            const el = form.querySelector(`[name="${name}"]`);
            return el ? el.value : '';
        };
        const getChecked = (name) => {
            return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(cb => cb.value);
        };

        // Returns true if all required inputs in a section are valid
        function isStepComplete(stepNum) {
            const section = document.getElementById(`section-${stepNum}`);
            if (!section) return true;
            const inputs = section.querySelectorAll('input[required], select[required]');
            return [...inputs].every(i => i.checkValidity());
        }

        // Helper: mark a review card valid/invalid based on its child element id
        function setCardValidity(childId, isValid) {
            const el = document.getElementById(childId);
            if (!el) return;
            const card = el.closest('.review-card');
            if (card) card.classList.toggle('invalid', !isValid);
        }

        // Enterprise Details
        const entName = getVal('enterprise_name') || 'Not entered';
        const entState = getVal('enterprise_state') || 'State not selected';
        const entPin = getVal('enterprise_pin') || 'PIN not entered';
        document.getElementById('rev_enterprise').textContent = entName;
        document.getElementById('rev_enterprise_sub').textContent = `${entState} · ${entPin}`;
        setCardValidity('rev_enterprise', isStepComplete(2));

        // Contact Details
        const conName = getVal('contact_name') || 'Not entered';
        const conMobile = getVal('contact_mobile') || 'Mobile not entered';
        const conPan = getVal('contact_pan') || 'PAN not entered';
        document.getElementById('rev_contact').textContent = conName;
        document.getElementById('rev_contact_sub').textContent = `${conMobile} · ${conPan}`;
        setCardValidity('rev_contact', isStepComplete(3));

        // Learner Details
        const l1Name = getVal('learner1_name') || 'Learner 1 not entered';
        const l1Mobile = getVal('learner1_mobile') || 'Learner 1 mobile not entered';
        const l2Name = getVal('learner2_name') || 'Learner 2 not entered';
        document.getElementById('rev_learners').textContent = l1Name;
        document.getElementById('rev_learners_sub').textContent = `${l1Mobile} · ${l2Name}`;
        setCardValidity('rev_learners', isStepComplete(4));

        // Legal
        const legalStruct = getVal('legal_structure') || 'Legal structure not selected';
        const udyam = getVal('udyam_status') || 'UDYAM not selected';
        const gst = getVal('gst_status') || 'GST not selected';
        document.getElementById('rev_legal').textContent = legalStruct;
        document.getElementById('rev_legal_sub').textContent = `${gst} · ${udyam}`;
        setCardValidity('rev_legal', isStepComplete(4));

        // Financials
        const turnover = getVal('annual_turnover') || 'Turnover not selected';
        const employees = getVal('employee_count') || 'Employees not selected';
        const tenure = getVal('enterprise_tenure') || 'Tenure not selected';
        document.getElementById('rev_financials').textContent = turnover;
        document.getElementById('rev_financials_sub').textContent = `${employees} · ${tenure}`;
        setCardValidity('rev_financials', isStepComplete(4));

        // Operations
        const sector = getVal('sector') || 'Sector not selected';
        const otherSector = getVal('other_sector') || '';
        document.getElementById('rev_operations').textContent = sector;
        document.getElementById('rev_operations_sub').textContent = otherSector || 'No other sector details';
        setCardValidity('rev_operations', isStepComplete(5));

        // Digital Readiness
        const tools = getChecked('tools');
        document.getElementById('rev_digital').textContent = tools.length > 0 ? `${tools.length} tool(s) selected` : '0 tools selected';
        document.getElementById('rev_digital_sub').textContent = tools.length > 0 ? tools.slice(0, 2).join(', ') + (tools.length > 2 ? '...' : '') : 'No other tool details';
        setCardValidity('rev_digital', isStepComplete(6));

        // AI Readiness
        const aiRating = getVal('ai_rating') || '5';
        const useCases = getChecked('use_cases');
        const outcomes = getChecked('outcomes');
        document.getElementById('rev_ai').textContent = `${aiRating}/10 current AI use`;
        document.getElementById('rev_ai_sub').textContent = `${useCases.length} use case(s) · ${outcomes.length} expected outcome(s)`;
        setCardValidity('rev_ai', isStepComplete(7));
    }

    window.goToStep = function (step) {
        currentStep = step;
        updateProgress();
    };

    btnNext.addEventListener('click', () => {
        updateStepValidationUI(currentStep);
        currentStep++;
        updateProgress();
        window.scrollTo(0, 0);
    });

    btnBack.addEventListener('click', () => {
        currentStep--;
        updateProgress();
        window.scrollTo(0, 0);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();



        // Disable submit button
        btnSubmit.innerHTML = 'Submitting...';
        btnSubmit.disabled = true;

        // Collect all data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Handle multiple checkboxes properly
        data.tools = formData.getAll('tools');
        data.active_depts = formData.getAll('active_depts');
        data.challenges = formData.getAll('challenges');
        data.priorities = formData.getAll('priorities');
        data.use_cases = formData.getAll('use_cases');
        data.barriers = formData.getAll('barriers');
        data.outcomes = formData.getAll('outcomes');

        // IMPORTANT: Replace this URL with the Google Apps Script Web App URL after deployment
        const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyGwxGE4h0N-gSpUXuBTHodvjPLMTcpBTE2g1SHwwMryv2rQIHZ84qA7ul6jovuTL2Qqw/exec";

        if (WEB_APP_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
            // For demo purposes, we'll just show success if URL isn't configured yet
            setTimeout(() => {
                document.getElementById('success-modal').classList.add('active');
            }, 800);
            return;
        }

        // Actual submission to Google Apps Script
        fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    document.getElementById('success-modal').classList.add('active');
                } else {
                    alert('There was an error submitting your application. Please try again.');
                    btnSubmit.innerHTML = 'Submit application';
                    btnSubmit.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error submitting your application. Please try again.');
                btnSubmit.innerHTML = 'Submit application';
                btnSubmit.disabled = false;
            });
    });
});
