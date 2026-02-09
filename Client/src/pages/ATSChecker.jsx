import { useState } from "react";
import axios from "axios";

const ATSChecker = () => {
  const [jd, setJd] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      const res = await axios.post(
        "http://localhost:3000/api/ats/check",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

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

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-teal-700 mb-2">
        ATS Resume Checker
      </h2>
      <p className="text-gray-600 mb-6">
        Check how well your resume matches the job description
      </p>

      {/* Job Description */}
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">
          Job Description *
        </label>
        <textarea
          rows="8"
          className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition"
          placeholder="Paste the job description here..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
        <p className="text-sm text-gray-500 mt-1">
          {jd.trim().split(/\s+/).filter(Boolean).length} words
        </p>
      </div>

      {/* Resume Upload */}
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">
          Upload Resume (PDF / DOCX) *
        </label>
        <div className="relative">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-teal-50 file:text-teal-700
              hover:file:bg-teal-100 file:cursor-pointer
              cursor-pointer"
          />
        </div>
        {fileName && (
          <p className="text-sm text-teal-600 mt-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {fileName}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={checkATS}
          disabled={loading}
          className="flex-1 py-3 rounded-lg text-white font-semibold bg-teal-600 hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking ATS...
            </span>
          ) : (
            "Check ATS Score"
          )}
        </button>
        {result && (
          <button
            onClick={resetForm}
            className="px-6 py-3 rounded-lg text-teal-700 font-semibold bg-teal-50 hover:bg-teal-100 transition"
          >
            Reset
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {/* Score Card */}
          <div className={`p-6 border-2 rounded-xl ${getScoreBgColor(result.atsScore)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  ATS Compatibility Score
                </h3>
                <p className="text-sm text-gray-600">
                  Matched {result.matchedCount} out of {result.totalKeywords} keywords
                </p>
              </div>
              <div className="text-right">
                <p className={`text-5xl font-bold ${getScoreColor(result.atsScore)}`}>
                  {result.atsScore}%
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  result.atsScore >= 80 ? 'bg-green-500' :
                  result.atsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.atsScore}%` }}
              />
            </div>
          </div>

          {/* Matched Keywords */}
          {result.matchedKeywords?.length > 0 && (
            <div className="p-5 border-2 border-green-200 rounded-xl bg-green-50">
              <h4 className="font-bold text-green-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Matched Keywords ({result.matchedKeywords.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.matchedKeywords.map((kw, idx) => (
                  <span
                    key={`matched-${idx}`}
                    className="px-3 py-1.5 text-sm font-medium rounded-full bg-green-100 text-green-800 border border-green-300"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {result.missingKeywords?.length > 0 && (
            <div className="p-5 border-2 border-red-200 rounded-xl bg-red-50">
              <h4 className="font-bold text-red-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Missing Keywords ({result.missingKeywords.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((kw, idx) => (
                  <span
                    key={`missing-${idx}`}
                    className="px-3 py-1.5 text-sm font-medium rounded-full bg-red-100 text-red-800 border border-red-300"
                  >
                    {kw}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm text-red-700">
                💡 Tip: Consider adding these keywords to your resume where relevant to improve your ATS score.
              </p>
            </div>
          )}

          {/* Recommendations */}
          <div className="p-5 border-2 border-blue-200 rounded-xl bg-blue-50">
            <h4 className="font-bold text-blue-800 mb-2">Recommendations</h4>
            <ul className="space-y-2 text-sm text-blue-900">
              {result.atsScore >= 80 && (
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Excellent match! Your resume aligns well with the job description.</span>
                </li>
              )}
              {result.atsScore >= 60 && result.atsScore < 80 && (
                <>
                  <li className="flex items-start">
                    <span className="mr-2">⚠️</span>
                    <span>Good match, but there's room for improvement. Try incorporating more missing keywords.</span>
                  </li>
                </>
              )}
              {result.atsScore < 60 && (
                <>
                  <li className="flex items-start">
                    <span className="mr-2">❌</span>
                    <span>Low match. Consider revising your resume to better align with the job requirements.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">📝</span>
                    <span>Focus on adding the missing keywords in your experience and skills sections.</span>
                  </li>
                </>
              )}
              <li className="flex items-start">
                <span className="mr-2">🎯</span>
                <span>Use exact phrases from the job description when describing your experience.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSChecker;