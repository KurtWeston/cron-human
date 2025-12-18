#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { cronToHuman, humanToCron } from './translator';
import { validateCron } from './parser';
import { getNextExecutions } from './scheduler';
import { log } from '@onamfc/developer-log';

const program = new Command();

program
  .name('cron-human')
  .description('Convert cron expressions to human-readable descriptions and vice versa')
  .version('1.0.0');

program
  .command('parse <expression>')
  .description('Convert cron expression to human-readable text')
  .action((expression: string) => {
    try {
      const human = cronToHuman(expression);
      console.log(chalk.green('\n✓ Cron Expression:'), chalk.cyan(expression));
      console.log(chalk.green('✓ Human Readable:'), chalk.yellow(human));
    } catch (error) {
      console.error(chalk.red('✗ Error:'), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program
  .command('generate <text...>')
  .description('Generate cron expression from natural language')
  .action((text: string[]) => {
    try {
      const input = text.join(' ');
      const cron = humanToCron(input);
      console.log(chalk.green('\n✓ Input:'), chalk.cyan(input));
      console.log(chalk.green('✓ Cron Expression:'), chalk.yellow(cron));
      console.log(chalk.green('✓ Meaning:'), chalk.white(cronToHuman(cron)));
    } catch (error) {
      console.error(chalk.red('✗ Error:'), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program
  .command('validate <expression>')
  .description('Validate cron expression syntax')
  .action((expression: string) => {
    const result = validateCron(expression);
    if (result.valid) {
      console.log(chalk.green('\n✓ Valid cron expression'));
      console.log(chalk.white('  Expression:'), chalk.cyan(expression));
    } else {
      console.log(chalk.red('\n✗ Invalid cron expression'));
      console.log(chalk.white('  Expression:'), chalk.cyan(expression));
      console.log(chalk.red('  Error:'), result.error);
      process.exit(1);
    }
  });

program
  .command('next <expression>')
  .description('Show next execution times')
  .option('-n, --count <number>', 'Number of executions to show', '5')
  .action((expression: string, options: { count: string }) => {
    try {
      const count = parseInt(options.count, 10);
      const executions = getNextExecutions(expression, count);
      
      console.log(chalk.green('\n✓ Cron Expression:'), chalk.cyan(expression));
      console.log(chalk.green('✓ Description:'), chalk.yellow(cronToHuman(expression)));
      console.log(chalk.green(`\n✓ Next ${count} executions:`));
      
      executions.forEach((exec, i) => {
        console.log(chalk.white(`  ${i + 1}.`), chalk.cyan(exec.formatted));
      });
    } catch (error) {
      console.error(chalk.red('✗ Error:'), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

if (process.argv.length === 2) {
  program.help();
}

program.parse();
