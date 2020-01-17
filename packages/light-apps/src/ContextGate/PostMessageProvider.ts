// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* Author: Axel Chalon @axelchalon */

import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { AnyFunction } from '@polkadot/types/types';
import EventEmitter from 'eventemitter3';

import { SendRequest, TransportSubscriptionNotification } from '../../../extension-app/src/types';
import { sendMessage } from './messageHandlers';

type ProviderInterfaceEmitted = 'connected' | 'disconnected' | 'error';

// This EventEmitter gets triggered when subscription messages are received
// from the extension. It then dispatches the event to its subscriber,
// PostMessageProvider.
export class SubscriptionNotificationHandler extends EventEmitter {}
const subscriptionNotificationHandler = new SubscriptionNotificationHandler();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProviderInterfaceEmitCb = (value?: any) => any;

/**
 * @name PostMessageProvider
 *
 * @description Extension provider to be used by dapps
 */
export default class PostMessageProvider implements ProviderInterface {
  private _eventemitter: EventEmitter;

  private _sendRequest: SendRequest;

  private _subscriptionNotificationHandler: SubscriptionNotificationHandler;

  // Subscription IDs are (historically) not guaranteed to be globally unique;
  // only unique for a given subscription method; which is why we identify
  // the subscriptions based on subscription id + type
  private _subscriptions: Record<string, AnyFunction> = {}; // {[(type,subscriptionId)]: callback}

  public constructor() {
    this._eventemitter = new EventEmitter();
    this._sendRequest = sendMessage; /* sendRequest()  The function to be called to send requests to the node */
    this._subscriptionNotificationHandler = subscriptionNotificationHandler;
    this._subscriptionNotificationHandler.on(
      'message',
      this.onSubscriptionNotification.bind(this)
    ); /* subscriptionNotificationHandler() Channel for receiving subscription messages */

    // Give subscribers time to subscribe
    setTimeout((): void => {
      this.emit('connected');
    });
  }

  private onSubscriptionNotification(message: TransportSubscriptionNotification): void {
    const { subscriptionId, result, type } = message;
    if (!this._subscriptions[`${type}::${subscriptionId}`]) {
      console.error('Received notification for unknown subscription id', message);
      return;
    }

    this._subscriptions[`${type}::${subscriptionId}`](null, result);
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
    this._eventemitter.on(type, sub);
  }

  private emit(type: ProviderInterfaceEmitted, ...args: any[]): void {
    this._eventemitter.emit(type, ...args);
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

  public async send(method: string, params: any[], subInfos?: any): Promise<any> {
    if (subInfos) {
      const { callback, type } = subInfos;

      console.log('rpc.sendSubscribe (subinfos) -> ', method, params, subInfos);
      // debugger;

      return this._sendRequest('rpc.sendSubscribe', { type, method, params }).then(
        <TSubscriptionId extends string>(subscriptionId: TSubscriptionId): TSubscriptionId => {
          this._subscriptions[`${type}::${subscriptionId}`] = callback;
          return subscriptionId;
        }
      );
    } else {
      console.log(`PostMessageProvider send() -> method: ${method}, params: ${params}`);
      
      this._sendRequest('rpc.send', { method, params })
        .then(result => {
          console.log('PostMessageProvider result -> ', JSON.stringify(result))
          return result;
        });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async subscribe(type: string, method: string, params: any[], callback: AnyFunction): Promise<number> {
    const id = await this.send(method, params, { type, callback });

    return id as number;
  }

  /**
   * @summary Allows unsubscribing to subscriptions made with [[subscribe]].
   */
  public async unsubscribe(type: string, method: string, id: number): Promise<boolean> {
    if (!this._subscriptions[`${type}::${id}`]) {
      console.error('Tried unsubscribing to unexisting subscription', id);
      return false;
    }

    delete this._subscriptions[`${type}::${id}`];

    const result = await this.send(method, [id]);

    return result as boolean;
  }
}
