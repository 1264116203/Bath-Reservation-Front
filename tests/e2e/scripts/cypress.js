// 引入本地模块
// const cypress = require('cypress')
const fse = require('fs-extra')
const { merge } = require('mochawesome-merge')
const generator = require('mochawesome-report-generator')

async function runTests() {
  await fse.remove('tests/e2e/results')
  // 移除之前生成的报告目录
  // const { totalFailed } = await cypress.run()
  const jsonReport = await merge({
    files: ['./tests/e2e/results/*.json']
  })
  await generator.create(jsonReport)
  // process.exit(totalFailed)
}

runTests()
