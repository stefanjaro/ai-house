import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, '../config/api-config.template.json');
const template = JSON.parse(readFileSync(templatePath, 'utf-8'));

const characters = ['husband', 'wife', 'poltergeist'];
const requiredFields = ['apiKey', 'endpoint', 'model'];

describe('api-config.template.json', () => {
  it('has all 3 characters', () => {
    for (const char of characters) {
      expect(template).toHaveProperty(char);
    }
  });

  for (const char of characters) {
    describe(char, () => {
      for (const field of requiredFields) {
        it(`has a "${field}" field that is a string`, () => {
          expect(template[char]).toHaveProperty(field);
          expect(typeof template[char][field]).toBe('string');
        });
      }
    });
  }
});
