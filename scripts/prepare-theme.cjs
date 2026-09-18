const fs = require('node:fs');
const path = require('node:path');

// The upstream theme does not display education.summary.
const themeDir = path.dirname(require.resolve('jsonresume-theme-onepage-plus'));
const partialPath = path.join(themeDir, 'partials', 'education.hbs');
const partial = fs.readFileSync(partialPath, 'utf8');
const marker = "{{#unless @last}}";
if (!partial.includes(marker)) throw new Error('Education template changed; review summary placement.');
fs.writeFileSync(partialPath, partial.replace(marker,
  "{{#if summary}}<p class='education-summary'>{{summary}}</p>{{/if}}\n" + marker));
