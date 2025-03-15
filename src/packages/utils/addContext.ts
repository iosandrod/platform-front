import { computed, reactive, toRaw } from 'vue'
import _ from 'lodash'
import { Context } from './Context'
// 示例使用
export const addContext = (node, parent?:any, fn?:any) => {
  let _context = new Context({
    node: node,
    parent: parent,
    fn: fn
  })
  return _context//
}