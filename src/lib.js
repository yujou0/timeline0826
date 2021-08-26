/**
 * Extend object
 * @param {*} target - The target object to extend.
 * @param {*} args - The rest objects for merging to the target object.
 * @returns {Object} The extended object.
 */
export const assign =
  Object.assign ||
  function assign(target, ...args) {
    if ($.isPlainObject(target) && args.length > 0) {
      args.forEach((arg) => {
        if ($.isPlainObject(arg)) {
          Object.keys(arg).forEach((key) => {
            target[key] = arg[key];
          });
        }
      });
    }
    return target;
  };
