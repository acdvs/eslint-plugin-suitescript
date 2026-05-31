import fs from 'node:fs/promises';
import path from 'node:path';
import { moduleNames } from '../lib/utils/modules';
import { scriptTypes } from '../lib/utils/script-types';

const SRC_DIR = './docs/src';
const OUT_DIR = './docs/rules';
const SCRIPT_NAME = path.basename(import.meta.filename, '.ts');

type DocReplaceOptions = Record<string, string>;

const docsToModify: Record<string, DocReplaceOptions> = {
  'entry-points.md': {
    old: '<ENTRY_POINTS>',
    new: scriptTypes
      .flatMap((st) => [
        `- ${st.name}`,
        ...st.entryPoints.map((ep) => `  - ${ep}`),
      ])
      .join('\n'),
  },
  'module-vars.md': {
    old: '<MODULE_NAMES>',
    new: moduleNames.map((m) => `- ${m}`).join('\n'),
  },
  'script-type.md': {
    old: '<SCRIPT_TYPES>',
    new: scriptTypes.map((st) => `- ${st.name}`).join('\n'),
  },
};

async function generateDocs() {
  let files: string[] = [];

  try {
    files = await fs.readdir(SRC_DIR);
  } catch {
    console.error(`[${SCRIPT_NAME}] Error reading docs at ${SRC_DIR}`);
    process.exit(1);
  }

  for (const file of files) {
    const options = docsToModify[file];
    const fromPath = path.join(SRC_DIR, file);
    const toPath = path.join(OUT_DIR, file);

    if (!options) {
      copyDoc(fromPath, toPath);
      continue;
    }

    const data = await readDoc(fromPath);
    const newContent = data?.replaceAll(options.old, options.new);

    if (newContent) {
      writeDoc(toPath, newContent);
    }
  }
}

function readDoc(docPath: string) {
  try {
    return fs.readFile(docPath, 'utf8');
  } catch {
    console.error(`[${SCRIPT_NAME}] Error reading doc at ${docPath}`);
  }
}

function writeDoc(docPath: string, content: string) {
  try {
    fs.writeFile(docPath, content, 'utf8');
    console.log(`[${SCRIPT_NAME}] Wrote doc at ${docPath}`);
  } catch {
    console.error(`[${SCRIPT_NAME}] Error writing doc at ${docPath}`);
  }
}

async function copyDoc(fromPath: string, toPath: string) {
  try {
    await fs.copyFile(fromPath, toPath);
  } catch {
    console.error(
      `[${SCRIPT_NAME}] Error copying doc from ${fromPath} to ${toPath}`,
    );
  }
}

generateDocs();
