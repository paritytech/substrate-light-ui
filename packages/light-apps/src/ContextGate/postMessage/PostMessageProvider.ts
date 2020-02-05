// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* Author: Axel Chalon @axelchalon */

import RpcCoder from '@polkadot/rpc-provider/coder';
import {
  JsonRpcResponse,
  ProviderInterface,
  ProviderInterfaceEmitCb,
  ProviderInterfaceEmitted,
} from '@polkadot/rpc-provider/types';
import { AnyJson } from '@polkadot/types/types';
import { logger } from '@polkadot/util';
import EventEmitter from 'eventemitter3';

import { PayloadResponse } from '../../../../extension-app/src/background';
import { portPostMessage, PostMessageSource, windowPostMessage } from './sources';

/**
 * @see https://github.com/polkadot-js/api/blob/master/packages/rpc-provider/src/ws/Provider.ts#L16
 */
type CallbackHandler = (error?: null | Error, value?: AnyJson) => void;

/**
 * @see https://github.com/polkadot-js/api/blob/master/packages/rpc-provider/src/ws/Provider.ts#L16
 */
interface SubscriptionHandler {
  callback: CallbackHandler;
  type: string;
}

/**
 * @see https://github.com/polkadot-js/api/blob/master/packages/rpc-provider/src/ws/Provider.ts#L23
 */
interface Handler {
  method: string;
  params: AnyJson[];
  reject: (error: Error) => void;
  resolve: (result: AnyJson) => void;
  subscription?: SubscriptionHandler;
}

const l = logger('PostMessageProvider');

/**
 * @name PostMessageProvider
 *
 * @description Extension provider to be used by dapps
 */
export class PostMessageProvider implements ProviderInterface {
  /**
   * JSONRPC encoder
   */
  private coder = new RpcCoder();

  private eventemitter: EventEmitter;

  private handlers: Record<string, Handler> = {};

  private _isConnected = false;

  /**
   * Represents either `window.postMessage` or `port.postMessage`
   */
  private source: PostMessageSource;

  /**
   * An interval to ping the background script until it is ready
   */
  private pingInterval: number;

  // Subscription IDs are (historically) not guaranteed to be globally unique;
  // only unique for a given subscription method; which is why we identify
  // the subscriptions based on subscription id + type
  private subscriptions: Record<string, SubscriptionHandler> = {}; // {[(type,subscriptionId)]: callback}

  public constructor(source: 'window' | browser.runtime.Port) {
    this.eventemitter = new EventEmitter();

    this.source = source === 'window' ? windowPostMessage() : portPostMessage(source);

    this.source.onMessage(this.handleMessage.bind(this));

    // Send a postMessage to ping the background script, until it is ready
    this.pingInterval = setInterval(() => {
      l.log('Trying to connect to the background script...');
      this.source.postMessage({
        origin: 'PostMessageProvider',
        type: 'ping',
      });
    }, 2000);
  }

  /**
   * Handle the `addListener('message')` callback
   */
  private handleMessage(message: object): void {
    // We don't do anything with messages that don't come from our background
    // script
    if (!message || (message as PayloadResponse).origin !== 'background') {
      return;
    }

    const data = message as PayloadResponse;

    if (data.type === 'pong') {
      // If we receive a pong from the background script, it means that the
      // WASM client is ready
      this._isConnected = true;
      this.emit('connected');
      clearInterval(this.pingInterval);

      return;
    }

    l.log('DOWN ⬇️', JSON.stringify(data));

    const jsonRpc = data.jsonRpc;

    // A subscription response has a `method` field
    if (jsonRpc.method) {
      this.handleSubscribe(jsonRpc);
    } else {
      this.handleSingle(jsonRpc);
    }
  }

  private handleSingle(jsonRpc: JsonRpcResponse): void {
    const handler = this.handlers[jsonRpc.id];
    if (!handler) {
      return;
    }

    try {
      // first send the result - in case of subs, we may have an update
      // immediately if we have some queued results already
      handler.resolve(jsonRpc.result);
    } catch (error) {
      handler.reject(new Error(jsonRpc.error?.message));
    }

    delete this.handlers[jsonRpc.id];
  }

  private handleSubscribe(jsonRpc: JsonRpcResponse): void {
    const subId = `${jsonRpc.method}::${jsonRpc.params.subscription}`;

    if (!this.subscriptions[subId]) {
      const handler = this.handlers[jsonRpc.id];
      if (!handler || !handler.subscription) {
        l.warn(`handleSubscribe: handler ${jsonRpc.id} doesn't have a subscription, but it should have`);

        return;
      }

      this.subscriptions[subId] = handler.subscription;
    }

    this.subscriptions[subId].callback(null, jsonRpc.params.result);
  }

  /**
   * @summary Whether the node is connected or not.
   * @return true if connected
   */
  public isConnected(): boolean {
    return this._isConnected;
  }

  /**
   * @description Manually disconnect from the connection, clearing autoconnect logic
   */
  public disconnect(): void {
    this.source.unsubscribe(this.handleMessage.bind(this));
  }

  /**
   * @summary Listens on events after having subscribed using the [[subscribe]] function.
   * @param type Event
   * @param sub  Callback
   */
  public on(type: ProviderInterfaceEmitted, sub: ProviderInterfaceEmitCb): () => void {
    this.eventemitter.on(type, sub);

    return (): void => {
      this.eventemitter.removeListener(type, sub);
    };
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
    return new PostMessageProvider(this.source.source);
  }

  private sendRequest(method: string, params: AnyJson[], subscription?: SubscriptionHandler): Promise<AnyJson> {
    return new Promise((resolve, reject): void => {
      try {
        const jsonRpc = this.coder.encodeObject(method, params);
        const id = this.coder.getId();

        this.handlers[id] = {
          method,
          params,
          resolve,
          reject,
          subscription,
        };

        l.log('UP ⬆️', JSON.stringify(jsonRpc));

        this.source.postMessage({
          origin: 'PostMessageProvider',
          jsonRpc,
          type: subscription ? 'rpc.sendSubscribe' : 'rpc.send',
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public async send(method: string, params: AnyJson[], subscription?: SubscriptionHandler): Promise<AnyJson> {
    if (subscription) {
      const subscriptionId = (await this.sendRequest(method, params, subscription)) as number;
      this.subscriptions[`${subscription.type}::${subscriptionId}`] = subscription;

      return subscriptionId;
    } else {
      return this.sendRequest(method, params);
    }
  }

  public async subscribe(type: string, method: string, params: AnyJson[], callback: CallbackHandler): Promise<number> {
    const id = await this.send(method, params, { type, callback });

    return id as number;
  }

  /**
   * @summary Allows unsubscribing to subscriptions made with [[subscribe]].
   */
  public async unsubscribe(type: string, method: string, id: number): Promise<boolean> {
    const subscription = `${type}::${id}`;

    // FIXME This now could happen with re-subscriptions. The issue is that with a re-sub
    // the assigned id now does not match what the API user originally received. It has
    // a slight complication in solving - since we cannot rely on the send id, but rather
    // need to find the actual subscription id to map it
    if (!this.subscriptions[subscription]) {
      l.debug((): string => `Unable to find active subscription=${subscription}`);

      return false;
    }

    delete this.subscriptions[subscription];

    const result = await this.send(method, [id]);

    return result as boolean;
  }
}
