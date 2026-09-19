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

function updatePartial(name, transform) {
  const file = path.join(themeDir, 'partials', name + '.hbs');
  fs.writeFileSync(file, transform(fs.readFileSync(file, 'utf8')));
}
updatePartial('basics', text => text.replace(
  '{{#if city}}{{city}}{{/if}}{{#if region}}, {{region}}{{/if}}{{#if countryCode}}, {{countryCode}}{{/if}}',
  '{{#if city}}{{city}}{{/if}}{{#if countryCode}}, {{#if countryName}}{{countryName}}{{else}}{{countryCode}}{{/if}}{{/if}}'
));
updatePartial('education', text => text.replace('{{studyType}} {{/if}} - ', '{{studyType}} {{/if}}'));
updatePartial('languages', text => text.replace(
  /<span class='language'>[\s\S]*?{{#unless @last}}<span>,<\/span>{{\/unless}}/,
  "<span class='language'>{{language}}{{#if fluency}} <em>({{fluency}})</em>{{/if}}</span>{{#unless @last}}, {{/unless}}"
));
updatePartial('interests', text => text.replace(
  /{{#each resume.interests}}[\s\S]*?\n\t\t{{\/each}}/,
  "{{#each resume.interests}}{{#if keywords.length}}{{#each keywords}}{{.}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}{{name}}{{/if}}{{#unless @last}}, {{/unless}}{{/each}}"
));
