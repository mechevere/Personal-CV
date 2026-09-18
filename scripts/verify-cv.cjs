const fs = require('node:fs');
const resume = JSON.parse(fs.readFileSync('resume.json', 'utf8'));
const html = fs.readFileSync('resume.html', 'utf8');
for (const text of [resume.basics.summary, ...resume.education.map(item => item.summary).filter(Boolean)]) {
  if (!html.includes(text)) throw new Error('Expected CV copy missing from generated HTML: ' + text);
}
console.log('Summary and education notes appear in generated HTML.');
