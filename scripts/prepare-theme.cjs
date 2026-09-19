const fs = require('node:fs');
const path = require('node:path');

// The upstream theme does not display education.summary.
const themeDir = path.dirname(require.resolve('jsonresume-theme-onepage-plus'));
const partialPath = path.join(themeDir, 'partials', 'education.hbs');
const partial = fs.readFileSync(partialPath, 'utf8');
const marker = "{{#unless @last}}";
if (!partial.includes(marker)) throw new Error('Education template changed; review summary placement.');
if (!partial.includes("class='education-summary'")) fs.writeFileSync(partialPath, partial.replace(marker,
  "{{#if summary}}<p class='education-summary'>{{summary}}</p>{{/if}}\n" + marker));

const templatePath = path.join(themeDir, 'resume.hbs');
const template = fs.readFileSync(templatePath, 'utf8');
const education = '{{> education }}';
const work = '{{> work }}';
const skills = '{{> skills }}';
if (!template.includes(education) || !template.includes(work) || !template.includes(skills)) {
  throw new Error('Resume template changed; review section order.');
}
fs.writeFileSync(templatePath, template.replace(education, '').replace(skills, '').replace(work, education + '\n\t\t' + skills + '\n\t\t' + work));
