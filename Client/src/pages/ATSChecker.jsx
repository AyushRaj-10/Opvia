import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Runtime styles matching HomePage design system
const atsStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  :root {
    --t50:  #F0FDFA; --t100: #CCFBF1; --t300: #5EEAD4;
    --t400: #2DD4BF; --t600: #0f766e; --t700: #0D9488;
    --t800: #134E4A; --t900: #0d3d38;
  }

  .font-syne { font-family: 'Syne', sans-serif !important; }
  .font-dm   { font-family: 'DM Sans', sans-serif !important; }

  .grad-text {
    background: linear-gradient(135deg, var(--t700) 0%, var(--t400) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .glass {
    background: rgba(255,255,255,0.76);
    backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
    border: 1px solid rgba(45,212,191,0.22);
  }

  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  .btn-shimmer {
    background: linear-gradient(90deg, var(--t700) 25%, var(--t400) 50%, var(--t700) 75%);
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
    color: #fff; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600;
  }
  .btn-shimmer:disabled { opacity: 0.5; cursor: not-allowed; animation: none; }

  .ats-input {
    width: 100%; padding: 14px 18px; border-radius: 14px;
    border: 2px solid var(--t300); background: var(--t50);
    color: var(--t800); font-family: 'DM Sans', sans-serif; font-size: 14px;
    outline: none; transition: all 0.2s;
  }
  .ats-input::placeholder { color: var(--t400); opacity: 0.75; }
  .ats-input:focus { border-color: var(--t700); box-shadow: 0 0 0 4px rgba(13,148,136,0.13); }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(45,212,191,0.4); }
    50% { box-shadow: 0 0 40px rgba(45,212,191,0.7); }
  }

  .score-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }
`;

const ATSChecker = () => {
  const [jd, setJd] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    }
  };

  const checkATS = async () => {
    if (!file || !jd.trim()) {
      setError("Please upload your resume and paste job description.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jd);

      const res = await axios.post(`${url}/api/ats/check`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setResult(res.data);
    } catch (err) {
      console.error("ATS Check Error:", err);
      setError(
        err.response?.data?.message || 
        "ATS check failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setJd("");
    setFile(null);
    setFileName("");
    setResult(null);
    setError("");
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "linear-gradient(135deg, #10b981, #059669)";
    if (score >= 60) return "linear-gradient(135deg, #f59e0b, #d97706)";
    return "linear-gradient(135deg, #ef4444, #dc2626)";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Needs Improvement";
  };

  const wordCount = jd.trim().split(/\s+/).filter(Boolean).length;

  return (
    <>
      <style>{atsStyles}</style>
      <div className="min-h-screen" style={{ background: "linear-gradient(135deg, var(--t50) 0%, #e2f8f5 50%, var(--t50) 100%)" }}>
        
        {/* Header */}
        <motion.header
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="sticky top-0 z-50"
          style={{ background: "linear-gradient(90deg, var(--t900), var(--t800))", boxShadow: "0 2px 20px rgba(13,148,136,0.28)" }}
        >
          <div className="max-w-7xl mx-auto px-7 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--t400), var(--t700))" }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="font-syne text-white font-bold text-xl tracking-tight">
                ATS Checker
                <span className="ml-2 font-dm text-xs font-medium tracking-widest uppercase" style={{ color: "var(--t400)" }}>
                  BY OPVIA
                </span>
              </span>
            </div>
            <a href="/" className="font-dm font-medium text-sm px-6 py-2.5 rounded-xl transition-all"
              style={{ background: "rgba(45,212,191,0.15)", color: "var(--t400)", border: "1.5px solid rgba(45,212,191,0.3)" }}>
              ← Back to Dashboard
            </a>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-12">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-dm font-medium text-xs mb-6"
              style={{ background: "rgba(45,212,191,0.14)", border: "1px solid rgba(45,212,191,0.35)", color: "var(--t800)" }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--t700)" }} />
              Free ATS Compatibility Checker
            </motion.div>
            
            <h1 className="font-syne font-extrabold leading-none tracking-tight mb-4"
              style={{ fontSize: "clamp(32px, 4vw, 52px)", color: "var(--t800)" }}>
              Beat the <span className="grad-text">ATS System</span>
            </h1>
            
            <p className="font-dm text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: "var(--t800)", opacity: 0.72 }}>
              Discover how well your resume matches the job description. Get instant feedback and improve your chances of landing interviews.
            </p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-3xl p-8 md:p-10"
            style={{ boxShadow: "0 8px 40px rgba(13,148,136,0.15)" }}
          >
            
            {!result ? (
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Left Column - Job Description */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "var(--t50)", border: "2px solid var(--t400)" }}>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--t700)" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-syne font-bold text-lg" style={{ color: "var(--t800)" }}>
                        Job Description
                      </h3>
                      <p className="font-dm text-xs" style={{ color: "var(--t700)", opacity: 0.7 }}>
                        Paste the full job posting
                      </p>
                    </div>
                  </div>

                  <textarea
                    rows="12"
                    className="ats-input resize-none"
                    placeholder="Paste the complete job description here. Include requirements, qualifications, and responsibilities..."
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                  />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-dm" style={{ color: "var(--t700)", opacity: 0.7 }}>
                      {wordCount} words
                    </span>
                    {wordCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="font-dm font-medium px-3 py-1 rounded-full"
                        style={{ background: "rgba(45,212,191,0.15)", color: "var(--t700)", fontSize: "12px" }}
                      >
                        ✓ Ready
                      </motion.span>
                    )}
                  </div>
                </div>

                {/* Right Column - Resume Upload */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "var(--t50)", border: "2px solid var(--t400)" }}>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--t700)" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-syne font-bold text-lg" style={{ color: "var(--t800)" }}>
                        Your Resume
                      </h3>
                      <p className="font-dm text-xs" style={{ color: "var(--t700)", opacity: 0.7 }}>
                        Upload PDF or DOCX file
                      </p>
                    </div>
                  </div>

                  <motion.label
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="relative flex flex-col items-center justify-center p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all"
                    style={{ 
                      borderColor: fileName ? "var(--t700)" : "var(--t300)",
                      background: fileName ? "rgba(45,212,191,0.08)" : "var(--t50)"
                    }}
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {fileName ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-center"
                      >
                        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, var(--t700), var(--t400))" }}>
                          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="font-syne font-bold text-base mb-1" style={{ color: "var(--t800)" }}>
                          {fileName}
                        </p>
                        <p className="font-dm text-xs" style={{ color: "var(--t700)", opacity: 0.7 }}>
                          Click to change file
                        </p>
                      </motion.div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                          style={{ background: "rgba(45,212,191,0.12)", border: "2px solid rgba(45,212,191,0.3)" }}>
                          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="var(--t700)" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <p className="font-syne font-bold text-base mb-1" style={{ color: "var(--t800)" }}>
                          Drop your resume here
                        </p>
                        <p className="font-dm text-sm" style={{ color: "var(--t700)", opacity: 0.7 }}>
                          or click to browse
                        </p>
                        <p className="font-dm text-xs mt-2" style={{ color: "var(--t700)", opacity: 0.5 }}>
                          Supports PDF, DOC, DOCX
                        </p>
                      </div>
                    )}
                  </motion.label>

                  <div className="p-4 rounded-xl" style={{ background: "rgba(45,212,191,0.08)", border: "1.5px solid rgba(45,212,191,0.25)" }}>
                    <div className="flex gap-2 text-xs font-dm" style={{ color: "var(--t800)" }}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--t700)" strokeWidth={2} className="flex-shrink-0 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span style={{ opacity: 0.8 }}>
                        Your files are analyzed locally and never stored on our servers.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Results View */
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Score Hero Card */}
                  <div className="relative overflow-hidden rounded-3xl p-8"
                    style={{ background: getScoreBg(result.atsScore), boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                    
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
                      style={{ background: "radial-gradient(circle, #fff, transparent)" }} />
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <p className="font-dm text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.8)" }}>
                          ATS Compatibility Score
                        </p>
                        <h2 className="font-syne font-extrabold text-6xl mb-3" style={{ color: "#fff" }}>
                          {result.atsScore}%
                        </h2>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                          style={{ background: "rgba(255,255,255,0.25)" }}>
                          <span className="w-2 h-2 rounded-full" style={{ background: "#fff" }} />
                          <span className="font-dm font-semibold text-sm" style={{ color: "#fff" }}>
                            {getScoreLabel(result.atsScore)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="w-32 h-32 rounded-full flex items-center justify-center score-glow"
                          style={{ background: "rgba(255,255,255,0.2)", border: "4px solid rgba(255,255,255,0.4)" }}>
                          <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
                            {result.atsScore >= 80 ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : result.atsScore >= 60 ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative z-10 mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-dm text-xs font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                          Keyword Match Rate
                        </span>
                        <span className="font-dm text-xs font-bold" style={{ color: "#fff" }}>
                          {result.matchedCount} / {result.totalKeywords}
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.25)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.atsScore}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: "#fff" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Matched Keywords */}
                  {result.matchedKeywords?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-6 rounded-2xl"
                      style={{ background: "rgba(16,185,129,0.08)", border: "2px solid rgba(16,185,129,0.25)" }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: "rgba(16,185,129,0.15)" }}>
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-syne font-bold text-lg" style={{ color: "#059669" }}>
                            Matched Keywords
                          </h4>
                          <p className="font-dm text-xs" style={{ color: "#059669", opacity: 0.7 }}>
                            {result.matchedKeywords.length} keywords found in your resume
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.matchedKeywords.map((kw, idx) => (
                          <motion.span
                            key={`matched-${idx}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.03 }}
                            className="px-4 py-2 text-sm font-dm font-medium rounded-xl"
                            style={{ background: "rgba(16,185,129,0.15)", color: "#059669", border: "1.5px solid rgba(16,185,129,0.3)" }}
                          >
                            {kw}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Missing Keywords */}
                  {result.missingKeywords?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-6 rounded-2xl"
                      style={{ background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.25)" }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: "rgba(239,68,68,0.15)" }}>
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-syne font-bold text-lg" style={{ color: "#dc2626" }}>
                            Missing Keywords
                          </h4>
                          <p className="font-dm text-xs" style={{ color: "#dc2626", opacity: 0.7 }}>
                            {result.missingKeywords.length} keywords to consider adding
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {result.missingKeywords.map((kw, idx) => (
                          <motion.span
                            key={`missing-${idx}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.03 }}
                            className="px-4 py-2 text-sm font-dm font-medium rounded-xl"
                            style={{ background: "rgba(239,68,68,0.15)", color: "#dc2626", border: "1.5px solid rgba(239,68,68,0.3)" }}
                          >
                            {kw}
                          </motion.span>
                        ))}
                      </div>
                      <div className="p-4 rounded-xl" style={{ background: "rgba(239,68,68,0.08)" }}>
                        <div className="flex gap-2 text-sm font-dm" style={{ color: "#dc2626" }}>
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="flex-shrink-0 mt-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span style={{ opacity: 0.9 }}>
                            <strong>Pro Tip:</strong> Incorporate these keywords naturally into your experience and skills sections to improve your ATS score.
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Recommendations */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 rounded-2xl"
                    style={{ background: "rgba(59,130,246,0.08)", border: "2px solid rgba(59,130,246,0.25)" }}
                  >
                    <h4 className="font-syne font-bold text-lg mb-4" style={{ color: "#2563eb" }}>
                      💡 Recommendations
                    </h4>
                    <ul className="space-y-3">
                      {result.atsScore >= 80 && (
                        <li className="flex gap-3 font-dm text-sm" style={{ color: "#1e40af" }}>
                          <span className="text-lg flex-shrink-0">✅</span>
                          <span>Excellent match! Your resume aligns well with the job description. You're in great shape for ATS screening.</span>
                        </li>
                      )}
                      {result.atsScore >= 60 && result.atsScore < 80 && (
                        <>
                          <li className="flex gap-3 font-dm text-sm" style={{ color: "#1e40af" }}>
                            <span className="text-lg flex-shrink-0">⚠️</span>
                            <span>Good match with room for improvement. Focus on incorporating the missing keywords where relevant.</span>
                          </li>
                          <li className="flex gap-3 font-dm text-sm" style={{ color: "#1e40af" }}>
                            <span className="text-lg flex-shrink-0">📝</span>
                            <span>Review the missing keywords and add them to your skills or experience sections if they match your background.</span>
                          </li>
                        </>
                      )}
                      {result.atsScore < 60 && (
                        <>
                          <li className="flex gap-3 font-dm text-sm" style={{ color: "#1e40af" }}>
                            <span className="text-lg flex-shrink-0">❌</span>
                            <span>Your resume needs significant optimization. Consider restructuring to better align with job requirements.</span>
                          </li>
                          <li className="flex gap-3 font-dm text-sm" style={{ color: "#1e40af" }}>
                            <span className="text-lg flex-shrink-0">📝</span>
                            <span>Prioritize adding missing keywords in your experience and skills sections. Use exact phrases from the job description.</span>
                          </li>
                          <li className="flex gap-3 font-dm text-sm" style={{ color: "#1e40af" }}>
                            <span className="text-lg flex-shrink-0">🔄</span>
                            <span>Consider tailoring your resume specifically for this position to improve your match rate.</span>
                          </li>
                        </>
                      )}
                      <li className="flex gap-3 font-dm text-sm" style={{ color: "#1e40af" }}>
                        <span className="text-lg flex-shrink-0">🎯</span>
                        <span>Use exact terminology from the job posting when describing your experience and achievements.</span>
                      </li>
                      <li className="flex gap-3 font-dm text-sm" style={{ color: "#1e40af" }}>
                        <span className="text-lg flex-shrink-0">📊</span>
                        <span>Quantify your achievements with metrics and numbers to make your resume more compelling.</span>
                      </li>
                    </ul>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 p-4 rounded-xl flex items-start gap-3"
                  style={{ background: "rgba(239,68,68,0.1)", border: "2px solid rgba(239,68,68,0.3)" }}
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={2} className="flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-dm font-medium text-sm" style={{ color: "#dc2626" }}>
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              {!result ? (
                <motion.button
                  whileHover={!loading ? { scale: 1.02, boxShadow: "0 8px 28px rgba(13,148,136,0.38)" } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                  onClick={checkATS}
                  disabled={loading}
                  className="btn-shimmer rounded-xl px-8 py-4 font-syne font-bold text-base w-full"
                  style={{ boxShadow: "0 4px 20px rgba(13,148,136,0.25)" }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing Resume...
                    </span>
                  ) : (
                    "Check ATS Compatibility →"
                  )}
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(13,148,136,0.38)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={resetForm}
                    className="btn-shimmer rounded-xl px-8 py-4 font-syne font-bold text-base flex-1"
                    style={{ boxShadow: "0 4px 20px rgba(13,148,136,0.25)" }}
                  >
                    ← Check Another Resume
                  </motion.button>
                  <motion.a
                    href="/"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-4 rounded-xl font-syne font-semibold text-base flex items-center justify-center"
                    style={{ background: "rgba(45,212,191,0.12)", color: "var(--t700)", border: "2px solid rgba(45,212,191,0.3)" }}
                  >
                    Build Optimized Resume
                  </motion.a>
                </>
              )}
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: "⚡",
                title: "Instant Analysis",
                desc: "Get your ATS score in seconds with detailed keyword breakdown"
              },
              {
                icon: "🎯",
                title: "Actionable Insights",
                desc: "Receive specific recommendations to improve your match rate"
              },
              {
                icon: "🔒",
                title: "100% Private",
                desc: "Your resume is analyzed locally and never stored on our servers"
              }
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-6"
                style={{ boxShadow: "0 4px 24px rgba(13,148,136,0.08)" }}
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-syne font-bold text-base mb-2" style={{ color: "var(--t800)" }}>
                  {feature.title}
                </h3>
                <p className="font-dm text-sm" style={{ color: "var(--t800)", opacity: 0.7 }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default ATSChecker;