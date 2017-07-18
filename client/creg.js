#!/usr/bin/env node

const { resolve } = require('path')

const defaultCommand = 'help'
const commands = new Set([
  defaultCommand,
  'help',
  'init',
  'start',
  'add',
  'import'
])

let cmd = process.argv[2]

// Handle version first because it is not a command
if (new Set(['-v', '--version']).has(cmd)) {
  console.log(require('../package.json').version)
  process.exit(0)
}

if (!commands.has(cmd)) {
  cmd = defaultCommand
}


if (new Set(['help', '--help', '-h']).has(cmd)) {
  console.log(`
CREG: a simple Component REGistry

Usage:
  creg [options] <command>

Commands:
  help (default)      Print this message
  init                Initialize creg files
  start               Start api server
  publish*            Publish components to remote registry
  import*             Import component from remote registry

Options:
  --help              Print this message
  --version           Print CREG version

* = under development
`)
  process.exit(0)
}

require(`./creg-${cmd}`)().then(code => {
  if (code != null) process.exit(code)
})