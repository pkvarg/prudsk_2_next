import React from 'react'

// Renders legal texts: each section has a title and paragraphs; a paragraph given
// as an array of strings is rendered as a bullet list.
const LegalSections = ({ title, effective, intro, sections }) => (
  <div className="min-h-screen">
    <div className="container mx-auto px-3 md:px-0 max-w-4xl">
      <div className="my-3 py-8">
        <h1 className="text-[#071e46] font-bold text-2xl md:text-3xl mb-2">{title}</h1>
        <p className="text-[#9b7d57] text-[15px] mb-6">{effective}</p>
        {intro && <p className="text-[#191817] text-[17px] leading-relaxed mb-6">{intro}</p>}
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-28 mb-8">
            <h2 className="text-[#071e46] font-bold text-xl md:text-2xl mb-3">{section.title}</h2>
            {section.body.map((block, i) =>
              Array.isArray(block) ? (
                <ul key={i} className="text-[#191817] text-[17px] leading-relaxed mb-4 ml-6 space-y-1">
                  {block.map((line) => (
                    <li key={line} className="list-disc">
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p key={i} className="text-[#191817] text-[17px] leading-relaxed mb-4">
                  {block}
                </p>
              ),
            )}
          </section>
        ))}
      </div>
    </div>
  </div>
)

export default LegalSections
