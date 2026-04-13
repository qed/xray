import { describe, it, expect } from 'vitest';
import { FILE_IMPORT_SYSTEM_PROMPT, buildFileImportContext } from '../prompts';

describe('FILE_IMPORT_SYSTEM_PROMPT', () => {
  it('is a non-empty string containing extraction and profile keywords', () => {
    expect(typeof FILE_IMPORT_SYSTEM_PROMPT).toBe('string');
    expect(FILE_IMPORT_SYSTEM_PROMPT.length).toBeGreaterThan(100);
    expect(FILE_IMPORT_SYSTEM_PROMPT).toContain('extraction');
    expect(FILE_IMPORT_SYSTEM_PROMPT).toContain('profile');
  });
});

describe('buildFileImportContext', () => {
  it('returns context with org name and department info', () => {
    const result = buildFileImportContext('Acme', [
      { name: 'Sales', priorityCount: 5 },
      { name: 'Operations', priorityCount: 3 },
    ]);
    expect(result).toContain('Acme');
    expect(result).toContain('Sales');
    expect(result).toContain('5');
    expect(result).toContain('Operations');
    expect(result).toContain('3');
    expect(result).toContain('2 department(s)');
  });

  it('returns context without department list when no departments exist', () => {
    const result = buildFileImportContext('Acme', []);
    expect(result).toContain('Acme');
    expect(result).toContain('no departments yet');
    expect(result).not.toContain('Existing Departments');
  });
});
