const chalk = require('chalk');

function formatList(todos) {
  const lines = todos.map(t => {
    if (t.done) {
      return chalk.green(`  ${t.id}. [x] ${t.text}`);
    }
    return `  ${t.id}. [ ] ${t.text}`;
  });

  const doneCount = todos.filter(t => t.done).length;
  const total = todos.length;
  const pct = Math.round((doneCount / total) * 100);
  lines.push('');
  lines.push(`  Progress: ${doneCount}/${total} done (${pct}%)`);

  return lines.join('\n');
}

function formatEmpty() {
  return chalk.dim('No todos yet. Add one with: node index.js add "your task"');
}

function formatAdd(todo) {
  return chalk.green(`Added: "${todo.text}" (#${todo.id})`);
}

function formatDone(todo) {
  return chalk.green(`Done: "${todo.text}" (#${todo.id})`);
}

function formatDelete(todo) {
  return chalk.yellow(`Deleted: "${todo.text}" (#${todo.id})`);
}

function formatError(id) {
  return chalk.red(`Error: Todo #${id} not found`);
}

module.exports = { formatList, formatEmpty, formatAdd, formatDone, formatDelete, formatError };
