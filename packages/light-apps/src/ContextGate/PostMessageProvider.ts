// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
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
import { AnyFunction, AnyJson } from '@polkadot/types/types';
import EventEmitter from 'eventemitter3';

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
  callback: CallbackHandler;
  method: string;
  params: AnyJson[];
  subscription?: SubscriptionHandler;
}

/**
 * @name PostMessageProvider
 *
 * @description Extension provider to be used by dapps
 */
export default class PostMessageProvider implements ProviderInterface {
  private eventemitter: EventEmitter;
  private handlers: Record<string, Handler> = {};
  private coder = new RpcCoder();

  // Subscription IDs are (historically) not guaranteed to be globally unique;
  // only unique for a given subscription method; which is why we identify
  // the subscriptions based on subscription id + type
  private subscriptions: Record<string, AnyFunction> = {}; // {[(type,subscriptionId)]: callback}

  public constructor() {
    this.eventemitter = new EventEmitter();

    window.addEventListener('message', this.handleMessage.bind(this));

    // Give subscribers time to subscribe
    setTimeout((): void => {
      this.emit('connected');
    });
  }

  /**
   * Handle the `addListener('message')` callback
   */
  private handleMessage({ data }: MessageEvent): void {
    // We don't do anything with messages that don't come from our background
    // script
    if (!data || data.origin !== 'background') {
      return;
    }

    console.log("window.addEventListener('message')", data);
    if (data.method) {
      this.handleSingle(data);
    } else {
      this.handleSubscribe(data);
    }
  }

  private handleSingle(response: JsonRpcResponse): void {
    console.log('handleSingle', response);
    // const handler = this.handlers[response.id];
    // if (!handler) {
    //   return;
    // }
    // const { method, params, subscription } = handler;
    // handler.callback(null, response);
    // console.log('handleSingle() -> ', data);
    // if (data.subscription) {
    //   console.log('data was subscription!');
    //   (handler.subscriber as Function)(data.subscription);
    // } else if (data.error) {
    //   handler.reject(new Error(data.error));
    // } else {
    //   handler.resolve(data.result);
    // }
  }

  private handleSubscribe(message: JsonRpcResponse): void {
    console.log('handleSubscribe', message);

    // console.log('handleSubscribe', message);
    // const { subscriptionId, result, type } = message;
    // console.log('sub => ', this.subscriptions[`${type}::${subscriptionId}`]);
    // if (!this.subscriptions[`${type}::${subscriptionId}`]) {
    //   console.error('Received notification for unknown subscription id', message);
    //   return;
    // }
    // this.subscriptions[`${type}::${subscriptionId}`](null, result);
  }

  /**
   * @summary Whether the node is connected or not.
   * @return true if connected
   */
  public isConnected(): boolean {
    return true; // underlying WsProvider connects on first RPC request
  }

  /**
   * @description Manually disconnect from the connection, clearing autoconnect logic
   */
  public disconnect(): void {
    window.removeEventListener('message', this.handleMessage.bind(this));
  }

  /**
   * @summary Listens on events after having subscribed using the [[subscribe]] function.
   * @param type Event
   * @param sub  Callback
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

  public send(method: string, params: AnyJson[], subscription?: SubscriptionHandler): Promise<AnyJson> {
    return new Promise((resolve, reject): void => {
      try {
        const jsonRpc = this.coder.encodeObject(method, params);
        const id = this.coder.getId();
        const callback = (error?: Error | null, result?: AnyJson): void => {
          error ? reject(error) : resolve(result);
        };

        this.handlers[id] = {
          callback,
          method,
          params,
          subscription,
        };

        window.postMessage(
          {
            origin: 'PostMessageProvider',
            jsonRpc,
            type: subscription ? 'rpc.sendSubscribe' : 'rpc.send',
          },
          '*'
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  public async subscribe(type: string, method: string, params: AnyJson[], callback: AnyFunction): Promise<number> {
    const id = await this.send(method, params, { type, callback });

    return id as number;
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
}
