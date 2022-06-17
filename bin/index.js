#! /usr/bin/env node
const fs = require('fs')
const path = require('path')
const {exec} = require('child_process')
const fileToObj = (filePath) => {
  filePath = path.resolve(__dirname, filePath)
  return JSON.parse(fs.readFileSync(filePath).toString())
}

const objToFile = (data, filePath) => {
  fs.writeFileSync(
    path.resolve(__dirname, filePath),
    JSON.stringify(data)
  )
}

let {argv} = process
const {name, version} = require('../package.json')
const list = fileToObj('./data.json')
if(argv.indexOf('-v') > -1){
  console.log(`${name}: v${version}`)
}else if(argv.indexOf('-l') > -1){
  Object.keys(list).forEach((key) => {
    let name = `${key} `
    console.log(`${name.padEnd(15, '-')} ${list[key]}`)
  })
}else if(argv.indexOf('add') > -1){
  const index = argv.indexOf('add')
  let key = argv[index + 1]
  let value = argv[index + 2]
  let res = list[key]
  if(!res){
    list[key] = value
    objToFile(list, './data.json')
  }else{
    console.log(`${key} has already been in list`)
  }
}else if(argv.indexOf('del') > -1){
  const index = argv.indexOf('del')
  let key = argv[index + 1]
  delete list[key]
  objToFile(list, './data.json')
}else if(argv.indexOf('use') > -1){
  const index = argv.indexOf('use')
  const key = argv[index + 1]
  if(list[key]){
    exec(`npm set registry ${list[key]}`, (error, stdout, stderr) => {
      if(error){
        console.error(`exec error: ${error}`)
        return
      }
      console.log(`set registry sucess: ${list[key]}`)
    })
  }else{
    console.warn(`error: the registry ${key} is not exist`)
  }
}