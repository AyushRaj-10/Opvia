# Opvia - Resume Builder & ATS Checker

A full-stack web application for creating professional resumes and checking their compatibility with Applicant Tracking Systems (ATS). Build, customize, and optimize your resume with real-time preview and PDF export capabilities.

## 🚀 Features

### Resume Builder
- **Interactive Editor**: Create and edit resumes with an intuitive interface
- **Multiple Templates**: Choose from various professional resume templates
- **Real-time Preview**: See your changes instantly as you edit
- **PDF Export**: Download your resume as a professional PDF document
- **CRUD Operations**: Create, read, update, and delete multiple resumes
- **Comprehensive Sections**:
  - Personal Information (name, email, phone, LinkedIn, portfolio)
  - Professional Summary
  - Work Experience
  - Education
  - Skills
  - Projects

### ATS Checker
- **Keyword Matching**: Analyze how well your resume matches job descriptions
- **Score Calculation**: Get an ATS compatibility score (0-100%)
- **Keyword Analysis**: See matched and missing keywords
- **PDF/DOCX Support**: Upload resumes in multiple formats
- **Actionable Recommendations**: Get tips to improve your resume's ATS score

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **html2pdf.js** - PDF generation

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database (via Mongoose)
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **Natural** - Natural language processing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Resume
   ```

2. **Install Client Dependencies**
   ```bash
   cd Client
   npm install
   ```

3. **Install Server Dependencies**
   ```bash
   cd ../Server
   npm install
   ```

4. **Set up Environment Variables**

   Create a `.env` file in the `Server` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   ```

   For MongoDB Atlas:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```

   For local MongoDB:
   ```env
   MONGO_URI=mongodb://localhost:27017/resume_db
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server**
   ```bash
   cd Server
   npm start
   ```
   The server will run on `http://localhost:3000`

2. **Start the Frontend Development Server**
   ```bash
   cd Client
   npm run dev
   ```
   The client will run on `http://localhost:5173` (or another port if 5173 is busy)

3. **Access the Application**
   - Open your browser and navigate to `http://localhost:5173`
   - The frontend will communicate with the backend API

### Production Build

1. **Build the Frontend**
   ```bash
   cd Client
   npm run build
   ```

2. **Serve the Production Build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
Resume/
├── Client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx   # Main resume builder page
│   │   │   └── ATSChecker.jsx  # ATS checker page
│   │   ├── context/       # React context providers
│   │   │   ├── ResumeContext.jsx
│   │   │   └── ResumeTemplateSelector.jsx
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── Server/                # Backend Express application
│   ├── controllers/       # Request handlers
│   │   ├── resume.controller.js
│   │   └── ats.controller.js
│   ├── models/            # MongoDB models
│   │   └── resume.model.js
│   ├── routes/            # API routes
│   │   ├── resume.routes.js
│   │   └── ats.routes.js
│   ├── utils/             # Utility functions
│   │   └── db.js          # Database connection
│   ├── uploads/           # Temporary file storage
│   ├── server.js          # Server entry point
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Resume Endpoints

- `GET /api/resumes` - Get all resumes
- `GET /api/resumes/:id` - Get a specific resume
- `POST /api/resumes` - Create a new resume
- `PUT /api/resumes/:id/personal` - Update personal information
- `PUT /api/resumes/:id/summary` - Update summary
- `POST /api/resumes/:id/skills` - Add a skill
- `DELETE /api/resumes/:id/skills` - Delete a skill
- `POST /api/resumes/:id/experience` - Add work experience
- `PUT /api/resumes/:id/experience/:experienceId` - Update experience
- `DELETE /api/resumes/:id/experience/:experienceId` - Delete experience
- `POST /api/resumes/:id/education` - Add education
- `PUT /api/resumes/:id/education/:educationId` - Update education
- `DELETE /api/resumes/:id/education/:educationId` - Delete education
- `POST /api/resumes/:id/projects` - Add a project
- `PUT /api/resumes/:id/projects/:projectId` - Update project
- `DELETE /api/resumes/:id/projects/:projectId` - Delete project
- `DELETE /api/resumes/:id` - Delete a resume

### ATS Checker Endpoints

- `POST /api/ats/check` - Check resume against job description
  - **Body**: `multipart/form-data`
    - `resume`: PDF or DOCX file
    - `jobDescription`: Text string

## 💡 Usage Guide

### Creating a Resume

1. Click "Start Building" on the homepage
2. Fill in your personal information in the "Personal" tab
3. Add sections using the tabs:
   - **Summary**: Write a professional summary
   - **Experience**: Add work experience entries
   - **Education**: Add educational background
   - **Skills**: Add relevant skills
   - **Projects**: Add portfolio projects
4. Choose a template from the preview panel
5. Click "Download Resume" to export as PDF

### Using the ATS Checker

1. Navigate to the ATS Checker page
2. Paste the job description in the text area
3. Upload your resume (PDF or DOCX format)
4. Click "Check ATS Score"
5. Review your score and recommendations
6. Use the matched/missing keywords to optimize your resume

## 🎨 Customization

### Adding New Resume Templates

Templates are defined in `Client/src/context/ResumeTemplateSelector.jsx`. To add a new template:

1. Create a template component function
2. Add it to the `RESUME_TEMPLATES` object
3. The template will automatically appear in the template selector

### Modifying ATS Algorithm

The ATS checking algorithm is in `Server/controllers/ats.controller.js`. You can customize:
- Stop words list
- Keyword extraction logic
- Scoring algorithm
- Minimum keyword length

## 🐛 Troubleshooting

### MongoDB Connection Issues

- **Atlas Connection**: Ensure your IP is whitelisted in MongoDB Atlas Network Access
- **Local MongoDB**: Make sure MongoDB is running: `mongodb://localhost:27017`
- **Connection String**: Verify your `MONGO_URI` in the `.env` file is correct

### File Upload Issues

- Ensure the `Server/uploads/` directory exists and has write permissions
- Check file size limits in `multer` configuration
- Verify file format (PDF or DOCX)

### CORS Errors

- Ensure CORS is enabled in `Server/server.js`
- Verify the frontend URL matches the CORS origin configuration

## 📝 Environment Variables

Create a `.env` file in the `Server` directory with:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

Created with ❤️ for job seekers everywhere.

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database solution
- All open-source contributors whose packages made this project possible

---

**Note**: Make sure to keep your MongoDB connection string secure and never commit it to version control. Use environment variables for all sensitive configuration.
