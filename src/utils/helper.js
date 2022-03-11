const storage = window.localStorage;

export const STORAGE_KEY = 'products_cart';

export const getItem = (key, defaultValue) => {
  try {
    const storedValue = storage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

export const setItem = (key, value) => {
  storage.setItem(key, JSON.stringify(value));
};

export const removeItem = key => {
  storage.removeItem(key);
};

export const qs = (selector, scope) => {
  if (!selector) throw 'no selector';

  return scope.querySelector(selector);
};

export const qsAll = (selector, scope) => {
  if (!selector) throw 'no selector';

  return Array.from(scope.querySelectorAll(selector));
};

export const on = (target, eventName, handler) => {
  target.addEventListener(eventName, handler);
};

export const checkSame = (jsonA, jsonB) => {
  return JSON.stringify(jsonA) === JSON.stringify(jsonB);
};
