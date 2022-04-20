import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";
import {
  ReactiveFlags,
  reactiveMap,
  readonlyMap,
  shallowReadonlyMap,
} from "./const";

const createReactiveObject = (
  target: any,
  proxyMap: WeakMap<any, any>,
  baseHandlers: ProxyHandler<any>
): any => {
  /** 检查缓存 */
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy);

  return proxy;
};

export const reactive = <T>(target: T): T =>
  createReactiveObject(target, reactiveMap, mutableHandlers);
export const readonly = <T>(target: T): T =>
  createReactiveObject(target, readonlyMap, readonlyHandlers);
export const shallowReadonly = <T>(target: T): T =>
  createReactiveObject(target, shallowReadonlyMap, shallowReadonlyHandlers);

export const isReactive = (value: any): boolean =>
  !!value[ReactiveFlags.IS_REACTIVE];
export const isReadonly = (value: any): boolean =>
  !!value[ReactiveFlags.IS_REACTIVE];
export const isProxy = (value: any): boolean =>
  isReactive(value) || isReadonly(value);
