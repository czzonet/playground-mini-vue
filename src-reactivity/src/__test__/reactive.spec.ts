import { isReactive, reactive } from "../reactive";

describe("reactive.spec", () => {
  it("should", () => {
    const original = { foo: 0 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);

    expect(isReactive(original)).toBe(false);
    expect(isReactive(observed)).toBe(true);

    expect(observed.foo).toEqual(0);
    // TODO: ?
    expect("foo" in observed).toEqual(true);
    expect(Object.keys(observed)).toEqual(["foo"]);
  });
});
