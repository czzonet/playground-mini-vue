// TODO:
/**
 * - reflect
 * - 闭包？
 * - trigger？
 */

import {
  ReactiveFlags,
  reactiveMap,
  readonlyMap,
  shallowReadonlyMap,
} from "./const";
import { track } from "./effect";
import { reactive, readonly } from "./reactive";
import { isObject } from "./share";

const createGetter =
  (isReadonly = false, shallow = false) =>
  (target: any, key: ReactiveFlags, receiver: any) => {
    const isRaw = key === ReactiveFlags.RAW;
    const isExistInReactiveMap = receiver === reactiveMap.get(target);
    const isExistInReadonlyMap = receiver === readonlyMap.get(target);
    const isExistInShallowReadonlyMap =
      receiver === shallowReadonlyMap.get(target);

    /** 添加特殊的get属性判断 */
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    } else if (
      isRaw &&
      (isExistInReactiveMap ||
        isExistInReadonlyMap ||
        isExistInShallowReadonlyMap)
    ) {
      return target;
    }

    const res = Reflect.get(target, key, receiver);

    if (!isReadonly) {
      track(target, "get", key);
    }

    if (shallow) {
      return res;
    }

    /** 递归 */
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  };

const createSetter = () => (target, key, value, receiver) => {
  const res = Reflect.set(target, key, value, receiver);
  //TODO:  trigger(target, "get", key);
  return res;
};

export const readonlyHandlers = {
  get: createGetter(true),
  set: (target, key) => {
    console.warn(
      `Set operation on key '${String(key)}' failed: target is readonly.`,
      target
    );
    return true;
  },
};

export const mutableHandlers = {
  get: createGetter(),
  set: createSetter(),
};

export const shallowReadonlyHandlers = {
  get: createGetter(true, true),
  set: (target, key) => {
    console.warn(
      `Set operation on key '${String(key)}' failed: target is readonly.`,
      target
    );
    return true;
  },
};
