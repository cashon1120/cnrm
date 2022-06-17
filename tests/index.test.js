const {exec} = require('child_process')
const {name, version} = require('../package.json')
test('cnrm -v', () => {
  exec(`node bin/index.js -v`, (error, stdout, stderr) => {
    if(error){
      console.log(`exec error: ${error}`)
      return
    }
    expect(stdout).toContain(`${name}: v${version}`)
  })
})