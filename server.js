// ========================
// RESUME BUILDER BACKEND SERVER
// ========================
// This is a Node.js/Express server for deployment purposes
// Install dependencies: npm install express nodemailer cors dotenv body-parser

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ========================
// MIDDLEWARE
// ========================
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

// ========================
// EMAIL CONFIGURATION
// ========================
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// ========================
// DATABASE (Mock - Replace with real DB)
// ========================
let resumes = [];
let employees = [];

// Mock employees data
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
// API ENDPOINTS
// ========================

/**
 * GET / - Serve main page
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * POST /api/resume/save - Save resume to database
 */
app.post('/api/resume/save', (req, res) => {
    try {
        const resume = req.body;
        
        // Validate required fields
        if (!resume.personal.firstName || !resume.personal.lastName || 
            !resume.personal.email || !resume.personal.phone) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Generate ID and timestamp
        const resumeData = {
            id: Date.now().toString(),
            ...resume,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        resumes.push(resumeData);

        res.json({
            success: true,
            message: 'Resume saved successfully',
            id: resumeData.id,
            data: resumeData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error saving resume',
            error: error.message
        });
    }
});

/**
 * GET /api/resume/:id - Get resume by ID
 */
app.get('/api/resume/:id', (req, res) => {
    try {
        const resume = resumes.find(r => r.id === req.params.id);
        
        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        res.json({
            success: true,
            data: resume
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving resume',
            error: error.message
        });
    }
});

/**
 * GET /api/resumes - Get all resumes
 */
app.get('/api/resumes', (req, res) => {
    try {
        res.json({
            success: true,
            count: resumes.length,
            data: resumes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving resumes',
            error: error.message
        });
    }
});

/**
 * POST /api/employees/search - Search employees by skills
 */
app.post('/api/employees/search', (req, res) => {
    try {
        const { skills } = req.body;

        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Skills array is required'
            });
        }

        const searchSkills = skills.map(s => s.toLowerCase());
        
        const matchedEmployees = mockEmployees.filter(emp => {
            return emp.skills.some(skill =>
                searchSkills.some(searchSkill =>
                    skill.toLowerCase().includes(searchSkill) ||
                    searchSkill.includes(skill.toLowerCase())
                )
            );
        }).sort((a, b) => {
            const aMatches = a.skills.filter(skill =>
                searchSkills.some(searchSkill =>
                    skill.toLowerCase().includes(searchSkill)
                )
            ).length;
            
            const bMatches = b.skills.filter(skill =>
                searchSkills.some(searchSkill =>
                    skill.toLowerCase().includes(searchSkill)
                )
            ).length;

            return bMatches - aMatches;
        });

        res.json({
            success: true,
            count: matchedEmployees.length,
            data: matchedEmployees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching employees',
            error: error.message
        });
    }
});

/**
 * GET /api/employees - Get all employees
 */
app.get('/api/employees', (req, res) => {
    try {
        res.json({
            success: true,
            count: mockEmployees.length,
            data: mockEmployees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving employees',
            error: error.message
        });
    }
});

/**
 * POST /api/email/send - Send email to employee
 * Sends resume builder's resume to the employee
 */
app.post('/api/email/send', (req, res) => {
    try {
        const { 
            employeeEmail, 
            employeeName, 
            senderName, 
            senderEmail, 
            resumeContent,
            message 
        } = req.body;

        // Validate required fields
        if (!employeeEmail || !senderName || !senderEmail) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: employeeEmail, senderName, senderEmail'
            });
        }

        // Email template
        const emailTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); 
                              color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                    .header h1 { margin: 0; font-size: 24px; }
                    .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
                    .content { background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                    .footer { text-align: center; color: #6b7280; font-size: 12px; }
                    a { color: #2563eb; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Resume Submission</h1>
                        <p>Professional Resume from Resume Builder Pro</p>
                    </div>
                    
                    <div class="content">
                        <p>Hi ${employeeName || 'there'},</p>
                        
                        <p>${message || 'I am interested in connecting with you regarding a potential opportunity.'}</p>
                        
                        <p><strong>My Details:</strong></p>
                        <ul>
                            <li>Name: ${senderName}</li>
                            <li>Email: <a href="mailto:${senderEmail}">${senderEmail}</a></li>
                        </ul>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        
                        <p><strong>My Resume:</strong></p>
                        ${resumeContent || '<p>Resume content not available</p>'}
                    </div>
                    
                    <div class="footer">
                        <p>This email was sent via Resume Builder Pro</p>
                        <p>&copy; 2024 Resume Builder Pro. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER || senderEmail,
            to: employeeEmail,
            subject: `Resume Submission from ${senderName}`,
            html: emailTemplate
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error sending email',
                    error: error.message
                });
            }

            res.json({
                success: true,
                message: 'Email sent successfully',
                messageId: info.messageId
            });
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing email request',
            error: error.message
        });
    }
});

/**
 * POST /api/email/send-bulk - Send email to multiple employees
 */
app.post('/api/email/send-bulk', (req, res) => {
    try {
        const { employeeEmails, senderName, senderEmail, resumeContent, message } = req.body;

        if (!employeeEmails || !Array.isArray(employeeEmails) || employeeEmails.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid employeeEmails array is required'
            });
        }

        let sentCount = 0;
        let failedCount = 0;
        const results = [];

        employeeEmails.forEach(emailItem => {
            const emailTemplate = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); 
                                  color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                        .header h1 { margin: 0; font-size: 24px; }
                        .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
                        .content { background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                        .footer { text-align: center; color: #6b7280; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Resume Submission</h1>
                            <p>Professional Resume from Resume Builder Pro</p>
                        </div>
                        
                        <div class="content">
                            <p>Hi ${emailItem.name || 'there'},</p>
                            <p>${message || 'I am interested in connecting with you.'}</p>
                            <p><strong>My Details:</strong></p>
                            <ul>
                                <li>Name: ${senderName}</li>
                                <li>Email: ${senderEmail}</li>
                            </ul>
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                            <p><strong>My Resume:</strong></p>
                            ${resumeContent || '<p>Resume content</p>'}
                        </div>
                        
                        <div class="footer">
                            <p>This email was sent via Resume Builder Pro</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            const mailOptions = {
                from: process.env.EMAIL_USER || senderEmail,
                to: emailItem.email,
                subject: `Resume Submission from ${senderName}`,
                html: emailTemplate
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    failedCount++;
                    results.push({
                        email: emailItem.email,
                        status: 'failed',
                        error: error.message
                    });
                } else {
                    sentCount++;
                    results.push({
                        email: emailItem.email,
                        status: 'sent',
                        messageId: info.messageId
                    });
                }
            });
        });

        res.json({
            success: true,
            message: `Bulk email sending initiated`,
            totalEmails: employeeEmails.length,
            sent: sentCount,
            failed: failedCount,
            results: results
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing bulk email request',
            error: error.message
        });
    }
});

/**
 * GET /api/health - Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date()
    });
});

// ========================
// ERROR HANDLING
// ========================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});

// ========================
// START SERVER
// ========================
app.listen(PORT, () => {
    console.log(`\n✅ Resume Builder Server is running on port ${PORT}`);
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log(`\n🚀 Features:`);
    console.log(`  - POST /api/resume/save - Save resume`);
    console.log(`  - GET /api/resume/:id - Get resume by ID`);
    console.log(`  - POST /api/employees/search - Search employees by skills`);
    console.log(`  - POST /api/email/send - Send email to employee`);
    console.log(`  - POST /api/email/send-bulk - Send bulk emails\n`);
});

module.exports = app;
