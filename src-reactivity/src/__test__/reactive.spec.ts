import { isReactive, reactive, toRaw } from "../reactive";

describe("reactive.spec", () => {
  it("should", () => {
    const original = { foo: 0 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);

    expect(isReactive(original)).toBe(false);
    expect(isReactive(observed)).toBe(true);

    expect(observed.foo).toEqual(0);
    // TODO: 这些操作符啥意思
    expect("foo" in observed).toEqual(true);
    expect(Object.keys(observed)).toEqual(["foo"]);
  });

  it("should nested", () => {
    const original = { nested: { foo: 0 }, array: [{ bar: 1 }] };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  });

  it("should toRaw", () => {
    const original = { foo: 0 };
    const observed = reactive(original);
    expect(toRaw(observed)).toBe(original);
    expect(toRaw(original)).toBe(original);
  });
});
