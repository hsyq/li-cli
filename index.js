#!/usr/bin/env node

const program = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
const handlebars = require('handlebars')
const fs = require('fs')

const ora = require('ora')
const chalk = require('chalk')
const logSymbols = require('log-symbols')

const tpls = {
    'h': {
        url: 'https://github.com/hsyq/li-cli-test-tpl-h',
        downloadUrl: 'https://github.com:hsyq/li-cli-test-tpl-h#master',
        desc: 'h 模板'
    },
    'r': {
        url: 'https://github.com/hsyq/li-cli-test-tpl-r',
        downloadUrl: 'https://github.com:hsyq/li-cli-test-tpl-r#master',
        desc: 'r 模板'
    },
    'v': {
        url: 'https://github.com/hsyq/li-cli-test-tpl-v',
        downloadUrl: 'https://github.com:hsyq/li-cli-test-tpl-v#master',
        desc: 'v 模板'
    },
}


program
  .version('0.1.0') 

program
  .command('init <template> <project>')
  .description('初始化项目模板')
  .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(template, project){
   
    const spinner = ora('正在下载中......').start()

    const downloadUrl = tpls[template].downloadUrl
    download(downloadUrl, project, {clone: true}, err => {
        if(err) {
            spinner.fail() 
            return console.log(logSymbols.error, chalk.red('初始化失败'))
        }
        else {
            spinner.succeed() 

            inquirer.prompt([{
                type: 'input',
                name: 'name',
                message: '请输入项目名称:'
            }, {
                type: 'input',
                name: 'description',
                message: '请输入项目简介:'
            }, {
                type: 'input',
                name: 'author',
                message: '请输入作者:'
            }]).then(answers => {
               
                const filePath = `${project}/package.json`
                const pkgContent = fs.readFileSync(filePath, 'utf8')
                const pkgResult = handlebars.compile(pkgContent)(answers)
                fs.writeFileSync(filePath, pkgResult)
                console.log(logSymbols.success, chalk.green('项目初始化模板成功!'))
            })
        }
    })
  });

  program
  .command('list')  
  .description('查看所有可用模板')
  .action(function(){
      for(let key in tpls) {
        console.log(key, ' ', tpls[key].desc);
      }
  });

program.parse(process.argv); 
