/** object assign的一个简单封装 */
export const extend = Object.assign;

export const isObject = (source: any) =>
  source != null && typeof source == "object";
