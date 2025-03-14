import _ from 'lodash'
const importModules = import.meta.glob('./*.js', { eager: true })
const modules = {}
_.forIn(importModules, (func, path) => {
  Object.keys(func).forEach((key) => {
    modules[key] = func[key]
  })
})
export default {
  ...modules
}
