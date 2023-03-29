const EventEmitter = require('events');
const EventTarget = require('./event-target');
const debug = require('debug')('@hyoga/uni-socket');

const readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];

const nameSpace = uni || wx;

class WebSocket extends EventEmitter {
  constructor(address, protocols, options) {
    super();
    this._readyState = WebSocket.CONNECTING;
    this._socket = null;

    if (address !== null) {
      if (Array.isArray(protocols)) {
        protocols = protocols.join(', ');
      } else if (typeof protocols === 'object' && protocols !== null) {
        options = protocols;
        protocols = undefined;
      }

      this.initAsClient(address, protocols, options);
    }
  }

  /**
   *
   * @param {String} address
   * @param {String} protocols
   * @param {Object} options
   */
  initAsClient(address, protocols, options) {
    Object.assign(options, {
      url: address,
      header: {
        'content-type': 'application/json',
      },
      protocols,
      timeout: 25000,
    });
    this._socket = this.createConnection(options);
    this.addSocketEventListeners();
  }

  createConnection(options) {
    const socketTask = nameSpace.connectSocket({
      complete: () => {},
      ...options,
    });
    // return {
    //   onOpen: socketTask.onOpen,
    //   onClose: socketTask.onClose,
    //   onError: socketTask.onError,
    //   onMessage: socketTask.onMessage,
    //   send: socketTask.send,
    //   close: socketTask.close,
    // };
    return socketTask;
  }

  addSocketEventListeners() {
    this._socket.onOpen(() => {
      this._readyState = WebSocket.OPEN;
      this.onopen();
    });

    this._socket.onClose((res) => {
      debug('onclose: ', res);
      this._readyState = WebSocket.CLOSED;
      this.onclose(res.code, res.reason);
    });

    this._socket.onError((res) => {
      debug('onerror: ', res);
      this.onerror(res);
    });

    this._socket.onMessage((data) => {
      this.onmessage(data);
    });
  }

  send(data) {
    debug('send data: ', data, this._readyState);
    if (this._readyState === WebSocket.CONNECTING) {
      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
    }
    if (typeof data === 'number') data = data.toString();

    if (this._readyState === WebSocket.OPEN) {
      this._socket.send({ data });
    }
  }

  close(code, reason) {
    debug('close socket: ', code, reason);
    this._readyState = WebSocket.CLOSING;
    this._socket.close({
      code,
      reason,
    });
  }
}

readyStates.forEach((readyState, i) => {
  WebSocket[readyState] = i;
});

const eventArr = ['open', 'error', 'close', 'message'];
eventArr.forEach((method) => {
  Object.defineProperty(WebSocket.prototype, `on${method}`, {
    /**
     * Return the listener of the event.
     *
     * @return {(Function|undefined)} The event listener or `undefined`
     * @public
     */
    get() {
      const listeners = this.listeners(method);
      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i]._listener) return listeners[i]._listener;
      }
    },
    /**
     * Add a listener for the event.
     *
     * @param {Function} listener The listener to add
     * @public
     */
    set(listener) {
      const listeners = this.listeners(method);
      for (var i = 0; i < listeners.length; i++) {
        //
        // Remove only the listeners added via `addEventListener`.
        //
        if (listeners[i]._listener) this.removeListener(method, listeners[i]);
      }
      this.addEventListener(method, listener);
    },
  });
});

WebSocket.prototype.addEventListener = EventTarget.addEventListener;
WebSocket.prototype.removeEventListener = EventTarget.removeEventListener;

module.exports = WebSocket;
