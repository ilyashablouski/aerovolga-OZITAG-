class EventsObserver {
  constructor() {
    this.events = {};
  }

  observeEvent(eventName) {
    if (this.hasEvent(eventName)) return null;

    const eventInstance = {};
    eventInstance.subscribers = [];
    eventInstance.handler = function(e) {
      this.subscribers.forEach((subscriber) => subscriber(e));
    }.bind(eventInstance);
    EventsObserver.addEventHandler(eventName, eventInstance.handler);

    this.events[eventName] = eventInstance;
    return eventName;
  }

  unobserveEvent(eventName) {
    if (!this.hasEvent(eventName)) return null;

    EventsObserver.removeEventHandler(eventName, this.events[eventName].handler);
    this.events[eventName] = null;
    delete this.events[eventName];
    return eventName;
  }

  unobserveAllEvents() {
    for (let eventName in this.events) {
      if (!this.events.hasOwnProperty(eventName)) continue;
      this.unobserveEvent(eventName);
    }
  }

  subscribeToEvent(eventName, callback) {
    if (!this.hasEvent(eventName)) {
      this.observeEvent(eventName);
    }

    this.events[eventName].subscribers.push(callback);
    return eventName;
  }

  unsubscribeFromEvent(eventName, callback) {
    if (!this.hasEvent(eventName)) return null;

    const subscriberIndex = this.events[eventName].subscribers.indexOf(callback);
    if (subscriberIndex < 0) return null;

    this.events[eventName].subscribers.splice(subscriberIndex, 1);
    return eventName;
  }

  hasEvent(eventName) {
    return eventName in this.events;
  }

  static addEventHandler(eventName, handler) {
    document.addEventListener(eventName, handler);
  }

  static removeEventHandler(eventName, handler) {
    document.removeEventListener(eventName, handler);
  }

  static createInstance() {
    return new EventsObserver();
  }
}

const eventsObserver = EventsObserver.createInstance();

window.observeEvent = eventsObserver.observeEvent.bind(eventsObserver);
window.unobserveEvent = eventsObserver.unobserveEvent.bind(eventsObserver);
window.unobserveAllEvents = eventsObserver.unobserveAllEvents.bind(eventsObserver);

window.subscribeToEvent = eventsObserver.subscribeToEvent.bind(eventsObserver);
window.unsubscribeFromEvent = eventsObserver.unsubscribeFromEvent.bind(eventsObserver);
