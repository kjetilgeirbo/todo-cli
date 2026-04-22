const { formatList, formatAdd, formatDone, formatDelete, formatError, formatEmpty } = require('../src/display');

// Strip ANSI codes for testing
function strip(str) {
  return str.replace(/\u001b\[[0-9;]*m/g, '');
}

describe('formatList', () => {
  test('formats a mixed list with progress', () => {
    const todos = [
      { id: 1, text: 'Buy milk', done: false },
      { id: 2, text: 'Walk the dog', done: true },
      { id: 3, text: 'Write tests', done: false },
    ];
    const output = strip(formatList(todos));
    expect(output).toContain('1. [ ] Buy milk');
    expect(output).toContain('2. [x] Walk the dog');
    expect(output).toContain('3. [ ] Write tests');
    expect(output).toContain('Progress: 1/3 done (33%)');
  });

  test('formats all-done list', () => {
    const todos = [
      { id: 1, text: 'Done task', done: true },
    ];
    const output = strip(formatList(todos));
    expect(output).toContain('[x] Done task');
    expect(output).toContain('Progress: 1/1 done (100%)');
  });
});

describe('formatEmpty', () => {
  test('returns empty state message', () => {
    const output = strip(formatEmpty());
    expect(output).toContain('No todos yet');
  });
});

describe('formatAdd', () => {
  test('formats add confirmation', () => {
    const output = strip(formatAdd({ id: 1, text: 'Buy milk' }));
    expect(output).toContain('Added');
    expect(output).toContain('Buy milk');
    expect(output).toContain('#1');
  });
});

describe('formatDone', () => {
  test('formats done confirmation', () => {
    const output = strip(formatDone({ id: 2, text: 'Walk the dog' }));
    expect(output).toContain('Done');
    expect(output).toContain('Walk the dog');
    expect(output).toContain('#2');
  });
});

describe('formatDelete', () => {
  test('formats delete confirmation', () => {
    const output = strip(formatDelete({ id: 2, text: 'Walk the dog' }));
    expect(output).toContain('Deleted');
    expect(output).toContain('Walk the dog');
    expect(output).toContain('#2');
  });
});

describe('formatError', () => {
  test('formats not found error', () => {
    const output = strip(formatError(99));
    expect(output).toContain('Error');
    expect(output).toContain('#99');
    expect(output).toContain('not found');
  });
});
