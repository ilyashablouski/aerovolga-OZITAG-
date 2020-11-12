export function dispatchEvent(eventName, data) {
  let event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}
