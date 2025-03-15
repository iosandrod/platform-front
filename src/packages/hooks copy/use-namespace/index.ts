import { inject } from 'vue'

type BemFn = (
  namespace: string,
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string
) => string;

interface UseNamespaceReturn {
  namespace: string;
  b: (blockSuffix?: string) => string;
  e: (element?: string) => string;
  is: (name: string, ...args: [boolean | string]) => string;
}

export const useNamespace = (block: string, Namespace?: string): UseNamespaceReturn => {
  //@ts-ignore
  const defaultNamespace = Namespace || inject('Everright').state.Namespace
  const namespace = `Everright-${defaultNamespace}`

  const b: (blockSuffix?: string) => string = (blockSuffix = '') =>
    _bem(namespace, block, blockSuffix, '', '')

  const e: (element?: string) => string = (element) =>
    element ? _bem(namespace, block, '', element, '') : ''

  const is: (name: string, ...args: [boolean | string]) => string = (name, ...args) => {
    const state = args.length >= 1 ? args[0] : true
    return name && state ? `${statePrefix}${name}` : ''
  }

  return {
    namespace,
    b,
    e,
    is
  }
}

const _bem: BemFn = (
  namespace,
  block,
  blockSuffix,
  element,
  modifier
) => {
  let cls = `${namespace}-${block}`
  if (element) {
    cls += `__${element}`
  }
  if (modifier) {
    cls += `--${modifier}`
  }
  return cls
}

const statePrefix = 'is-'
