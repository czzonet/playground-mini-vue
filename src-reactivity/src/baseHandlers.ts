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

const createGetter =
  (isReadonly = false, shallow = false) =>
  (target: any, key: ReactiveFlags, receiver: any) => {
    // TODO:
    const isExistInReactiveMap = () =>
      key === ReactiveFlags.RAW && receiver === reactiveMap.get(target);
    const isExistInReadonlyMap = () =>
      key === ReactiveFlags.RAW && receiver === readonlyMap.get(target);
    const isExistInShallowReadonlyMap = () =>
      key === ReactiveFlags.RAW && receiver === shallowReadonlyMap.get(target);

    /** 添加特殊的get属性判断 */
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    } else if (
      isExistInReactiveMap() ||
      isExistInReadonlyMap() ||
      isExistInShallowReadonlyMap()
    ) {
      return target;
    }

    const res = Reflect.get(target, key, receiver);

    if (shallow) {
      return res;
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
