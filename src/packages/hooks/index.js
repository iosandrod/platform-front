import _ from 'lodash'
const importModules = import.meta.glob('./*/index.js', { eager: true })
const modules = {}
_.forIn(importModules, (func, path) => {
  // console.log(func)
  // const key = _.head(Object.keys(func))
  Object.keys(func).forEach(key => {
    if (/^use[A-Z]\w/.test(key)) {
      modules[key] = func[key]
    }
  })
}) 
const importModules1 = import.meta.glob('./*/index.ts', { eager: true })
_.forIn(importModules1, (func, path) => {
  // console.log(func) 
  // const key = _.head(Object.keys(func)) 
  Object.keys(func).forEach(key => {
    if (/^use[A-Z]\w/.test(key)) {
      modules[key] = func[key]
    }
  })
})
export default {
  ...modules
}
