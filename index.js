// ========================
// VALIDATION UTILITIES
// ========================
function validateRequiredFields() {
    const errors = [];
    
    if (!appState.resume.personal.firstName?.trim()) {
        errors.push('First name is required');
    }
    if (!appState.resume.personal.lastName?.trim()) {
        errors.push('Last name is required');
    }   
    if (!appState.resume.personal.email?.trim()) {
        errors.push('Email is required');
    }
    if (!appState.resume.personal.phone?.trim()) {
        errors.push('Phone number is required');
    }
    
    return errors;
}

function highlightMissingFields() {
    const fields = ['firstName', 'lastName', 'email', 'phone'];
    fields.forEach(field => {
        const element = document.getElementById(field);
        const checkElement = document.getElementById(field + '-check');
        if (element && !appState.resume.personal[field]?.trim()) {
            element.style.borderColor = '#ef4444';
            element.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            if (checkElement) checkElement.textContent = '';
        } else if (element) {
            element.style.borderColor = '#10b981';
            element.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            if (checkElement) checkElement.textContent = '✓';
        }
    });
}

// ========================
// STATE MANAGEMENT
// ========================
const appState = {
    resume: {
        personal: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            location: '',
            website: '',
            summary: ''
        },
        education: [],
        experience: [],
        skills: [],
        certifications: []
    },
    employees: [],
    currentModalType: null,
    currentEditIndex: null
};

// ========================
// MOCK DATABASE - EMPLOYEE DATA
// ========================
const mockEmployees = [
    {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Docker'],
        experience: 5,
        rating: 4.8
    },
    {
        id: 2,
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'm.chen@example.com',
        phone: '+1 (555) 234-5678',
        location: 'New York, NY',
        skills: ['Java', 'Spring Boot', 'SQL', 'AWS', 'Kubernetes'],
        experience: 7,
        rating: 4.9
    },
    {
        id: 3,
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily.r@example.com',
        phone: '+1 (555) 345-6789',
        location: 'Austin, TX',
        skills: ['TypeScript', 'Angular', 'MongoDB', 'GraphQL', 'Azure'],
        experience: 4,
        rating: 4.7
    },
    {
        id: 4,
        firstName: 'David',
        lastName: 'Smith',
        email: 'david.smith@example.com',
        phone: '+1 (555) 456-7890',
        location: 'Boston, MA',
        skills: ['Python', 'Django', 'PostgreSQL', 'TensorFlow', 'AWS'],
        experience: 6,
        rating: 4.8
    },
    {
        id: 5,
        firstName: 'Lisa',
        lastName: 'Wang',
        email: 'lisa.wang@example.com',
        phone: '+1 (555) 567-8901',
        location: 'Seattle, WA',
        skills: ['React', 'Node.js', 'JavaScript', 'CSS', 'Firebase'],
        experience: 3,
        rating: 4.6
    },
    {
        id: 6,
        firstName: 'James',
        lastName: 'Anderson',
        email: 'james.a@example.com',
        phone: '+1 (555) 678-9012',
        location: 'Chicago, IL',
        skills: ['C#', '.NET', 'SQL Server', 'Azure', 'Docker'],
        experience: 8,
        rating: 4.9
    }
];

// ========================
// EMAIL SERVICE INITIALIZATION
// ========================
let emailJSInitialized = false;

function initializeEmailJS() {
    if (emailJSInitialized) return;
    
    try {
        // Public key - safe to expose
        emailjs.init('YOUR_PUBLIC_KEY_HERE');
        emailJSInitialized = true;
        console.log('EmailJS initialized');
    } catch (error) {
        console.warn('EmailJS not available:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeEmailJS();
    initializeEventListeners();
    loadResume();
    renderEducation();
    renderExperience();
    renderSkills();
    renderCertifications();
});

// ========================
// EVENT LISTENERS
// ========================
function initializeEventListeners() {
    // Tab Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchTab);
    });

    // Personal Information
    document.getElementById('firstName').addEventListener('change', (e) => {
        appState.resume.personal.firstName = e.target.value;
        highlightMissingFields();
    });
    document.getElementById('lastName').addEventListener('change', (e) => {
        appState.resume.personal.lastName = e.target.value;
        highlightMissingFields();
    });
    document.getElementById('email').addEventListener('change', (e) => {
        appState.resume.personal.email = e.target.value;
        highlightMissingFields();
    });
    document.getElementById('phone').addEventListener('change', (e) => {
        appState.resume.personal.phone = e.target.value;
        highlightMissingFields();
    });
    document.getElementById('location').addEventListener('change', (e) => {
        appState.resume.personal.location = e.target.value;
    });
    document.getElementById('website').addEventListener('change', (e) => {
        appState.resume.personal.website = e.target.value;
    });
    document.getElementById('summary').addEventListener('change', (e) => {
        appState.resume.personal.summary = e.target.value;
    });

    // Education
    document.getElementById('addEducation').addEventListener('click', () => {
        openModal('education');
    });

    // Experience
    document.getElementById('addExperience').addEventListener('click', () => {
        openModal('experience');
    });

    // Skills
    document.getElementById('addSkill').addEventListener('click', addSkill);
    document.getElementById('skillInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addSkill();
        }
    });

    // Certifications
    document.getElementById('addCertification').addEventListener('click', () => {
        openModal('certification');
    });

    // Form Actions
    document.getElementById('saveResume').addEventListener('click', saveResume);
    document.getElementById('previewBtn').addEventListener('click', () => {
        switchTab({ target: { dataset: { tab: 'preview' } } });
        setTimeout(generatePreview, 100);
    });
    document.getElementById('clearForm').addEventListener('click', clearAllData);

    // Search
    document.getElementById('searchBtn').addEventListener('click', searchEmployees);
    document.getElementById('skillSearch').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchEmployees();
        }
    });

    // Download Resume
    document.getElementById('downloadResume').addEventListener('click', downloadResumePDF);

    // Modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelModal').addEventListener('click', closeModal);
    document.getElementById('saveModal').addEventListener('click', saveModalData);
}

// ========================
// TAB NAVIGATION
// ========================
function switchTab(e) {
    const tabName = e.target.dataset.tab;

    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    e.target.classList.add('active');
}

// ========================
// MODAL MANAGEMENT
// ========================
function openModal(type, editIndex = null) {
    appState.currentModalType = type;
    appState.currentEditIndex = editIndex;

    const modal = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');

    let title = '';
    let content = '';

    switch (type) {
        case 'education':
            title = editIndex !== null ? 'Edit Education' : 'Add Education';
            content = generateEducationForm(editIndex);
            break;
        case 'experience':
            title = editIndex !== null ? 'Edit Experience' : 'Add Work Experience';
            content = generateExperienceForm(editIndex);
            break;
        case 'certification':
            title = editIndex !== null ? 'Edit Certification' : 'Add Certification';
            content = generateCertificationForm(editIndex);
            break;
    }

    modalTitle.textContent = title;
    modalContent.innerHTML = content;
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.remove('active');
    appState.currentModalType = null;
    appState.currentEditIndex = null;
}

function saveModalData() {
    const type = appState.currentModalType;
    const editIndex = appState.currentEditIndex;

    if (type === 'education') {
        const data = {
            degree: document.getElementById('degree').value,
            institution: document.getElementById('institution').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            description: document.getElementById('eduDescription').value
        };

        if (!data.degree || !data.institution) {
            alert('Please fill all required fields');
            return;
        }

        if (editIndex !== null) {
            appState.resume.education[editIndex] = data;
        } else {
            appState.resume.education.push(data);
        }
        renderEducation();
    } else if (type === 'experience') {
        const data = {
            company: document.getElementById('company').value,
            position: document.getElementById('position').value,
            startDate: document.getElementById('expStartDate').value,
            endDate: document.getElementById('expEndDate').value,
            description: document.getElementById('expDescription').value
        };

        if (!data.company || !data.position) {
            alert('Please fill all required fields');
            return;
        }

        if (editIndex !== null) {
            appState.resume.experience[editIndex] = data;
        } else {
            appState.resume.experience.push(data);
        }
        renderExperience();
    } else if (type === 'certification') {
        const data = {
            name: document.getElementById('certName').value,
            issuer: document.getElementById('issuer').value,
            date: document.getElementById('certDate').value,
            url: document.getElementById('certUrl').value
        };

        if (!data.name || !data.issuer) {
            alert('Please fill all required fields');
            return;
        }

        if (editIndex !== null) {
            appState.resume.certifications[editIndex] = data;
        } else {
            appState.resume.certifications.push(data);
        }
        renderCertifications();
    }

    closeModal();
    showNotification('Saved successfully!', 'success');
}

// ========================
// FORM GENERATORS
// ========================
function generateEducationForm(editIndex) {
    const data = editIndex !== null ? appState.resume.education[editIndex] : {};

    return `
        <div class="form-grid">
            <div class="form-group full">
                <label for="degree">Degree *</label>
                <input type="text" id="degree" placeholder="e.g., Bachelor of Science" value="${data.degree || ''}">
            </div>
            <div class="form-group full">
                <label for="institution">Institution *</label>
                <input type="text" id="institution" placeholder="e.g., Stanford University" value="${data.institution || ''}">
            </div>
            <div class="form-group">
                <label for="startDate">Start Date</label>
                <input type="month" id="startDate" value="${data.startDate || ''}">
            </div>
            <div class="form-group">
                <label for="endDate">End Date</label>
                <input type="month" id="endDate" value="${data.endDate || ''}">
            </div>
            <div class="form-group full">
                <label for="eduDescription">Details</label>
                <textarea id="eduDescription" placeholder="Add any additional details..." rows="3">${data.description || ''}</textarea>
            </div>
        </div>
    `;
}

function generateExperienceForm(editIndex) {
    const data = editIndex !== null ? appState.resume.experience[editIndex] : {};

    return `
        <div class="form-grid">
            <div class="form-group full">
                <label for="company">Company Name *</label>
                <input type="text" id="company" placeholder="e.g., Google" value="${data.company || ''}">
            </div>
            <div class="form-group full">
                <label for="position">Job Position *</label>
                <input type="text" id="position" placeholder="e.g., Senior Software Engineer" value="${data.position || ''}">
            </div>
            <div class="form-group">
                <label for="expStartDate">Start Date</label>
                <input type="month" id="expStartDate" value="${data.startDate || ''}">
            </div>
            <div class="form-group">
                <label for="expEndDate">End Date (Leave blank if current)</label>
                <input type="month" id="expEndDate" value="${data.endDate || ''}">
            </div>
            <div class="form-group full">
                <label for="expDescription">Job Description</label>
                <textarea id="expDescription" placeholder="Describe your responsibilities and achievements..." rows="4">${data.description || ''}</textarea>
            </div>
        </div>
    `;
}

function generateCertificationForm(editIndex) {
    const data = editIndex !== null ? appState.resume.certifications[editIndex] : {};

    return `
        <div class="form-grid">
            <div class="form-group full">
                <label for="certName">Certification Name *</label>
                <input type="text" id="certName" placeholder="e.g., AWS Certified Solutions Architect" value="${data.name || ''}">
            </div>
            <div class="form-group full">
                <label for="issuer">Issuing Organization *</label>
                <input type="text" id="issuer" placeholder="e.g., Amazon Web Services" value="${data.issuer || ''}">
            </div>
            <div class="form-group">
                <label for="certDate">Issue Date</label>
                <input type="month" id="certDate" value="${data.date || ''}">
            </div>
            <div class="form-group full">
                <label for="certUrl">Certificate URL</label>
                <input type="url" id="certUrl" placeholder="https://..." value="${data.url || ''}">
            </div>
        </div>
    `;
}

// ========================
// EDUCATION MANAGEMENT
// ========================
function renderEducation() {
    const container = document.getElementById('educationList');
    container.innerHTML = '';

    if (appState.resume.education.length === 0) {
        container.innerHTML = '<p style="color: var(--text-light); text-align: center;">No education added yet</p>';
        return;
    }

    appState.resume.education.forEach((edu, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="card-title">${edu.degree}</div>
                    <div class="card-subtitle">${edu.institution}</div>
                    ${edu.startDate ? `<div class="card-subtitle" style="font-size: 0.9em; margin-top: 5px;">${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : 'Present'}</div>` : ''}
                </div>
                <div class="card-actions">
                    <button class="card-btn" onclick="openModal('education', ${index})" title="Edit">✏️</button>
                    <button class="card-btn" onclick="removeEducation(${index})" title="Delete">🗑️</button>
                </div>
            </div>
            ${edu.description ? `<p style="margin-top: 10px; color: var(--text-color);">${edu.description}</p>` : ''}
        `;
        container.appendChild(card);
    });
}

function removeEducation(index) {
    if (confirm('Are you sure you want to remove this education?')) {
        appState.resume.education.splice(index, 1);
        renderEducation();
        showNotification('Education removed', 'success');
    }
}

// ========================
// EXPERIENCE MANAGEMENT
// ========================
function renderExperience() {
    const container = document.getElementById('experienceList');
    container.innerHTML = '';

    if (appState.resume.experience.length === 0) {
        container.innerHTML = '<p style="color: var(--text-light); text-align: center;">No experience added yet</p>';
        return;
    }

    appState.resume.experience.forEach((exp, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="card-title">${exp.position}</div>
                    <div class="card-subtitle">${exp.company}</div>
                    ${exp.startDate ? `<div class="card-subtitle" style="font-size: 0.9em; margin-top: 5px;">${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>` : ''}
                </div>
                <div class="card-actions">
                    <button class="card-btn" onclick="openModal('experience', ${index})" title="Edit">✏️</button>
                    <button class="card-btn" onclick="removeExperience(${index})" title="Delete">🗑️</button>
                </div>
            </div>
            ${exp.description ? `<p style="margin-top: 10px; color: var(--text-color);">${exp.description}</p>` : ''}
        `;
        container.appendChild(card);
    });
}

function removeExperience(index) {
    if (confirm('Are you sure you want to remove this experience?')) {
        appState.resume.experience.splice(index, 1);
        renderExperience();
        showNotification('Experience removed', 'success');
    }
}

// ========================
// SKILLS MANAGEMENT
// ========================
function renderSkills() {
    const container = document.getElementById('skillsList');
    container.innerHTML = '';

    if (appState.resume.skills.length === 0) {
        container.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 20px;">No skills added yet</p>';
        return;
    }

    appState.resume.skills.forEach((skill, index) => {
        const tag = document.createElement('div');
        tag.className = 'skill-tag';
        tag.innerHTML = `
            ${skill}
            <span class="remove-skill" onclick="removeSkill(${index})">×</span>
        `;
        container.appendChild(tag);
    });
}

function addSkill() {
    const input = document.getElementById('skillInput');
    const skill = input.value.trim();

    if (!skill) {
        alert('Please enter a skill');
        return;
    }

    if (appState.resume.skills.includes(skill)) {
        alert('This skill is already added');
        return;
    }

    appState.resume.skills.push(skill);
    input.value = '';
    renderSkills();
}

function removeSkill(index) {
    appState.resume.skills.splice(index, 1);
    renderSkills();
}

// ========================
// CERTIFICATIONS MANAGEMENT
// ========================
function renderCertifications() {
    const container = document.getElementById('certificationsList');
    container.innerHTML = '';

    if (appState.resume.certifications.length === 0) {
        container.innerHTML = '<p style="color: var(--text-light); text-align: center;">No certifications added yet</p>';
        return;
    }

    appState.resume.certifications.forEach((cert, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="card-title">${cert.name}</div>
                    <div class="card-subtitle">${cert.issuer}</div>
                    ${cert.date ? `<div class="card-subtitle" style="font-size: 0.9em; margin-top: 5px;">${formatDate(cert.date)}</div>` : ''}
                </div>
                <div class="card-actions">
                    <button class="card-btn" onclick="openModal('certification', ${index})" title="Edit">✏️</button>
                    <button class="card-btn" onclick="removeCertification(${index})" title="Delete">🗑️</button>
                </div>
            </div>
            ${cert.url ? `<p style="margin-top: 10px;"><a href="${cert.url}" target="_blank" style="color: var(--primary-color);">View Certificate →</a></p>` : ''}
        `;
        container.appendChild(card);
    });
}

function removeCertification(index) {
    if (confirm('Are you sure you want to remove this certification?')) {
        appState.resume.certifications.splice(index, 1);
        renderCertifications();
        showNotification('Certification removed', 'success');
    }
}

// ========================
// RESUME SAVE & LOAD
// ========================
function saveResume() {
    // Validate required fields
    const errors = validateRequiredFields();
    
    if (errors.length > 0) {
        highlightMissingFields();
        const errorMessage = 'Please fill in all required fields:\n\n' + errors.map(e => '• ' + e).join('\n');
        showNotification(errorMessage, 'error');
        return;
    }

    // Save to localStorage
    localStorage.setItem('resumeData', JSON.stringify(appState.resume));
    highlightMissingFields(); // Remove highlights
    showNotification('Resume saved successfully! ✅', 'success');
}

function loadResume() {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
        try {
            appState.resume = JSON.parse(savedData);
            populateFormFields();
            renderEducation();
            renderExperience();
            renderSkills();
            renderCertifications();
        } catch (e) {
            console.error('Error loading resume:', e);
        }
    }
}

function populateFormFields() {
    document.getElementById('firstName').value = appState.resume.personal.firstName || '';
    document.getElementById('lastName').value = appState.resume.personal.lastName || '';
    document.getElementById('email').value = appState.resume.personal.email || '';
    document.getElementById('phone').value = appState.resume.personal.phone || '';
    document.getElementById('location').value = appState.resume.personal.location || '';
    document.getElementById('website').value = appState.resume.personal.website || '';
    document.getElementById('summary').value = appState.resume.personal.summary || '';
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        appState.resume = {
            personal: { firstName: '', lastName: '', email: '', phone: '', location: '', website: '', summary: '' },
            education: [],
            experience: [],
            skills: [],
            certifications: []
        };
        localStorage.removeItem('resumeData');
        populateFormFields();
        renderEducation();
        renderExperience();
        renderSkills();
        renderCertifications();
        showNotification('All data cleared', 'success');
    }
}

// ========================
// RESUME PREVIEW & EXPORT
// ========================
function generatePreview() {
    // Validate required fields first
    const errors = validateRequiredFields();
    if (errors.length > 0) {
        highlightMissingFields();
        const errorMessage = 'Cannot preview resume. Required fields missing:\n\n' + errors.map(e => '• ' + e).join('\n');
        showNotification(errorMessage, 'error');
        return;
    }
    
    const preview = document.getElementById('resumePreview');

    // Build contact info with website as clickable link
    let contactInfo = '';
    const contactItems = [];
    
    if (appState.resume.personal.email) {
        contactItems.push(`<a href="mailto:${appState.resume.personal.email}" style="color: inherit; text-decoration: none;">${appState.resume.personal.email}</a>`);
    }
    if (appState.resume.personal.phone) {
        contactItems.push(`<a href="tel:${appState.resume.personal.phone}" style="color: inherit; text-decoration: none;">${appState.resume.personal.phone}</a>`);
    }
    if (appState.resume.personal.location) {
        contactItems.push(appState.resume.personal.location);
    }
    if (appState.resume.personal.website) {
        // Ensure URL has protocol
        let websiteUrl = appState.resume.personal.website;
        if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
            websiteUrl = 'https://' + websiteUrl;
        }
        contactItems.push(`<a href="${websiteUrl}" target="_blank" style="color: #2563eb; text-decoration: underline; cursor: pointer;">${appState.resume.personal.website}</a>`);
    }
    
    contactInfo = contactItems.join(' | ');

    let html = `
        <div class="resume-header">
            <div class="resume-name">${appState.resume.personal.firstName} ${appState.resume.personal.lastName}</div>
            <div class="resume-contact">${contactInfo}</div>
        </div>
    `;

    if (appState.resume.personal.summary) {
        html += `
            <div class="resume-section">
                <div class="resume-section-title">PROFESSIONAL SUMMARY</div>
                <div class="resume-summary">${appState.resume.personal.summary}</div>
            </div>
        `;
    }

    if (appState.resume.experience.length > 0) {
        html += '<div class="resume-section"><div class="resume-section-title">EXPERIENCE</div>';
        appState.resume.experience.forEach(exp => {
            html += `
                <div class="resume-entry">
                    <div class="resume-entry-title">${exp.position}</div>
                    <div class="resume-entry-subtitle">${exp.company}</div>
                    <div class="resume-entry-date">${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
                    ${exp.description ? `<div style="margin-top: 8px;">${exp.description}</div>` : ''}
                </div>
            `;
        });
        html += '</div>';
    }

    if (appState.resume.education.length > 0) {
        html += '<div class="resume-section"><div class="resume-section-title">EDUCATION</div>';
        appState.resume.education.forEach(edu => {
            html += `
                <div class="resume-entry">
                    <div class="resume-entry-title">${edu.degree}</div>
                    <div class="resume-entry-subtitle">${edu.institution}</div>
                    <div class="resume-entry-date">${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : 'Present'}</div>
                    ${edu.description ? `<div style="margin-top: 8px;">${edu.description}</div>` : ''}
                </div>
            `;
        });
        html += '</div>';
    }

    if (appState.resume.skills.length > 0) {
        html += '<div class="resume-section"><div class="resume-section-title">SKILLS</div>';
        html += '<div class="resume-skills">';
        appState.resume.skills.forEach(skill => {
            html += `<div class="resume-skill-item">${skill}</div>`;
        });
        html += '</div></div>';
    }

    if (appState.resume.certifications.length > 0) {
        html += '<div class="resume-section"><div class="resume-section-title">CERTIFICATIONS</div>';
        appState.resume.certifications.forEach(cert => {
            html += `
                <div class="resume-entry">
                    <div class="resume-entry-title">${cert.name}</div>
                    <div class="resume-entry-subtitle">${cert.issuer}</div>
                    ${cert.date ? `<div class="resume-entry-date">${formatDate(cert.date)}</div>` : ''}
                    ${cert.url ? `<div style="margin-top: 8px;"><a href="${cert.url}" target="_blank" style="color: #2563eb;">View Certificate</a></div>` : ''}
                </div>
            `;
        });
        html += '</div>';
    }

    preview.innerHTML = html;
}

function downloadResumePDF() {
    // Validate required fields first
    const errors = validateRequiredFields();
    if (errors.length > 0) {
        highlightMissingFields();
        const errorMessage = 'Cannot download resume. Required fields missing:\n\n' + errors.map(e => '• ' + e).join('\n');
        showNotification(errorMessage, 'error');
        return;
    }
    
    // Validate resume has required data
    if (!appState.resume.personal.firstName || !appState.resume.personal.lastName) {
        showNotification('Please fill in first and last name before downloading', 'error');
        return;
    }

    // Generate preview if it doesn't exist
    const previewElement = document.getElementById('resumePreview');
    if (!previewElement || previewElement.innerHTML.trim() === '') {
        generatePreview();
    }

    // Get the resume content
    const resumeContent = document.getElementById('resumePreview');
    
    // Create filename
    const firstName = appState.resume.personal.firstName.replace(/\s+/g, '-');
    const lastName = appState.resume.personal.lastName.replace(/\s+/g, '-');
    const fileName = `${firstName}-${lastName}-Resume.pdf`;

    try {
        // Configure PDF options
        const options = {
            margin: [10, 10, 10, 10],
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        };

        // Generate PDF from HTML element
        html2pdf().set(options).from(resumeContent).save().then(() => {
            showNotification('Resume downloaded successfully! 📄', 'success');
        }).catch((error) => {
            console.error('PDF generation error:', error);
            showNotification('Error generating PDF. Please try again.', 'error');
        });

    } catch (error) {
        console.error('Download error:', error);
        showNotification('Error downloading resume. Please try again.', 'error');
    }
}

// ========================
// EMPLOYEE SEARCH BY SKILLS
// ========================
function searchEmployees() {
    const searchInput = document.getElementById('skillSearch').value.trim();

    if (!searchInput) {
        alert('Please enter at least one skill to search');
        return;
    }

    const searchSkills = searchInput.split(',').map(skill => skill.trim().toLowerCase());
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    // Filter employees based on skills
    const matchedEmployees = mockEmployees.filter(emp => {
        return emp.skills.some(skill => 
            searchSkills.some(searchSkill => 
                skill.toLowerCase().includes(searchSkill) || 
                searchSkill.includes(skill.toLowerCase())
            )
        );
    }).sort((a, b) => {
        // Sort by number of matching skills
        const aMatches = a.skills.filter(skill => 
            searchSkills.some(searchSkill => 
                skill.toLowerCase().includes(searchSkill) || 
                searchSkill.includes(skill.toLowerCase())
            )
        ).length;
        
        const bMatches = b.skills.filter(skill => 
            searchSkills.some(searchSkill => 
                skill.toLowerCase().includes(searchSkill) || 
                searchSkill.includes(skill.toLowerCase())
            )
        ).length;

        return bMatches - aMatches;
    });

    if (matchedEmployees.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>No employees found</h3>
                <p>Try searching with different skills</p>
            </div>
        `;
        return;
    }

    matchedEmployees.forEach(emp => {
        const matchedSkills = emp.skills.filter(skill =>
            searchSkills.some(searchSkill =>
                skill.toLowerCase().includes(searchSkill) ||
                searchSkill.includes(skill.toLowerCase())
            )
        );

        const card = document.createElement('div');
        card.className = 'employee-card';
        card.innerHTML = `
            <div class="employee-header">
                <div class="employee-avatar">${emp.firstName.charAt(0)}${emp.lastName.charAt(0)}</div>
                <div class="employee-info">
                    <h3>${emp.firstName} ${emp.lastName}</h3>
                    <p>${emp.email}</p>
                    <p>${emp.location}</p>
                </div>
            </div>

            <div class="employee-rating">
                <span>⭐ ${emp.rating}</span>
                <span>•</span>
                <span>${emp.experience} years experience</span>
            </div>

            <div class="employee-skills">
                <h4>Skills (${emp.skills.length} total)</h4>
                <div class="employee-skills-list">
                    ${emp.skills.map(skill => {
                        const isMatched = matchedSkills.includes(skill);
                        return `<span class="skill-badge ${isMatched ? 'matched-skill' : ''}">${skill}</span>`;
                    }).join('')}
                </div>
            </div>

            <button class="btn btn-primary" style="width: 100%;" onclick="sendResumeToEmployee('${emp.firstName}', '${emp.lastName}', '${emp.email}')">📧 Send My Resume</button>
        `;
        resultsContainer.appendChild(card);
    });

    showNotification(`Found ${matchedEmployees.length} employee(s) matching your skills`, 'success');
}

/**
 * Send the built resume to an employee
 */
function sendResumeToEmployee(firstName, lastName, email) {
    // Validate resume is complete
    const errors = validateRequiredFields();
    if (errors.length > 0) {
        showNotification('❌ Please complete your resume first!\n\nRequired: First Name, Last Name, Email, Phone', 'error');
        return;
    }

    // Generate resume HTML
    try {
        if (!document.getElementById('resumePreview').innerHTML.trim()) {
            generatePreview();
        }
    } catch (error) {
        console.error('Error generating preview:', error);
        showNotification('Error generating resume preview. Please try again.', 'error');
        return;
    }

    const resumeContent = document.getElementById('resumePreview').innerHTML;
    const senderName = `${appState.resume.personal.firstName} ${appState.resume.personal.lastName}`;
    const senderEmail = appState.resume.personal.email;

    // Show confirmation dialog
    const message = prompt(
        `📧 Send your resume to ${firstName} ${lastName}?\n\nYou can add a personal message (optional):`,
        `Hi ${firstName}, I noticed your skills match my interests. I would love to connect with you!`
    );

    if (message === null) return; // User cancelled

    // Show loading state
    showNotification('⏳ Sending resume via email...', 'info');

    // Method 1: Try EmailJS (no backend needed)
    if (typeof emailjs !== 'undefined') {
        sendViaEmailJS(firstName, lastName, email, senderName, senderEmail, resumeContent, message);
    } else {
        // Method 2: Try backend API
        sendViaBackend(firstName, lastName, email, senderName, senderEmail, resumeContent, message);
    }
}

/**
 * Send resume using EmailJS (Client-side, no backend needed)
 */
function sendViaEmailJS(firstName, lastName, email, senderName, senderEmail, resumeContent, message) {
    // Create resume text summary
    const resumeText = `
NAME: ${senderName}
EMAIL: ${senderEmail}
PHONE: ${appState.resume.personal.phone}
LOCATION: ${appState.resume.personal.location || 'Not specified'}
WEBSITE: ${appState.resume.personal.website || 'Not specified'}
SUMMARY: ${appState.resume.personal.summary || 'Not specified'}
SKILLS: ${appState.resume.skills.join(', ') || 'Not added'}
    `;

    const templateParams = {
        to_email: email,
        to_name: firstName,
        from_name: senderName,
        from_email: senderEmail,
        phone: appState.resume.personal.phone,
        skills: appState.resume.skills.join(', ') || 'Not added',
        message: message,
        resume_text: resumeText
    };

    // Note: This requires EmailJS setup. For demo, we'll use a simple mailto approach
    sendViaMailto(firstName, lastName, email, senderName, senderEmail, resumeContent, message);
}

/**
 * Send resume using simple mailto link (Works without any backend)
 */
function sendViaMailto(firstName, lastName, email, senderName, senderEmail, resumeContent, message) {
    const resumeText = `
RESUME FROM: ${senderName}
EMAIL: ${senderEmail}
PHONE: ${appState.resume.personal.phone}
LOCATION: ${appState.resume.personal.location || 'Not specified'}
WEBSITE: ${appState.resume.personal.website || 'Not specified'}
SUMMARY: ${appState.resume.personal.summary || 'Not specified'}
SKILLS: ${appState.resume.skills.join(', ') || 'Not added'}

EDUCATION:
${appState.resume.education.length > 0 ? 
    appState.resume.education.map(e => `${e.degree} - ${e.institution} (${e.startDate})`).join('\n') : 
    'Not added'}

EXPERIENCE:
${appState.resume.experience.length > 0 ? 
    appState.resume.experience.map(exp => `${exp.position} at ${exp.company} (${exp.startDate})`).join('\n') : 
    'Not added'}

CERTIFICATIONS:
${appState.resume.certifications.length > 0 ? 
    appState.resume.certifications.map(c => `${c.name} - ${c.issuer}`).join('\n') : 
    'Not added'}
    `;

    const subject = `Resume from ${senderName}`;
    const body = `Hi ${firstName},\n\n${message}\n\n---\n\n${resumeText}`;

    // Create mailto link
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    // Show success message
    setTimeout(() => {
        showNotification(`✅ Email client opened! Complete the email to ${firstName} ${lastName}`, 'success');
    }, 500);
}

/**
 * Send resume using Backend API
 */
function sendViaBackend(firstName, lastName, email, senderName, senderEmail, resumeContent, message) {
    const API_BASE_URL = window.location.origin;
    
    fetch(`${API_BASE_URL}/api/email/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            employeeEmail: email,
            employeeName: firstName,
            senderName: senderName,
            senderEmail: senderEmail,
            resumeContent: resumeContent,
            message: message
        }),
        timeout: 5000
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showNotification(`✅ Resume sent successfully to ${firstName} ${lastName}!`, 'success');
        } else {
            throw new Error(data.message || 'Unknown error');
        }
    })
    .catch(error => {
        console.error('Backend error:', error);
        // Fallback to mailto
        sendViaMailto(firstName, lastName, email, senderName, senderEmail, resumeContent, message);
    });
}

function contactEmployee(name, email) {
    alert(`Contacting ${name}...\n\nEmail: ${email}`);
    showNotification(`Message sent to ${name}!`, 'success');
}

// ========================
// RESUME BUILDER API (Mock)
// ========================

/**
 * API Service for Resume Builder
 * Simulates backend API calls with mock data
 */
class ResumeBuilderAPI {
    static BASE_URL = '/api';

    /**
     * Save resume to backend
     * @param {Object} resumeData - Resume data object
     * @returns {Promise<Object>} - API response
     */
    static async saveResume(resumeData) {
        return new Promise((resolve, reject) => {
            try {
                console.log('Saving resume:', resumeData);
                setTimeout(() => {
                    resolve({
                        success: true,
                        message: 'Resume saved successfully',
                        id: Math.random().toString(36).substr(2, 9),
                        timestamp: new Date().toISOString(),
                        data: resumeData
                    });
                }, 500);
            } catch (error) {
                reject({ success: false, error: error.message });
            }
        });
    }

    /**
     * Load resume by ID
     * @param {String} resumeId - Resume ID
     * @returns {Promise<Object>} - Resume data
     */
    static async loadResume(resumeId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (resumeId) {
                    resolve({
                        success: true,
                        data: appState.resume
                    });
                } else {
                    reject({ success: false, error: 'Resume not found' });
                }
            }, 300);
        });
    }

    /**
     * Search employees by skills
     * @param {Array<String>} skills - Array of skill names
     * @returns {Promise<Array>} - Matching employees
     */
    static async searchEmployeesBySkills(skills) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const results = mockEmployees.filter(emp =>
                    emp.skills.some(s => skills.some(skill => 
                        s.toLowerCase().includes(skill.toLowerCase())
                    ))
                );
                resolve({
                    success: true,
                    count: results.length,
                    data: results
                });
            }, 400);
        });
    }

    /**
     * Generate resume from template
     * @param {Object} data - Resume data
     * @param {String} template - Template name
     * @returns {Promise<Object>} - Generated resume HTML
     */
    static async generateResume(data, template = 'professional') {
        return new Promise((resolve) => {
            setTimeout(() => {
                const html = `
                    <div class="resume">
                        <h1>${data.personal.firstName} ${data.personal.lastName}</h1>
                        <!-- Generated from template: ${template} -->
                    </div>
                `;
                resolve({
                    success: true,
                    html: html,
                    template: template
                });
            }, 300);
        });
    }

    /**
     * Validate resume
     * @param {Object} resumeData - Resume data
     * @returns {Promise<Object>} - Validation results
     */
    static async validateResume(resumeData) {
        return new Promise((resolve) => {
            const errors = [];
            const warnings = [];

            if (!resumeData.personal.firstName) errors.push('First name is required');
            if (!resumeData.personal.lastName) errors.push('Last name is required');
            if (!resumeData.personal.email) errors.push('Email is required');
            if (!resumeData.personal.phone) errors.push('Phone is required');
            if (resumeData.experience.length === 0) warnings.push('No work experience added');
            if (resumeData.education.length === 0) warnings.push('No education added');
            if (resumeData.skills.length < 3) warnings.push('Consider adding more skills');

            resolve({
                success: errors.length === 0,
                errors: errors,
                warnings: warnings,
                isValid: errors.length === 0
            });
        });
    }

    /**
     * Export resume as different formats
     * @param {Object} data - Resume data
     * @param {String} format - Export format (pdf, docx, html)
     * @returns {Promise<Object>} - Export result
     */
    static async exportResume(data, format = 'pdf') {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    format: format,
                    fileName: `${data.personal.firstName}-${data.personal.lastName}-resume.${format}`,
                    downloadUrl: '#'
                });
            }, 600);
        });
    }
}

// ========================
// UTILITY FUNCTIONS
// ========================
function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short' };
    return new Date(dateString + '-01').toLocaleDateString('en-US', options);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `${type}-message`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 2000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animation keyframes for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOutRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
`;
document.head.appendChild(style);

// ========================
// API USAGE EXAMPLES
// ========================

/**
 * Example usage of the ResumeBuilderAPI:
 * 
 * // Save resume
 * ResumeBuilderAPI.saveResume(appState.resume)
 *   .then(response => console.log('Saved:', response))
 *   .catch(error => console.error('Error:', error));
 * 
 * // Search employees
 * ResumeBuilderAPI.searchEmployeesBySkills(['JavaScript', 'React'])
 *   .then(response => console.log('Found:', response.data));
 * 
 * // Validate resume
 * ResumeBuilderAPI.validateResume(appState.resume)
 *   .then(response => console.log('Valid:', response.isValid));
 * 
 * // Export resume
 * ResumeBuilderAPI.exportResume(appState.resume, 'pdf')
 *   .then(response => console.log('Export:', response));
 */
