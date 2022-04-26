import { extend } from "./share";

type Deps = Set<ReactiveEffect>;
type DepsMap = Map<any, Deps>;

/** 标志 */
let activeEffect: ReactiveEffect | undefined;
let shouldTrack = false;
const targetMap = new WeakMap<object, DepsMap>();

const isTracking = (): boolean => shouldTrack && !!activeEffect;

const cleanupEffect = (effect: ReactiveEffect) => {
  effect.deps.forEach((d) => {
    d.delete(effect);
  });
  effect.deps.length = 0;
};

/** 新建一个响应对象集合 */
const createDep = (effects?: ReactiveEffect[]) => new Set(effects);

export class ReactiveEffect {
  /** 收集开关 */
  active = true;
  deps: Deps[] = [];

  //TODO: ?
  public onStop?: () => void;
  constructor(public fn, public scheduler?) {
    console.log("ReactiveEffect init.");
  }

  run() {
    console.log("run");
    if (this.active) {
      //
      shouldTrack = true;
      activeEffect = this;
      const res = this.fn();
      shouldTrack = false;
      activeEffect = undefined;
      return res;
    } else {
      return this.fn();
    }
  }

  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

export const effect = (fn, option = {}) => {
  const _effect = new ReactiveEffect(fn);
  extend(_effect, option);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
};

export const stop = (runner) => {
  runner.effect.stop();
};

/** 收集依赖 全局的响应影响对象 */
export const trackEffects = (deps: Deps) => {
  if (activeEffect) {
    if (!deps.has(activeEffect)) {
      deps.add(activeEffect);
      activeEffect.deps.push(deps);
    }
  }
};

/** 收集依赖 */
export const track = (target: any, type: "get" | "set", key) => {
  if (isTracking()) {
    return;
  }
  console.log("track", target, type, key);
  /** 两层map */
  let depsMap: DepsMap;
  let deps: Deps;

  /** 缓存 */
  const existDepsMap = targetMap.get(target);
  if (existDepsMap) {
    depsMap = existDepsMap;
  } else {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  const existDeps = depsMap.get(key);
  if (existDeps) {
    deps = existDeps;
  } else {
    deps = createDep();
    depsMap.set(key, deps);
  }

  trackEffects(deps);
};

/** 调起run */
const triggerEffects = (deps: Deps) => {
  for (const effect of deps) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
};

export const trigger = (target, type, key) => {
  const depsArray: Deps[] = [];
  const existDepsMap = targetMap.get(target);
  if (!existDepsMap) {
    return;
  }
  const deps = existDepsMap.get(key);
  if (deps) {
    depsArray.push(deps);
    /** 扁平化flattening 提取所有元素 */
    const effects: ReactiveEffect[] = [];
    //TODO: 也就一个啊？
    depsArray.forEach((d) => {
      effects.push(...Array.from(d));
    });

    triggerEffects(createDep(effects));
  }
};
