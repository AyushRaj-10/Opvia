import React, { useState, useRef, useEffect } from 'react';

// 5 Different Resume Templates - VERTICAL PAGES VERSION
export const RESUME_TEMPLATES = {
  
 modern: {
  name: 'Modern Teal',
  preview: (data) => (
    <div className="space-y-6 p-8" style={{ backgroundColor: '#F0FDFA' }}>
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
        <div className="page-break-avoid">
          <h3 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: '#134E4A' }}>Professional Summary</h3>
          <p className="text-sm" style={{ color: '#134E4A' }}>{data.summary}</p>
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="page-break-avoid">
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
              <div key={exp._id || index} className="border-l-2 pl-4 page-break-avoid" style={{ borderColor: '#2DD4BF' }}>
                <h4 className="font-bold" style={{ color: '#134E4A' }}>{exp.role}</h4>
                <p className="text-sm font-medium" style={{ color: '#0D9488' }}>{exp.company}</p>
                <p className="text-xs mb-2" style={{ color: '#0D9488' }}>{exp.duration}</p>
                <div className="text-sm preview-description" style={{ color: '#134E4A' }} dangerouslySetInnerHTML={{ __html: exp.description }} />
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
              <div key={edu._id || index} className="border-l-2 pl-4 page-break-avoid" style={{ borderColor: '#2DD4BF' }}>
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
              <div key={proj._id || index} className="border-l-2 pl-4 page-break-avoid" style={{ borderColor: '#2DD4BF' }}>
                <h4 className="font-bold" style={{ color: '#134E4A' }}>{proj.title}</h4>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm underline block" style={{ color: '#0D9488' }}>
                    {proj.link}
                  </a>
                )}
                <div className="text-sm mt-1 preview-description" style={{ color: '#134E4A' }} dangerouslySetInnerHTML={{ __html: proj.description }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
},

minimal: {
  name: 'Minimal ATS',
  preview: (data) => (
    <div className="space-y-6 p-8" style={{ backgroundColor: '#FFFFFF' }}>
      {data.personalInfo.name && (
        <div>
          <h3 className="text-3xl font-bold tracking-tight" style={{ color: '#000000' }}>{data.personalInfo.name}</h3>
          <div className="mt-2 text-sm flex gap-3" style={{ color: '#4B5563' }}>
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>|</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.linkedIn && <span>|</span>}
            {data.personalInfo.linkedIn && <span>{data.personalInfo.linkedIn}</span>}
          </div>
          <div className="w-full h-0.5 mt-3" style={{ backgroundColor: '#E5E7EB' }}></div>
        </div>
      )}

      {data.summary && (
        <div className="page-break-avoid">
          <p className="text-sm leading-relaxed" style={{ color: '#1F2937' }}>{data.summary}</p>
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="page-break-avoid">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#000000' }}>Technical Skills</h3>
          <p className="text-sm" style={{ color: '#1F2937' }}>{data.skills.join(' • ')}</p>
        </div>
      )}

      {data.experiences.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#000000' }}>Experience</h3>
          <div className="space-y-4">
            {data.experiences.map((exp, index) => (
              <div key={exp._id || index} className="page-break-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-semibold" style={{ color: '#000000' }}>{exp.role}</h4>
                  <span className="text-xs" style={{ color: '#6B7280' }}>{exp.duration}</span>
                </div>
                <p className="text-sm mb-1" style={{ color: '#4B5563' }}>{exp.company}</p>
                <div className="text-sm preview-description" style={{ color: '#1F2937' }} dangerouslySetInnerHTML={{ __html: exp.description }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {data.projects.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#000000' }}>Projects</h3>
          <div className="space-y-3">
            {data.projects.map((proj, index) => (
              <div key={proj._id || index} className="page-break-avoid">
                <h4 className="font-semibold" style={{ color: '#000000' }}>{proj.title}</h4>
                {proj.link && <p className="text-xs" style={{ color: '#6B7280' }}>{proj.link}</p>}
                <div className="text-sm mt-1 preview-description" style={{ color: '#1F2937' }} dangerouslySetInnerHTML={{ __html: proj.description }} />
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
              <div key={edu._id || index} className="page-break-avoid">
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
    </div>
  )
},

professional: {
  name: 'Professional',
  preview: (data) => (
    <div className="space-y-6 p-8" style={{ backgroundColor: '#FFFFFF' }}>
      {data.personalInfo.name && (
        <div className="pb-4" style={{ borderBottom: '2px solid #1F2937' }}>
          <h3 className="text-3xl font-bold" style={{ color: '#111827' }}>{data.personalInfo.name}</h3>
          <div className="flex gap-4 mt-2 text-sm" style={{ color: '#4B5563' }}>
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
            {data.personalInfo.linkedIn && <span>• {data.personalInfo.linkedIn}</span>}
          </div>
        </div>
      )}

      {data.summary && (
        <div className="page-break-avoid">
          <h3 className="text-sm font-bold uppercase mb-2" style={{ color: '#111827' }}>Summary</h3>
          <p className="text-sm" style={{ color: '#374151' }}>{data.summary}</p>
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="page-break-avoid">
          <h3 className="text-sm font-bold uppercase mb-2" style={{ color: '#111827' }}>Technical Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 text-sm" style={{ backgroundColor: '#F3F4F6', color: '#1F2937' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.experiences.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase mb-3" style={{ color: '#111827' }}>Experience</h3>
          <div className="space-y-4">
            {data.experiences.map((exp, index) => (
              <div key={exp._id || index} className="page-break-avoid">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold" style={{ color: '#111827' }}>{exp.role}</h4>
                  <span className="text-xs" style={{ color: '#6B7280' }}>{exp.duration}</span>
                </div>
                <p className="text-sm font-medium" style={{ color: '#4B5563' }}>{exp.company}</p>
                <div className="text-sm mt-1 preview-description" style={{ color: '#374151' }} dangerouslySetInnerHTML={{ __html: exp.description }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {data.projects.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase mb-3" style={{ color: '#111827' }}>Projects</h3>
          <div className="space-y-3">
            {data.projects.map((proj, index) => (
              <div key={proj._id || index} className="page-break-avoid">
                <h4 className="font-bold" style={{ color: '#111827' }}>{proj.title}</h4>
                {proj.link && <a href={proj.link} className="text-xs underline" style={{ color: '#4B5563' }}>{proj.link}</a>}
                <div className="text-sm mt-1 preview-description" style={{ color: '#374151' }} dangerouslySetInnerHTML={{ __html: proj.description }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {data.educations.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase mb-3" style={{ color: '#111827' }}>Education</h3>
          <div className="space-y-3">
            {data.educations.map((edu, index) => (
              <div key={edu._id || index} className="page-break-avoid">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold" style={{ color: '#111827' }}>{edu.degree}</h4>
                  <span className="text-xs" style={{ color: '#6B7280' }}>{edu.duration}</span>
                </div>
                <p className="text-sm" style={{ color: '#4B5563' }}>{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
},

compact: {
  name: 'Compact Two-Column',
  preview: (data) => (
    <div className="p-6" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          {data.personalInfo.name && (
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#111827' }}>{data.personalInfo.name}</h3>
              <div className="mt-2 text-xs space-y-1" style={{ color: '#6B7280' }}>
                {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
                {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
                {data.personalInfo.linkedIn && <p>{data.personalInfo.linkedIn}</p>}
                {data.personalInfo.portfolio && <p>{data.personalInfo.portfolio}</p>}
              </div>
            </div>
          )}

          {data.skills.length > 0 && (
            <div className="page-break-avoid">
              <h3 className="text-xs font-bold uppercase mb-2 pb-1" style={{ color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Skills</h3>
              <div className="space-y-1">
                {data.skills.map((skill, index) => (
                  <div key={index} className="text-xs" style={{ color: '#374151' }}>• {skill}</div>
                ))}
              </div>
            </div>
          )}

          {data.educations.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase mb-2 pb-1" style={{ color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Education</h3>
              <div className="space-y-2">
                {data.educations.map((edu, index) => (
                  <div key={edu._id || index} className="page-break-avoid">
                    <h4 className="text-xs font-bold" style={{ color: '#111827' }}>{edu.degree}</h4>
                    <p className="text-xs" style={{ color: '#6B7280' }}>{edu.institution}</p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>{edu.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-2 space-y-4">
          {data.summary && (
            <div className="page-break-avoid">
              <h3 className="text-xs font-bold uppercase mb-2 pb-1" style={{ color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Profile</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>{data.summary}</p>
            </div>
          )}

          {data.experiences.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase mb-2 pb-1" style={{ color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Experience</h3>
              <div className="space-y-3">
                {data.experiences.map((exp, index) => (
                  <div key={exp._id || index} className="page-break-avoid">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-sm font-bold" style={{ color: '#111827' }}>{exp.role}</h4>
                      <span className="text-xs" style={{ color: '#9CA3AF' }}>{exp.duration}</span>
                    </div>
                    <p className="text-xs font-semibold" style={{ color: '#6B7280' }}>{exp.company}</p>
                    <div className="text-xs mt-1 preview-description" style={{ color: '#374151' }} dangerouslySetInnerHTML={{ __html: exp.description }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.projects.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase mb-2 pb-1" style={{ color: '#111827', borderBottom: '1px solid #E5E7EB' }}>Projects</h3>
              <div className="space-y-2">
                {data.projects.map((proj, index) => (
                  <div key={proj._id || index} className="page-break-avoid">
                    <h4 className="text-sm font-bold" style={{ color: '#111827' }}>{proj.title}</h4>
                    {proj.link && <p className="text-xs" style={{ color: '#6B7280' }}>{proj.link}</p>}
                    <div className="text-xs preview-description" style={{ color: '#374151' }} dangerouslySetInnerHTML={{ __html: proj.description }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
},

latex: {
  name: 'LaTeX Academic',
  preview: (data) => (
    <div className="space-y-5 p-8" style={{ backgroundColor: '#FFFEF9', fontFamily: 'serif' }}>
      {data.personalInfo.name && (
        <div className="text-center pb-3" style={{ borderBottom: '1px solid #000000' }}>
          <h3 className="text-2xl font-bold" style={{ color: '#000000' }}>{data.personalInfo.name}</h3>
          <div className="mt-1 text-xs" style={{ color: '#333333' }}>
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && data.personalInfo.email && <span> · </span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.linkedIn && <span> · {data.personalInfo.linkedIn}</span>}
          </div>
        </div>
      )}

      {data.summary && (
        <div className="page-break-avoid">
          <p className="text-sm leading-relaxed" style={{ color: '#1a1a1a', textAlign: 'justify' }}>{data.summary}</p>
        </div>
      )}

      {data.experiences.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-3" style={{ color: '#000000' }}>EXPERIENCE</h3>
          <div className="space-y-3">
            {data.experiences.map((exp, index) => (
              <div key={exp._id || index} className="page-break-avoid">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-sm" style={{ color: '#000000' }}>{exp.role}</h4>
                  <span className="text-xs italic" style={{ color: '#333333' }}>{exp.duration}</span>
                </div>
                <p className="text-sm italic" style={{ color: '#1a1a1a' }}>{exp.company}</p>
                <div className="text-sm mt-1 preview-description" style={{ color: '#1a1a1a' }} dangerouslySetInnerHTML={{ __html: exp.description }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {data.educations.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-3" style={{ color: '#000000' }}>EDUCATION</h3>
          <div className="space-y-2">
            {data.educations.map((edu, index) => (
              <div key={edu._id || index} className="page-break-avoid">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-sm" style={{ color: '#000000' }}>{edu.degree}</h4>
                  <span className="text-xs italic" style={{ color: '#333333' }}>{edu.duration}</span>
                </div>
                <p className="text-sm italic" style={{ color: '#1a1a1a' }}>{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="page-break-avoid">
          <h3 className="text-sm font-bold mb-2" style={{ color: '#000000' }}>SKILLS</h3>
          <p className="text-sm" style={{ color: '#1a1a1a' }}>{data.skills.join(', ')}</p>
        </div>
      )}

      {data.projects.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-3" style={{ color: '#000000' }}>PROJECTS</h3>
          <div className="space-y-2">
            {data.projects.map((proj, index) => (
              <div key={proj._id || index} className="page-break-avoid">
                <h4 className="font-bold text-sm" style={{ color: '#000000' }}>{proj.title}</h4>
                {proj.link && <p className="text-xs" style={{ color: '#333333' }}>{proj.link}</p>}
                <div className="text-sm preview-description" style={{ color: '#1a1a1a' }} dangerouslySetInnerHTML={{ __html: proj.description }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
},

github: {
  name: 'OS Contributor',
  preview: (data) => (
    <div className="p-8 space-y-6" style={{ backgroundColor: '#FFFFFF' }}>
      {data.personalInfo.name && (
        <div className="flex justify-between items-start pb-6" style={{ borderBottom: '1px solid #D0D7DE' }}>
          <div>
            <h3 className="text-3xl font-bold tracking-tight" style={{ color: '#1F2328' }}>{data.personalInfo.name}</h3>
            <div className="mt-2 flex flex-wrap gap-4 text-sm" style={{ color: '#636C76' }}>
              {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
              {data.personalInfo.linkedIn && <span>{data.personalInfo.linkedIn}</span>}
              {data.personalInfo.portfolio && <span>{data.personalInfo.portfolio}</span>}
            </div>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ border: '1px solid #D0D7DE', color: '#636C76' }}>
            Active Contributor
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1 space-y-6">
          {data.skills.length > 0 && (
            <div className="page-break-avoid">
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#1F2328' }}>Top Languages</h3>
              <div className="space-y-2">
                {data.skills.slice(0, 8).map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: index % 2 === 0 ? '#3178C6' : '#F1E05A' }}></div>
                    <span className="text-xs font-medium" style={{ color: '#1F2328' }}>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.educations.length > 0 && (
            <div className="page-break-avoid">
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#1F2328' }}>Education</h3>
              <div className="space-y-2">
                {data.educations.map((edu, index) => (
                  <div key={edu._id || index}>
                    <h4 className="text-xs font-bold" style={{ color: '#1F2328' }}>{edu.degree}</h4>
                    <p className="text-xs" style={{ color: '#636C76' }}>{edu.institution}</p>
                    <p className="text-xs" style={{ color: '#636C76' }}>{edu.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-3 space-y-6">
          {data.experiences.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold pb-2" style={{ color: '#1F2328', borderBottom: '1px solid #D0D7DE' }}>Contribution Graph (Experience)</h3>
              <div className="space-y-4 mt-4">
                {data.experiences.map((exp, index) => (
                  <div key={exp._id || index} className="page-break-avoid relative pl-6" style={{ borderLeft: '2px solid #D0D7DE' }}>
                    <div className="absolute w-4 h-4 rounded-full bg-white" style={{ left: '-9px', top: '4px', border: '2px solid #D0D7DE' }}></div>
                    <h4 className="font-bold text-sm" style={{ color: '#0969DA' }}>{exp.role} @ {exp.company}</h4>
                    <p className="text-xs mb-2" style={{ color: '#636C76' }}>{exp.duration}</p>
                    <div className="text-sm leading-relaxed preview-description" style={{ color: '#1F2328' }} dangerouslySetInnerHTML={{ __html: exp.description }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.projects.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold pb-2" style={{ color: '#1F2328', borderBottom: '1px solid #D0D7DE' }}>Projects</h3>
              <div className="space-y-3 mt-4">
                {data.projects.map((proj, index) => (
                  <div key={proj._id || index} className="page-break-avoid">
                    <h4 className="font-bold text-sm" style={{ color: '#0969DA' }}>{proj.title}</h4>
                    {proj.link && <p className="text-xs" style={{ color: '#636C76' }}>{proj.link}</p>}
                    <div className="text-sm mt-1 preview-description" style={{ color: '#1F2328' }} dangerouslySetInnerHTML={{ __html: proj.description }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
},

lab: {
  name: 'STEM Analytics',
  preview: (data) => (
    <div className="p-8 space-y-6" style={{ backgroundColor: '#F8FAFC' }}>
      {data.personalInfo.name && (
        <div className="p-6 rounded-xl" style={{ backgroundColor: '#0F172A' }}>
          <h3 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>{data.personalInfo.name}</h3>
          <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>STEM Researcher | Data Professional</p>
          <div className="flex gap-4 mt-2 text-xs" style={{ color: '#94A3B8' }}>
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
            {data.personalInfo.linkedIn && <span>• {data.personalInfo.linkedIn}</span>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          {data.summary && (
            <div className="page-break-avoid">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>Summary</h3>
              <p className="text-sm" style={{ color: '#475569' }}>{data.summary}</p>
            </div>
          )}

          {data.experiences.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>Research & Experience</h3>
              {data.experiences.map((exp, index) => (
                <div key={exp._id || index} className="mb-6 page-break-avoid">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-base" style={{ color: '#0F172A' }}>{exp.role}</h4>
                    <span className="text-xs font-mono px-2 py-1 rounded" style={{ backgroundColor: '#E2E8F0', color: '#475569' }}>
                      {exp.duration}
                    </span>
                  </div>
                  <p className="font-semibold text-sm mb-2" style={{ color: '#2563EB' }}>{exp.company}</p>
                  <div className="text-sm pl-4 preview-description" style={{ color: '#64748B', borderLeft: '4px solid #E2E8F0' }} dangerouslySetInnerHTML={{ __html: exp.description }} />
                </div>
              ))}
            </div>
          )}

          {data.projects.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>Projects</h3>
              {data.projects.map((proj, index) => (
                <div key={proj._id || index} className="mb-4 page-break-avoid">
                  <h4 className="font-bold text-base" style={{ color: '#0F172A' }}>{proj.title}</h4>
                  {proj.link && <p className="text-xs" style={{ color: '#2563EB' }}>{proj.link}</p>}
                  <div className="text-sm mt-1 preview-description" style={{ color: '#64748B' }} dangerouslySetInnerHTML={{ __html: proj.description }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-4 space-y-6">
          {data.skills.length > 0 && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>Core Stack</h3>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill, index) => (
                  <span key={index} className="text-xs font-mono px-2 py-1 rounded" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.educations.length > 0 && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>Education</h3>
              <div className="space-y-3">
                {data.educations.map((edu, index) => (
                  <div key={edu._id || index} className="page-break-avoid">
                    <h4 className="text-sm font-bold" style={{ color: '#0F172A' }}>{edu.degree}</h4>
                    <p className="text-xs" style={{ color: '#64748B' }}>{edu.institution}</p>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>{edu.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
},

blueprint: {
  name: 'System Architect',
  preview: (data) => (
    <div className="p-10 space-y-8" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
      {data.personalInfo.name && (
        <div className="flex justify-between pb-4" style={{ borderBottom: '4px solid #000000' }}>
          <h3 className="text-4xl font-mono font-bold uppercase italic" style={{ color: '#000000' }}>{data.personalInfo.name}</h3>
          <div className="text-right font-mono text-xs uppercase" style={{ color: '#000000' }}>
            {data.personalInfo.email && <p>[{data.personalInfo.email}]</p>}
            {data.personalInfo.phone && <p>[{data.personalInfo.phone}]</p>}
            {data.personalInfo.linkedIn && <p>[{data.personalInfo.linkedIn}]</p>}
          </div>
        </div>
      )}

      {data.summary && (
        <div className="page-break-avoid">
          <h3 className="font-mono font-bold px-2 py-1 inline-block" style={{ backgroundColor: '#000000', color: '#FFFFFF' }}>00_OVERVIEW</h3>
          <p className="font-mono text-sm leading-tight mt-3" style={{ color: '#475569' }}>{data.summary}</p>
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="space-y-4 page-break-avoid">
          <h3 className="font-mono font-bold px-2 py-1 inline-block" style={{ backgroundColor: '#000000', color: '#FFFFFF' }}>01_TECHNICAL_INVENTORY</h3>
          <p className="font-mono text-sm leading-tight" style={{ color: '#475569' }}>
            {data.skills.join(' // ')}
          </p>
        </div>
      )}

      {data.experiences.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-mono font-bold px-2 py-1 inline-block" style={{ backgroundColor: '#000000', color: '#FFFFFF' }}>02_EXECUTION_HISTORY</h3>
          {data.experiences.map((exp, index) => (
            <div key={exp._id || index} className="grid grid-cols-4 gap-4 page-break-avoid">
              <div className="col-span-1 font-mono text-xs pt-1" style={{ color: '#64748B' }}>
                {exp.duration}
              </div>
              <div className="col-span-3">
                <h4 className="font-bold text-base uppercase" style={{ color: '#000000' }}>{exp.role}</h4>
                <p className="font-mono text-xs font-bold mb-2" style={{ color: '#64748B' }}>{exp.company}</p>
                <div className="text-sm preview-description" style={{ color: '#1E293B' }} dangerouslySetInnerHTML={{ __html: exp.description }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {data.projects.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-mono font-bold px-2 py-1 inline-block" style={{ backgroundColor: '#000000', color: '#FFFFFF' }}>03_PROJECT_ARCHIVE</h3>
          {data.projects.map((proj, index) => (
            <div key={proj._id || index} className="grid grid-cols-4 gap-4 page-break-avoid">
              <div className="col-span-1 font-mono text-xs pt-1" style={{ color: '#64748B' }}>
                {proj.link && <span>[LINK]</span>}
              </div>
              <div className="col-span-3">
                <h4 className="font-bold text-base uppercase" style={{ color: '#000000' }}>{proj.title}</h4>
                {proj.link && <p className="font-mono text-xs mb-2" style={{ color: '#64748B' }}>{proj.link}</p>}
                <div className="text-sm preview-description" style={{ color: '#1E293B' }} dangerouslySetInnerHTML={{ __html: proj.description }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {data.educations.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-mono font-bold px-2 py-1 inline-block" style={{ backgroundColor: '#000000', color: '#FFFFFF' }}>04_CREDENTIALS</h3>
          {data.educations.map((edu, index) => (
            <div key={edu._id || index} className="grid grid-cols-4 gap-4 page-break-avoid">
              <div className="col-span-1 font-mono text-xs pt-1" style={{ color: '#64748B' }}>
                {edu.duration}
              </div>
              <div className="col-span-3">
                <h4 className="font-bold text-base uppercase" style={{ color: '#000000' }}>{edu.degree}</h4>
                <p className="font-mono text-xs" style={{ color: '#64748B' }}>{edu.institution}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

};

// Wrapper component that shows all pages vertically with proper scaling
export const ResumePreviewWithPagination = ({ 
  resumeData, 
  selectedTemplate 
}) => {
  const [totalPages, setTotalPages] = useState(1);
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const currentTemplate = RESUME_TEMPLATES[selectedTemplate];

  // Calculate number of pages
  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      const pageHeight = 880; // A4 height at 96 DPI
      const pages = Math.ceil(height / pageHeight);
      setTotalPages(pages);
    }
  }, [selectedTemplate, resumeData]);

  // Calculate scale to fit container width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const pageWidth = 816; // A4 width at 96 DPI
        const newScale = Math.min(1, (containerWidth - 32) / pageWidth); // 32px for padding
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Create array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="space-y-6 w-full">
      <h2 className="text-2xl font-bold" style={{ color: '#134E4A' }}>
        Real-time Preview
      </h2>
      
      {/* Container with vertical scroll only */}
      <div 
        ref={containerRef}
        className="w-full overflow-y-auto overflow-x-hidden"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        {/* Vertically stacked pages */}
        <div className="flex flex-col items-center gap-8 pb-8">
          {pageNumbers.map((pageNum) => (
            <div
              key={pageNum}
              className="relative border-2 rounded-lg shadow-lg bg-white"
              style={{
                width: '860px',
                minHeight: '880px',
                borderColor: '#2DD4BF',
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                marginBottom: pageNum < totalPages ? `${-880 * (1 - scale)}px` : '0'
              }}
            >
              {/* Page content */}
              <div
                ref={pageNum === 1 ? contentRef : null}
                className="w-full h-full overflow-hidden"
                style={{
                  height: '880px',
                  position: 'relative'
                }}
              >
                {pageNum === 1 ? (
                  // Render full content on first page
                  <div>{currentTemplate.preview(resumeData)}</div>
                ) : (
                  // Show continuation on subsequent pages
                  <div
                    style={{
                      transform: `translateY(-${(pageNum - 1) * 860}px)`,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%'
                    }}
                  >
                    {currentTemplate.preview(resumeData)}
                  </div>
                )}
              </div>
              
              {/* Page number indicator */}
              <div 
                className="absolute bottom-4 right-4 text-xs font-medium px-3 py-1.5 rounded shadow-sm"
                style={{ 
                  backgroundColor: '#F0FDFA',
                  color: '#134E4A',
                  border: '1px solid #2DD4BF'
                }}
              >
                Page {pageNum} of {totalPages}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        .page-break-avoid {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        .preview-description ul,
        .resume-description ul {
          list-style-type: disc;
          margin-left: 1.5em;
          margin-top: 0.5em;
        }
        
        .preview-description li,
        .resume-description li {
          margin-bottom: 0.25em;
        }
        
        @media print {
          .page-break-avoid {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
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

  return (
    <div className="space-y-4 w-full">
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

      {/* Preview with Vertical Pages */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <ResumePreviewWithPagination 
          resumeData={resumeData}
          selectedTemplate={selectedTemplate}
        />
      </div>
    </div>
  );
};

export default ResumeTemplateSelector;