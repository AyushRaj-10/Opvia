import React, { useState } from 'react';

// 5 Different Resume Templates
export const RESUME_TEMPLATES = {
  modern: {
    name: 'Modern Teal',
    preview: (data) => (
      <div className="space-y-6 rounded-xl p-6" style={{ backgroundColor: '#F0FDFA' }}>
        {data.personalInfo.name && (
          <div className="border-b-2 pb-4" style={{ borderColor: '#2DD4BF' }}>
            <h3 className="text-2xl font-bold" style={{ color: '#134E4A' }}>{data.personalInfo.name}</h3>
            {data.personalInfo.email && <p className="text-sm" style={{ color: '#0D9488' }}>{data.personalInfo.email}</p>}
            {data.personalInfo.phone && <p className="text-sm" style={{ color: '#0D9488' }}>{data.personalInfo.phone}</p>}
            {data.personalInfo.linkedIn && <p className="text-sm" style={{ color: '#0D9488' }}>LinkedIn: {data.personalInfo.linkedIn}</p>}
            {data.personalInfo.portfolio && <p className="text-sm" style={{ color: '#0D9488' }}>Portfolio: {data.personalInfo.portfolio}</p>}
          </div>
        )}

        {data.summary && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: '#134E4A' }}>Professional Summary</h3>
            <p className="text-sm" style={{ color: '#134E4A' }}>{data.summary}</p>
          </div>
        )}

        {data.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: '#134E4A' }}>Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: '#2DD4BF', color: '#134E4A' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.experiences.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: '#134E4A' }}>Experience</h3>
            <div className="space-y-4">
              {data.experiences.map((exp, index) => (
                <div key={exp._id || index} className="border-l-2 pl-4" style={{ borderColor: '#2DD4BF' }}>
                  <h4 className="font-bold" style={{ color: '#134E4A' }}>{exp.role}</h4>
                  <p className="text-sm font-medium" style={{ color: '#0D9488' }}>{exp.company}</p>
                  <p className="text-xs mb-2" style={{ color: '#0D9488' }}>{exp.duration}</p>
                  <p className="text-sm" style={{ color: '#134E4A' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.educations.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: '#134E4A' }}>Education</h3>
            <div className="space-y-3">
              {data.educations.map((edu, index) => (
                <div key={edu._id || index} className="border-l-2 pl-4" style={{ borderColor: '#2DD4BF' }}>
                  <h4 className="font-bold" style={{ color: '#134E4A' }}>{edu.degree}</h4>
                  <p className="text-sm font-medium" style={{ color: '#0D9488' }}>{edu.institution}</p>
                  <p className="text-xs" style={{ color: '#0D9488' }}>{edu.duration}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: '#134E4A' }}>Projects</h3>
            <div className="space-y-4">
              {data.projects.map((proj, index) => (
                <div key={proj._id || index} className="border-l-2 pl-4" style={{ borderColor: '#2DD4BF' }}>
                  <h4 className="font-bold" style={{ color: '#134E4A' }}>{proj.title}</h4>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm underline block" style={{ color: '#0D9488' }}>
                      {proj.link}
                    </a>
                  )}
                  <p className="text-sm mt-1" style={{ color: '#134E4A' }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  },

  professional: {
    name: 'Professional Blue',
    preview: (data) => (
      <div className="space-y-6 rounded-xl p-6" style={{ backgroundColor: '#EFF6FF' }}>
        {data.personalInfo.name && (
          <div className="text-center border-b-2 pb-4" style={{ borderColor: '#3B82F6' }}>
            <h3 className="text-3xl font-bold" style={{ color: '#1E3A8A' }}>{data.personalInfo.name}</h3>
            <div className="flex justify-center gap-4 mt-2 text-sm" style={{ color: '#1E40AF' }}>
              {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
            </div>
            {data.personalInfo.linkedIn && <p className="text-sm mt-1" style={{ color: '#1E40AF' }}>{data.personalInfo.linkedIn}</p>}
          </div>
        )}

        {data.summary && (
          <div>
            <h3 className="text-lg font-bold mb-2 pb-1 border-b" style={{ color: '#1E3A8A', borderColor: '#3B82F6' }}>SUMMARY</h3>
            <p className="text-sm" style={{ color: '#1E3A8A' }}>{data.summary}</p>
          </div>
        )}

        {data.experiences.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-3 pb-1 border-b" style={{ color: '#1E3A8A', borderColor: '#3B82F6' }}>EXPERIENCE</h3>
            <div className="space-y-4">
              {data.experiences.map((exp, index) => (
                <div key={exp._id || index}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold" style={{ color: '#1E3A8A' }}>{exp.role}</h4>
                    <span className="text-xs" style={{ color: '#1E40AF' }}>{exp.duration}</span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#1E40AF' }}>{exp.company}</p>
                  <p className="text-sm mt-1" style={{ color: '#1E3A8A' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.educations.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-3 pb-1 border-b" style={{ color: '#1E3A8A', borderColor: '#3B82F6' }}>EDUCATION</h3>
            <div className="space-y-3">
              {data.educations.map((edu, index) => (
                <div key={edu._id || index}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold" style={{ color: '#1E3A8A' }}>{edu.degree}</h4>
                    <span className="text-xs" style={{ color: '#1E40AF' }}>{edu.duration}</span>
                  </div>
                  <p className="text-sm" style={{ color: '#1E40AF' }}>{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.skills.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-2 pb-1 border-b" style={{ color: '#1E3A8A', borderColor: '#3B82F6' }}>SKILLS</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 rounded text-sm font-medium" style={{ backgroundColor: '#3B82F6', color: 'white' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-3 pb-1 border-b" style={{ color: '#1E3A8A', borderColor: '#3B82F6' }}>PROJECTS</h3>
            <div className="space-y-3">
              {data.projects.map((proj, index) => (
                <div key={proj._id || index}>
                  <h4 className="font-bold" style={{ color: '#1E3A8A' }}>{proj.title}</h4>
                  {proj.link && <a href={proj.link} className="text-xs underline" style={{ color: '#1E40AF' }}>{proj.link}</a>}
                  <p className="text-sm mt-1" style={{ color: '#1E3A8A' }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  },

  minimal: {
    name: 'Minimal Black',
    preview: (data) => (
      <div className="space-y-6 rounded-xl p-6" style={{ backgroundColor: '#FFFFFF' }}>
        {data.personalInfo.name && (
          <div>
            <h3 className="text-4xl font-light tracking-tight" style={{ color: '#000000' }}>{data.personalInfo.name}</h3>
            <div className="mt-2 text-sm space-y-1" style={{ color: '#4B5563' }}>
              {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
              {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
              {data.personalInfo.linkedIn && <p>{data.personalInfo.linkedIn}</p>}
            </div>
            <div className="w-16 h-0.5 mt-3" style={{ backgroundColor: '#000000' }}></div>
          </div>
        )}

        {data.summary && (
          <div>
            <p className="text-sm leading-relaxed" style={{ color: '#1F2937' }}>{data.summary}</p>
          </div>
        )}

        {data.experiences.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#000000' }}>Experience</h3>
            <div className="space-y-4">
              {data.experiences.map((exp, index) => (
                <div key={exp._id || index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-semibold" style={{ color: '#000000' }}>{exp.role}</h4>
                    <span className="text-xs" style={{ color: '#6B7280' }}>{exp.duration}</span>
                  </div>
                  <p className="text-sm italic mb-1" style={{ color: '#4B5563' }}>{exp.company}</p>
                  <p className="text-sm" style={{ color: '#1F2937' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.educations.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#000000' }}>Education</h3>
            <div className="space-y-3">
              {data.educations.map((edu, index) => (
                <div key={edu._id || index}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-semibold" style={{ color: '#000000' }}>{edu.degree}</h4>
                    <span className="text-xs" style={{ color: '#6B7280' }}>{edu.duration}</span>
                  </div>
                  <p className="text-sm" style={{ color: '#4B5563' }}>{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.skills.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#000000' }}>Skills</h3>
            <p className="text-sm" style={{ color: '#1F2937' }}>{data.skills.join(' • ')}</p>
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#000000' }}>Projects</h3>
            <div className="space-y-3">
              {data.projects.map((proj, index) => (
                <div key={proj._id || index}>
                  <h4 className="font-semibold" style={{ color: '#000000' }}>{proj.title}</h4>
                  {proj.link && <p className="text-xs" style={{ color: '#6B7280' }}>{proj.link}</p>}
                  <p className="text-sm mt-1" style={{ color: '#1F2937' }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  },

  creative: {
    name: 'Creative Purple',
    preview: (data) => (
      <div className="space-y-6 rounded-xl p-6" style={{ backgroundColor: '#FAF5FF' }}>
        {data.personalInfo.name && (
          <div className="relative">
            <div className="absolute left-0 top-0 w-1 h-full rounded" style={{ backgroundColor: '#A855F7' }}></div>
            <div className="pl-6">
              <h3 className="text-3xl font-bold" style={{ color: '#581C87' }}>{data.personalInfo.name}</h3>
              <div className="mt-2 space-y-1 text-sm" style={{ color: '#6B21A8' }}>
                {data.personalInfo.email && <p>✉ {data.personalInfo.email}</p>}
                {data.personalInfo.phone && <p>📱 {data.personalInfo.phone}</p>}
                {data.personalInfo.linkedIn && <p>🔗 {data.personalInfo.linkedIn}</p>}
              </div>
            </div>
          </div>
        )}

        {data.summary && (
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F3E8FF' }}>
            <h3 className="text-sm font-bold uppercase mb-2" style={{ color: '#581C87' }}>About Me</h3>
            <p className="text-sm" style={{ color: '#581C87' }}>{data.summary}</p>
          </div>
        )}

        {data.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase mb-3 flex items-center gap-2" style={{ color: '#581C87' }}>
              <span className="w-8 h-0.5" style={{ backgroundColor: '#A855F7' }}></span>
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="px-4 py-1.5 rounded-full text-sm font-medium" style={{ backgroundColor: '#A855F7', color: 'white' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.experiences.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase mb-3 flex items-center gap-2" style={{ color: '#581C87' }}>
              <span className="w-8 h-0.5" style={{ backgroundColor: '#A855F7' }}></span>
              Experience
            </h3>
            <div className="space-y-4">
              {data.experiences.map((exp, index) => (
                <div key={exp._id || index} className="pl-4 border-l-2" style={{ borderColor: '#E9D5FF' }}>
                  <h4 className="font-bold text-base" style={{ color: '#581C87' }}>{exp.role}</h4>
                  <p className="text-sm font-semibold" style={{ color: '#6B21A8' }}>{exp.company}</p>
                  <p className="text-xs mb-2" style={{ color: '#A855F7' }}>{exp.duration}</p>
                  <p className="text-sm" style={{ color: '#581C87' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.educations.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase mb-3 flex items-center gap-2" style={{ color: '#581C87' }}>
              <span className="w-8 h-0.5" style={{ backgroundColor: '#A855F7' }}></span>
              Education
            </h3>
            <div className="space-y-3">
              {data.educations.map((edu, index) => (
                <div key={edu._id || index} className="pl-4 border-l-2" style={{ borderColor: '#E9D5FF' }}>
                  <h4 className="font-bold" style={{ color: '#581C87' }}>{edu.degree}</h4>
                  <p className="text-sm" style={{ color: '#6B21A8' }}>{edu.institution}</p>
                  <p className="text-xs" style={{ color: '#A855F7' }}>{edu.duration}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase mb-3 flex items-center gap-2" style={{ color: '#581C87' }}>
              <span className="w-8 h-0.5" style={{ backgroundColor: '#A855F7' }}></span>
              Projects
            </h3>
            <div className="space-y-3">
              {data.projects.map((proj, index) => (
                <div key={proj._id || index} className="pl-4 border-l-2" style={{ borderColor: '#E9D5FF' }}>
                  <h4 className="font-bold" style={{ color: '#581C87' }}>{proj.title}</h4>
                  {proj.link && <a href={proj.link} className="text-sm underline" style={{ color: '#A855F7' }}>{proj.link}</a>}
                  <p className="text-sm mt-1" style={{ color: '#581C87' }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  },

  executive: {
    name: 'Executive Navy',
    preview: (data) => (
      <div className="space-y-5 rounded-xl p-6" style={{ backgroundColor: '#F0F9FF' }}>
        {data.personalInfo.name && (
          <div className="text-center pb-4" style={{ borderBottom: '3px solid #0284C7' }}>
            <h3 className="text-3xl font-bold tracking-wide" style={{ color: '#0C4A6E' }}>{data.personalInfo.name}</h3>
            <div className="flex justify-center gap-3 mt-2 text-xs" style={{ color: '#075985' }}>
              {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>|</span>}
              {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
              {data.personalInfo.linkedIn && <span>|</span>}
              {data.personalInfo.linkedIn && <span>{data.personalInfo.linkedIn}</span>}
            </div>
          </div>
        )}

        {data.summary && (
          <div className="p-4 rounded" style={{ backgroundColor: '#E0F2FE', borderLeft: '4px solid #0284C7' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#0C4A6E' }}>Executive Summary</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#0C4A6E' }}>{data.summary}</p>
          </div>
        )}

        {data.experiences.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 pb-2" style={{ color: '#0C4A6E', borderBottom: '2px solid #0284C7' }}>
              Professional Experience
            </h3>
            <div className="space-y-4">
              {data.experiences.map((exp, index) => (
                <div key={exp._id || index}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-bold text-base" style={{ color: '#0C4A6E' }}>{exp.role}</h4>
                      <p className="text-sm font-semibold" style={{ color: '#075985' }}>{exp.company}</p>
                    </div>
                    <span className="text-xs font-medium px-3 py-1 rounded" style={{ backgroundColor: '#0284C7', color: 'white' }}>
                      {exp.duration}
                    </span>
                  </div>
                  <p className="text-sm mt-2" style={{ color: '#0C4A6E' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.educations.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 pb-2" style={{ color: '#0C4A6E', borderBottom: '2px solid #0284C7' }}>
              Education
            </h3>
            <div className="space-y-3">
              {data.educations.map((edu, index) => (
                <div key={edu._id || index} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold" style={{ color: '#0C4A6E' }}>{edu.degree}</h4>
                    <p className="text-sm" style={{ color: '#075985' }}>{edu.institution}</p>
                  </div>
                  <span className="text-xs" style={{ color: '#075985' }}>{edu.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 pb-2" style={{ color: '#0C4A6E', borderBottom: '2px solid #0284C7' }}>
              Core Competencies
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {data.skills.map((skill, index) => (
                <div key={index} className="text-center py-2 px-3 rounded text-xs font-medium" style={{ backgroundColor: '#E0F2FE', color: '#0C4A6E' }}>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 pb-2" style={{ color: '#0C4A6E', borderBottom: '2px solid #0284C7' }}>
              Key Projects
            </h3>
            <div className="space-y-3">
              {data.projects.map((proj, index) => (
                <div key={proj._id || index}>
                  <h4 className="font-bold" style={{ color: '#0C4A6E' }}>{proj.title}</h4>
                  {proj.link && <p className="text-xs" style={{ color: '#075985' }}>{proj.link}</p>}
                  <p className="text-sm mt-1" style={{ color: '#0C4A6E' }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
};

const ResumeTemplateSelector = ({
  personalInfo = {},
  summary = '',
  skills = [],
  experiences = [],
  educations = [],
  projects = []
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const resumeData = {
    personalInfo,
    summary,
    skills,
    experiences,
    educations,
    projects
  };

  const currentTemplate = RESUME_TEMPLATES[selectedTemplate];

  return (
    <div className="space-y-4">
      {/* Template Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: '#134E4A' }}>
          Choose Your Resume Style
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(RESUME_TEMPLATES).map(([key, template]) => (
            <button
              key={key}
              onClick={() => setSelectedTemplate(key)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedTemplate === key 
                  ? 'ring-4 ring-offset-2 shadow-lg transform scale-105' 
                  : 'hover:shadow-md hover:scale-102'
              }`}
              style={{
                borderColor: selectedTemplate === key ? '#0D9488' : '#E5E7EB',
                ringColor: selectedTemplate === key ? '#2DD4BF' : 'transparent'
              }}
            >
              <div className="text-sm font-bold text-center" style={{ color: '#134E4A' }}>
                {template.name}
              </div>
              <div className="mt-2 h-20 rounded border-2 border-gray-200 flex items-center justify-center text-xs text-gray-400">
                Preview
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-2xl shadow-xl p-8 max-h-screen overflow-y-auto" id="resume-preview">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#134E4A' }}>
            {currentTemplate.name} Preview
          </h2>
        </div>
        
        {currentTemplate.preview(resumeData)}
      </div>
    </div>
  );
};

export default ResumeTemplateSelector;