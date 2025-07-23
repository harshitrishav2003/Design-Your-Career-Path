export const PROMPTS = {
    generateSummary: `
  Job Title: {jobTitle}.
  Based on this job title, generate a JSON array with three summaries:
  - One for Fresher
  - One for Mid-Level
  - One for Experienced level
  
  Each summary must:
  - Be 3–4 lines long
  - Mention relevant skills
  - Include the fields: experience_level, summary (as an array), and skills.
  
  Return ONLY valid JSON.
  `,

    grammarCheck: `
  User input: "{text}".
  
  1) Provide a grammatically corrected version.
  2) Suggest 2–3 possible next sentence completions.
  
  Return ONLY JSON:
  {
    "correctedText": "...",
    "suggestions": ["...", "..."]
  }
  `
};
