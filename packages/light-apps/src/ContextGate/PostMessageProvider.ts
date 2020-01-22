// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* Author: Axel Chalon @axelchalon */

import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { AnyFunction, AnyJson } from '@polkadot/types/types';
import EventEmitter from 'eventemitter3';

import { TransportSubscriptionNotification } from '../../../extension-app/src/types';

interface Handler {
  resolve: (data: any) => void;
  reject: (error: Error) => void;
  subscriber?: (data: any) => void;
}

type Handlers = Record<string, Handler>;

type ProviderInterfaceEmitted = 'connected' | 'disconnected' | 'error';

// This EventEmitter gets triggered when subscription messages are received
// from the extension. It then dispatches the event to its subscriber,
// PostMessageProvider.
class SubscriptionNotificationHandler extends EventEmitter { }
export const subscriptionNotificationHandler = new SubscriptionNotificationHandler();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProviderInterfaceEmitCb = (value?: any) => any;

/**
 * @name PostMessageProvider
 *
 * @description Extension provider to be used by dapps
 */
export default class PostMessageProvider implements ProviderInterface {
  private eventemitter: EventEmitter;
  private handlers: Handlers = {};
  private id = 1;

  private _subscriptionNotificationHandler: SubscriptionNotificationHandler;

  // Subscription IDs are (historically) not guaranteed to be globally unique;
  // only unique for a given subscription method; which is why we identify
  // the subscriptions based on subscription id + type
  private subscriptions: Record<string, AnyFunction> = {}; // {[(type,subscriptionId)]: callback}

  public constructor() {
    this.eventemitter = new EventEmitter();

    this._subscriptionNotificationHandler = subscriptionNotificationHandler;
    this._subscriptionNotificationHandler.on(
      'message',
      this.onSubscriptionNotification.bind(this)
    ); /* subscriptionNotificationHandler() Channel for receiving subscription messages */

    window.addEventListener('message', ({ data }) => {
      if (data && data.origin === 'PostMessageProvider') {
        return;
      }

      console.log("window.addEventListener('message')", data);
      try {
        const parsedData = JSON.parse(data);
        console.log('message handler data => ', parsedData);
        if (parsedData.id) {
          this.handleResponse(parsedData);
        } else {
          console.log('data for notifications -> ', parsedData);
          this.handleSubscriptionNotification(parsedData as TransportSubscriptionNotification);
        }
      } catch (err) {
        data && console.warn('ignoring message', data);
      }
    });

    // Give subscribers time to subscribe
    setTimeout((): void => {
      this.emit('connected');
    });
  }

  private onSubscriptionNotification(message: TransportSubscriptionNotification): void {
    console.log('@light-apps: on subscription notificatoin -=> ', message);

    const { subscriptionId, result, type } = message;

    console.log(' all the subs => ', this.subscriptions);
    console.log('sub => ', this.subscriptions[`${type}::${subscriptionId}`]);

    if (!this.subscriptions[`${type}::${subscriptionId}`]) {
      console.error('Received notification for unknown subscription id', message);
      return;
    }

    this.subscriptions[`${type}::${subscriptionId}`](null, result);
  }

  /**
   * @summary Whether the node is connected or not.
   * @return {boolean} true if connected
   */
  public isConnected(): boolean {
    return true; // underlying WsProvider connects on first RPC request
  }

  /**
   * @description Manually disconnect from the connection, clearing autoconnect logic
   */
  public disconnect(): void {
    console.error('PostMessageProvider.disconnect() is not implemented.');
    // noop -- the underlying WsProvider connection will be closed when the page
    // closes
  }

  /**
   * @summary Listens on events after having subscribed using the [[subscribe]] function.
   * @param  {ProviderInterfaceEmitted} type Event
   * @param  {ProviderInterfaceEmitCb}  sub  Callback
   */
  public on(type: ProviderInterfaceEmitted, sub: ProviderInterfaceEmitCb): void {
    this.eventemitter.on(type, sub);
  }

  private emit(type: ProviderInterfaceEmitted, ...args: AnyJson[]): void {
    this.eventemitter.emit(type, ...args);
  }

  /**
   * @summary `true` when this provider supports subscriptions
   */
  public get hasSubscriptions(): boolean {
    return true;
  }

  /**
   * @description Returns a clone of the object
   */
  public clone(): PostMessageProvider {
    return new PostMessageProvider();
  }

  private _sendRequest(message: string, request?: AnyJson, subscriber?: (data: any) => void): Promise<number> {
    return new Promise((resolve, reject) => {
      this.id++;

      this.handlers[this.id] = { resolve, reject, subscriber };

      const transportRequestMessage = {
        id: this.id,
        message,
        origin: 'PostMessageProvider',
        request: request || null,
      };

      console.log(`(window.postMessage) -> ${JSON.stringify(transportRequestMessage)}`);

      window.postMessage(transportRequestMessage, '*');

      return this.id;
    });
  }

  public async send(method: string, params: AnyJson[], subInfos?: any): Promise<number> {
    if (subInfos) {
      const { callback, type } = subInfos;

      console.log('(subinfos) -> ', method, params, subInfos);

      return this._sendRequest('rpc.sendSubscribe', { type, method, params }).then(result => {
        console.log('inside send subscribe !! ', result);
        this.subscriptions[`${type}::${result}`] = callback;

        return result;
      });
    } else {
      return this._sendRequest('rpc.send', { method, params }).then(result => {
        console.log('rpc send got a result => ', result);

        return result;
      });
    }
  }

  public async subscribe(type: string, method: string, params: AnyJson[], callback: AnyFunction): Promise<number> {
    const id = await this.send(method, params, { type, callback });

    return id;
  }

  /**
   * @summary Allows unsubscribing to subscriptions made with [[subscribe]].
   */
  public unsubscribe(type: string, _method: string, id: number): Promise<boolean> {
    if (!this.subscriptions[id]) {
      console.error('Tried unsubscribing to unexisting subscription', id);
      return Promise.resolve(false);
    }

    delete this.subscriptions[`${type}::${id}`];

    return Promise.resolve(true);
  }

  handleSubscriptionNotification(data: TransportSubscriptionNotification) {
    subscriptionNotificationHandler.emit('message', data);
  }

  handleResponse(data: any): void {
    const handler = this.handlers[data.id];

    if (!handler) {
      console.error(`Unknown response: ${JSON.stringify(data)}`);
      return;
    }

    if (!handler.subscriber) {
      delete this.handlers[data.id];
    }

    console.log('handleResponse() -> ', data);

    if (data.subscription) {
      console.log('data was subscription!');
      (handler.subscriber as Function)(data.subscription);
    } else if (data.error) {
      handler.reject(new Error(data.error));
    } else {
      handler.resolve(data.result);
    }
  }
}
