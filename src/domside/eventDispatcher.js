const events = {};

export function listen(event, fn, { once = false } = {}) {
  events[event] = events[event] || [];
  events[event].push({
    fn,
    once,
  });
}

export function listenOnce(event, fn) {
  listen(event, fn, { once: true });
}

export function dispatch(event, ...data) {
  (events[event] || []).forEach((fnObj) => {
    fnObj.fn(...data);
  });
  events[event] = (events[event] || []).filter((fnObj) => !fnObj.once);
}
