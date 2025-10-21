document.addEventListener('DOMContentLoaded', () => {
    loadSharedComponents();
    renderJobOpenings();
    initializeModal();
    if (typeof OrivantaUtils !== 'undefined') {
        OrivantaUtils.trackPageView('/careers');
    }
});

// ===================================
// JOB OPENINGS DATABASE
// ===================================

const jobOpenings = [
    {
        title: "Compliance & Operations Intern",
        location: "Remote (Work from Home)",
        type: "Internship",
        description: "Orivanta Labs Private Limited (Orivanta.ai) is a rapidly growing AI automation company building intelligent conversational and business workflow solutions. As we expand our operations, we're looking for a motivated individual to help us streamline and manage compliance and operational documentation. The Compliance & Operations Intern will be responsible for coordinating with third-party legal and compliance service providers (such as VakilSearch), ensuring timely completion of filings, and maintaining all company documentation in an organized, trackable format.",
        responsibilities: [
            "Communicate and coordinate daily with external compliance vendors (VakilSearch and others)",
            "Track the status of pending company filings, registrations, and deliverables",
            "Maintain a Google Sheet tracker for compliance activities and document updates",
            "Organize and manage company files in Google Drive (MoA, AoA, GST, ROC, NOC, etc.)",
            "Prepare short daily and weekly status reports",
            "Escalate delays or issues in documentation or communication",
            "Assist in gathering and compiling compliance-related data for future certifications (ISO, DPDP, etc.)"
        ],
        qualifications: [
            "Pursuing or completed B.Com, BBA, or CS (Company Secretary) course",
            "Basic understanding of company compliance, GST, or documentation processes (preferred)",
            "Excellent written and verbal communication in English",
            "Organized, detail-oriented, and proactive in follow-ups",
            "Comfortable working independently and reporting online daily",
            "Familiar with Google Workspace (Sheets, Drive, Docs)",
            "Duration: 3 to 6 Months",
            "Stipend: ₹1,200–₹2,000 per month",
            "Time Commitment: 4-6 hours per day"
        ]
    }
    // To add more jobs in the future, copy this entire block and paste below
];


// ===================================
// RENDER JOBS ON PAGE
// ===================================

function renderJobOpenings() {
    const listContainer = document.getElementById('positions-list');
    const placeholder = document.getElementById('no-positions-placeholder');
    
    listContainer.innerHTML = '';

    if (jobOpenings.length === 0) {
        placeholder.style.display = 'block';
        return;
    }

    placeholder.style.display = 'none';

    jobOpenings.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'position-card';
        jobCard.innerHTML = `
            <div class="position-header">
                <h3>${job.title}</h3>
                <div class="position-meta">
                    <span>📍 ${job.location}</span>
                    <span>🕒 ${job.type}</span>
                </div>
            </div>
            <p class="position-description">${job.description}</p>
            <div class="position-details">
                <h4>Key Responsibilities</h4>
                <ul>
                    ${job.responsibilities.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <h4>Qualifications</h4>
                <ul>
                    ${job.qualifications.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div class="position-footer">
                <button class="btn btn-primary apply-btn" data-job-title="${job.title}">Apply Now</button>
            </div>
        `;
        listContainer.appendChild(jobCard);
    });

    document.querySelectorAll('.apply-btn').forEach(button => {
        button.addEventListener('click', () => {
            const jobTitle = button.getAttribute('data-job-title');
            openApplicationModal(jobTitle);
        });
    });
}

// ===================================
// MODAL LOGIC
// ===================================

const modal = document.getElementById('application-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const applicationForm = document.getElementById('application-form');
const jobTitleModal = document.getElementById('job-title-modal');
const resumeInput = document.getElementById('applicant-resume');
const resumeFileName = document.getElementById('resume-file-name');

function initializeModal() {
    closeModalBtn.addEventListener('click', closeApplicationModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeApplicationModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeApplicationModal();
        }
    });

    resumeInput.addEventListener('change', () => {
        resumeFileName.textContent = resumeInput.files[0] ? resumeInput.files[0].name : '';
    });

    applicationForm.addEventListener('submit', handleApplicationSubmit);
}

function openApplicationModal(jobTitle) {
    jobTitleModal.textContent = jobTitle;
    applicationForm.dataset.jobTitle = jobTitle;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeApplicationModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    applicationForm.reset();
    resumeFileName.textContent = '';
    hideFormMessage();
}

async function handleApplicationSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitButton = form.querySelector('.btn-submit');
    
   if (!form.elements.name.value || !form.elements.email.value || !resumeInput.files[0]) {
    showFormMessage('Please fill out your name, email, and upload a resume.', 'error');
    return;
}


    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    const formData = new FormData(form);
    formData.append('jobTitle', form.dataset.jobTitle);

    try {
        const response = await fetch('https://orivanta-backend.vercel.app/api/careers/apply', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Submission failed');
        }

        showFormMessage('✅ Thank you! Your application has been submitted.', 'success');
        setTimeout(closeApplicationModal, 3000);

    } catch (error) {
        console.error('Error:', error);
        showFormMessage(`Error: ${error.message}`, 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Application';
    }
}

function showFormMessage(message, type) {
    const messageEl = document.getElementById('modal-form-message');
    messageEl.textContent = message;
    messageEl.className = `form-message ${type}`;
}

function hideFormMessage() {
    const messageEl = document.getElementById('modal-form-message');
    messageEl.className = 'form-message';
}

// ===================================
// SHARED COMPONENTS
// ===================================

function loadSharedComponents() {
    fetch('shared/header.html')
        .then(r => r.text())
        .then(html => {
            document.getElementById('header-placeholder').innerHTML = html;
            initializeHeader();
            setActiveNavLink();
        })
        .catch(err => console.error('Error loading header:', err));

    fetch('shared/footer.html')
        .then(r => r.text())
        .then(html => {
            document.getElementById('footer-placeholder').innerHTML = html;
        })
        .catch(err => console.error('Error loading footer:', err));
}

function initializeHeader() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav-menu');
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }
}

function setActiveNavLink() {
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === 'careers.html') {
            link.classList.add('active');
        }
    });
}



