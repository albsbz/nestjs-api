export const ProxyLogger = <T>(instance): T => {
  if (!instance.configService?.get('debug')) {
    return instance;
  }
  return new Proxy(instance, {
    get(target, prop, receiver): unknown {
      if (typeof target[prop] === 'function') {
        target[prop] = new Proxy(target[prop], {
          apply(target, thisArg, argArray): unknown {
            if (instance.logger) {
              instance.logger.log(
                `${thisArg.constructor.name}, method ${target.name}`,
                argArray,
              );
            }
            return Reflect.apply(target, thisArg, argArray);
          },
        });
      }
      return Reflect.get(target, prop, receiver);
    },
  });
};
