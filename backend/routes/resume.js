const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Handle resume generation
router.post('/generate-resume', (req, res) => {
  const { name, email, phone, education, experience, skills } = req.body;
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, '../resumes', `${name}_resume.pdf`);

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('Resume', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Name: ${name}`);
  doc.text(`Email: ${email}`);
  doc.text(`Phone: ${phone}`);
  doc.text(`Education: ${education}`);
  doc.text(`Experience: ${experience}`);
  doc.text(`Skills: ${skills}`);

  doc.end();

  const resumeUrl = `http://localhost:3000/resumes/${name}_resume.pdf`;
  res.json({ url: resumeUrl });
});

module.exports = router;
