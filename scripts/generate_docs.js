const fs = require('fs');
const path = require('path');
const { moduleNames } = require('./../lib/util/modules');
const { scriptTypes } = require('./../lib/util/script-types');

const SRC_DIR = './docs/src';
const OUT_DIR = './docs/rules';
const SCRIPT_NAME = path.basename(__filename);

const docsToModify = {
  'entry-points.md': {
    old: '<ENTRY_POINTS>',
    new: scriptTypes.reduce((str, x) => {
      str += `- ${x.name}\n`;
      x.entryPoints.forEach((ep) => (str += `  - ${ep}\n`));
      return str;
    }, ''),
  },
  'module-vars.md': {
    old: '<MODULE_NAMES>',
    new: moduleNames.reduce((str, x) => {
      str += `- ${x}\n`;
      return str;
    }, ''),
  },
  'script-type.md': {
    old: '<SCRIPT_TYPES>',
    new: scriptTypes.reduce((str, x) => {
      str += `- ${x.name}\n`;
      return str;
    }, ''),
  },
};

fs.readdir(SRC_DIR, (err, files) => {
  if (err) {
    console.error(`[${SCRIPT_NAME}] Error reading docs`);
    return;
  }

  files.forEach((file) => {
    const options = docsToModify[file];
    const srcPath = path.join(SRC_DIR, file);
    const outPath = path.join(OUT_DIR, file);

    if (options) {
      fs.readFile(srcPath, 'utf8', (err, data) => {
        if (err) {
          console.error(`[${SCRIPT_NAME}] Error reading doc: ${srcPath}`);
          return;
        }

        const newContent = data.replace(new RegExp(options.old, 'g'), options.new);

        fs.writeFile(outPath, newContent, 'utf8', (err) => {
          if (err) {
            console.error(`[${SCRIPT_NAME}] Error writing doc: ${outPath}`);
          } else {
            console.log(`[${SCRIPT_NAME}] Generated doc: ${outPath}`);
          }
        });
      });
    } else {
      fs.copyFile(srcPath, outPath, (err) => {
        if (err) {
          console.error(`[${SCRIPT_NAME}] Error copying doc: ${outPath}`);
        }
      });
    }
  });
});
