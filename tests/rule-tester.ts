import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';

type TestCase = RuleTester.ValidTestCase | RuleTester.InvalidTestCase;

RuleTester.describe = describe;
RuleTester.it = it;

export default new RuleTester({
  languageOptions: {
    ecmaVersion: 2015,
    sourceType: 'commonjs',
  },
});

export function createTests<T extends TestCase>(tests: T[]): T[] {
  return tests.map((t) => {
    t.code = t.code && trimCode(t.code);
    if ('output' in t) {
      t.output = t.output && trimCode(t.output);
    }
    return t;
  });
}

function trimCode(code: string) {
  if (code.includes('\n')) {
    const lines = code.split('\n').slice(1, -1);
    const indentSize = lines[0].match(/^(\s*)/)?.[1].length;
    return lines.map((l) => l.slice(indentSize)).join('\n');
  }

  return code.trim();
}
