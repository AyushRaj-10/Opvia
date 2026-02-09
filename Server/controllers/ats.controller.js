import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// Common stop words to filter out
const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
  "has", "he", "in", "is", "it", "its", "of", "on", "that", "the",
  "to", "was", "will", "with", "be", "been", "have", "had", "do",
  "does", "did", "but", "if", "or", "because", "as", "until", "while",
  "this", "these", "those", "then", "than", "so", "can", "could",
  "should", "would", "may", "might", "must", "shall", "am", "we",
  "you", "your", "their", "our", "me", "my", "i"
]);

export const atsCheck = async (req, res) => {
  try {
    if (!req.file || !req.body.jobDescription) {
      return res.status(400).json({ message: "Resume and JD required" });
    }

    const buffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(buffer);

    const resumeText = data.text.toLowerCase();
    const jdText = req.body.jobDescription.toLowerCase();

    // Extract meaningful keywords (filter out stop words and short words)
    const extractKeywords = (text) => {
      return text
        .split(/\W+/)
        .filter(word => 
          word.length > 2 && 
          !STOP_WORDS.has(word) &&
          /[a-z]/.test(word) // Contains at least one letter
        );
    };

    const resumeWords = new Set(extractKeywords(resumeText));
    const jdKeywords = extractKeywords(jdText);
    
    // Count keyword frequency in JD to identify important terms
    const jdWordFreq = {};
    jdKeywords.forEach(word => {
      jdWordFreq[word] = (jdWordFreq[word] || 0) + 1;
    });

    // Get unique JD keywords sorted by frequency
    const uniqueJdWords = Object.keys(jdWordFreq).sort(
      (a, b) => jdWordFreq[b] - jdWordFreq[a]
    );

    const matchedKeywords = [];
    const missingKeywords = [];

    uniqueJdWords.forEach(word => {
      if (resumeWords.has(word)) {
        matchedKeywords.push(word);
      } else {
        missingKeywords.push(word);
      }
    });

    // Calculate score based on unique keywords
    const totalKeywords = uniqueJdWords.length;
    const matchedCount = matchedKeywords.length;
    const score = totalKeywords > 0 
      ? Math.round((matchedCount / totalKeywords) * 100)
      : 0;

    // Limit the number of keywords returned (top 20 of each)
    const topMatchedKeywords = matchedKeywords.slice(0, 20);
    const topMissingKeywords = missingKeywords.slice(0, 20);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ 
      atsScore: score,
      matchedKeywords: topMatchedKeywords,
      missingKeywords: topMissingKeywords,
      totalKeywords: totalKeywords,
      matchedCount: matchedCount
    });

  } catch (err) {
    console.error("ATS Check Error:", err);
    
    // Clean up file if it exists
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error("File cleanup error:", unlinkErr);
      }
    }
    
    res.status(500).json({ message: "ATS check failed" });
  }
};