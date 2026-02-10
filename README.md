# Opvia - Resume Builder & ATS Checker

Full-stack web app to create ATS-friendly resumes, manage multiple versions, and check how well a resume matches a job description.

## 🚀 Core Features

### Resume Builder (Client)
- **Dashboard of resumes**: List of saved resumes with edit and delete actions.
- **Editor with tabs**:
  - Personal info (name, email, phone, LinkedIn, portfolio)
  - Summary
  - Experience (CRUD with inline edit/delete)
  - Education (CRUD with inline edit/delete)
  - Skills (add/remove chips)
  - Projects (CRUD with inline edit/delete)
- **Template system**:
  - Templates defined in `ResumeTemplateSelector` and selected via UI.
  - Preview rendered in real time from the same data used to save the resume.
- **PDF export**:
  - Uses `html2pdf.js` on the preview container (`template-pdf-content`) to generate a resume PDF.

### ATS Checker (Client + Server)
- **Form**:
  - Paste job description text.
  - Upload resume file (PDF/DOC/DOCX).
- **Server-side ATS check**:
  - Extracts text from PDF using `pdf-parse`.
  - Filters out stop words and short tokens.
  - Compares JD keywords against resume words.
  - Returns:
    - ATS score (0–100)
    - Matched keywords
    - Missing keywords
    - Keyword counts.
- **UI feedback**:
  - Colored score card and progress bar.
  - Pills for matched/missing keywords.
  - Simple recommendations based on score buckets.

## 🛠️ Tech Stack (Current)

### Client (`Client/`)
- **React** + **Vite**
- **React Router** (routes: `/` and `/ats-checker`)
- **Tailwind CSS**
- **Axios**
- **html2pdf.js**

### Server (`Server/`)
- **Node.js** / **Express**
- **MongoDB** via **Mongoose**
- **Multer** for uploads
- **pdf-parse** for PDF text
- **cors**, **dotenv**

## 📋 Prerequisites

- **Node.js** (v18+)
- **npm**
- **MongoDB** (local or Atlas)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Resume
   ```

2. **Install client dependencies**
   ```bash
   cd Client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../Server
   npm install
   ```

4. **Set up environment variables (Server/.env)**

   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   ```

   - Example (Atlas): `mongodb+srv://username:password@cluster.mongodb.net/dbname`
   - Example (local): `mongodb://localhost:27017/resume_db`

## 🚀 Running the Application

### Development mode

1. **Start the backend**
   ```bash
   cd Server
   npm start
   ```
   The server will run on `http://localhost:3000`

2. **Start the frontend**
   ```bash
   cd Client
   npm run dev
   ```
   The client will run on `http://localhost:5173` (or another port if 5173 is busy)

3. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - The frontend will communicate with the backend API

### Production build (client only)

1. **Build the frontend**
   ```bash
   cd Client
   npm run build
   ```

2. **Serve the build (preview)**
   ```bash
   npm run preview
   ```

## 📁 Project Structure (current)

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

### Resume endpoints

- `GET /api/resumes` – get all resumes
- `GET /api/resumes/:id` – get a resume by id
- `POST /api/resumes` – create a new resume
- `PUT /api/resumes/:id/personal` – update personal information
- `PUT /api/resumes/:id/summary` – update summary
- `POST /api/resumes/:id/skills` – add a skill
- `DELETE /api/resumes/:id/skills` – delete a skill
- `POST /api/resumes/:id/experience` – add work experience
- `PUT /api/resumes/:id/experience/:experienceId` – update experience
- `DELETE /api/resumes/:id/experience/:experienceId` – delete experience
- `POST /api/resumes/:id/education` – add education
- `PUT /api/resumes/:id/education/:educationId` – update education
- `DELETE /api/resumes/:id/education/:educationId` – delete education
- `POST /api/resumes/:id/projects` – add a project
- `PUT /api/resumes/:id/projects/:projectId` – update project
- `DELETE /api/resumes/:id/projects/:projectId` – delete project
- `DELETE /api/resumes/:id` – delete a resume

### ATS checker endpoint

- `POST /api/ats/check` – check resume against job description  
  **Body**: `multipart/form-data`
  - `resume`: PDF or DOCX file
  - `jobDescription`: text

## 💡 Usage (frontend flows)

### Creating and managing resumes

1. Go to `/` (Home).
2. Click **Start Building** to create a new resume.
3. Use the left panel tabs to fill in all sections.
4. Switch templates in the preview panel to see different layouts.
5. Use **Download Resume** in the editor header to export a PDF.
6. Use **My Resumes** on the home page to open or delete existing resumes.

### Running an ATS check

1. Navigate to `/ats-checker` (or click **ATS** in the header).
2. Paste the job description.
3. Upload your resume file.
4. Click **Check ATS Score**.
5. Use the missing keywords list to update your resume in the builder.

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

## 🐛 Troubleshooting (quick)

- **MongoDB connection**: check `MONGO_URI`, IP whitelist (Atlas), or that local Mongo is running.
- **File upload**: ensure `Server/uploads/` exists and accepts writes; only PDF/DOC/DOCX are supported.
- **CORS**: server uses `cors()` globally; if you change ports or origins, update CORS config accordingly.

## 📝 Notes

- Keep your MongoDB connection string in `.env` and out of version control.
- Client and server run independently; make sure both are running in development.
