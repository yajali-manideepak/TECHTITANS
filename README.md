# Resume Builder Pro - Deployment Guide

A professional resume builder application with employee search and email integration capabilities.

## 🚀 Features

- **Resume Builder**: Create professional resumes with all sections
- **Employee Search**: Find employees by skills
- **Email Integration**: Send resumes directly to employees
- **PDF Download**: Export resumes as PDF
- **Data Persistence**: Save resumes to database
- **Responsive Design**: Works on all devices
- **Real-time Validation**: Mandatory field validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Gmail account with App Password (for email functionality)
- Modern web browser

## 🔧 Installation

### 1. Clone or Download Repository
```bash
cd resume-builder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your configuration:
PORT=5000
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

### 4. Setup Gmail App Password (for email feature)
1. Go to: https://myaccount.google.com/apppasswords
2. Enable 2-Factor Authentication if not already enabled
3. Generate an "App password" for "Mail" and "Windows Computer"
4. Copy the 16-character password to `.env` file as `EMAIL_PASSWORD`

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## 📁 Project Structure

```
resume-builder/
├── index.html           # Main HTML file
├── index.css            # Styling
├── index.js             # Frontend JavaScript
├── server.js            # Backend Express server
├── package.json         # Dependencies
├── .env.example         # Environment variables template
├── .env                 # Your actual environment variables (create this)
└── README.md            # This file
```

## 🔌 API Endpoints

### Resume Management
- **POST** `/api/resume/save` - Save a new resume
- **GET** `/api/resume/:id` - Get resume by ID
- **GET** `/api/resumes` - Get all resumes

### Employee Management
- **GET** `/api/employees` - Get all employees
- **POST** `/api/employees/search` - Search employees by skills

### Email Service
- **POST** `/api/email/send` - Send email to single employee
- **POST** `/api/email/send-bulk` - Send emails to multiple employees

### Health Check
- **GET** `/api/health` - Server health status

## 📧 Email Feature Usage

### Send Resume to Single Employee
```javascript
const response = await fetch('/api/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        employeeEmail: 'employee@example.com',
        employeeName: 'John Doe',
        senderName: 'Jane Smith',
        senderEmail: 'jane@example.com',
        resumeContent: '<html>...</html>',
        message: 'I am interested in this opportunity'
    })
});
```

### Send Resume to Multiple Employees
```javascript
const response = await fetch('/api/email/send-bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        employeeEmails: [
            { email: 'emp1@example.com', name: 'John' },
            { email: 'emp2@example.com', name: 'Jane' }
        ],
        senderName: 'You',
        senderEmail: 'your-email@gmail.com',
        resumeContent: '<html>...</html>',
        message: 'Check out my resume!'
    })
});
```

## 🌐 Deployment Options

### Option 1: Heroku Deployment
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password

# Deploy
git push heroku main
```

### Option 2: AWS Deployment
1. Create EC2 instance
2. Install Node.js
3. Clone repository
4. Set environment variables
5. Run `npm install && npm start`

### Option 3: Docker Deployment
Create a `Dockerfile`:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t resume-builder .
docker run -p 5000:5000 --env-file .env resume-builder
```

### Option 4: Vercel/Netlify (Frontend only)
For frontend-only deployment without backend features:
1. Build static files
2. Deploy `index.html`, `index.css`, `index.js` to Vercel/Netlify

## 🔐 Security Considerations

1. **Never commit .env file** - Add to .gitignore
2. **Use App Passwords** - Don't use main Gmail password
3. **Enable HTTPS** - Always use HTTPS in production
4. **Validate Input** - All inputs are server-side validated
5. **Rate Limiting** - Add rate limiting for email endpoints
6. **CORS Configuration** - Restrict CORS in production

## 📊 Database Integration

To use a real database (PostgreSQL, MongoDB, etc.):

1. Install database driver
2. Update `server.js` with database connection
3. Replace mock data with database queries
4. Implement CRUD operations

## 🐛 Troubleshooting

### Email Not Sending
- Check if App Password is correct
- Verify 2FA is enabled on Google account
- Check EMAIL_USER in .env

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### CORS Errors
- Check CORS configuration in server.js
- Ensure frontend and backend URLs match

## 📈 Performance Tips

1. Implement database indexing on email, skills
2. Add response caching with Redis
3. Use CDN for static files
4. Implement pagination for large datasets
5. Add request throttling/rate limiting

## 🤝 Support & Contribution

For issues or contributions, please create an issue or pull request.

## 📝 License

MIT License - See LICENSE file for details

## 🎯 Future Enhancements

- [ ] User authentication & authorization
- [ ] Real database integration
- [ ] Advanced resume templates
- [ ] Video resume support
- [ ] Job matching algorithm
- [ ] Analytics dashboard
- [ ] Interview scheduling
- [ ] Portfolio integration

---

**Created with ❤️ for Resume Builder Pro v1.0.0**
