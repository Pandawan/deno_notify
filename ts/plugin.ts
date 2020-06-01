import { deferred } from "https://deno.land/std@0.54.0/async/mod.ts";

// @ts-ignore
const core = Deno.core as {
  ops: () => { [key: string]: number };
  setAsyncHandler(rid: number, handler: (response: Uint8Array) => void): void;
  dispatch(
    rid: number,
    msg: any,
    buf?: ArrayBufferView,
  ): Uint8Array | undefined;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function decode(data: Uint8Array): object {
  const text = decoder.decode(data);
  return JSON.parse(text);
}

function encode(data: object): Uint8Array {
  const text = JSON.stringify(data);
  return encoder.encode(text);
}

function getOpId(op: string): number {
  const id = core.ops()[op];

  if (!(id > 0)) {
    throw new Error(
      `Bad op id for \"${op}\". Are you sure the plugin is loaded?`,
    );
  }

  return id;
}

export interface PluginResponse<T> {
  err?: string;
  ok?: T;
}

export function opSync<R extends PluginResponse<any>>(
  op: string,
  data: object,
): R {
  const opId = getOpId(op);
  const response = core.dispatch(opId, encode(data))!;

  return decode(response) as R;
}

export async function opAsync<R extends PluginResponse<any>>(
  op: string,
  data: object,
): Promise<R> {
  const opId = getOpId(op);
  const promise = deferred<R>();

  core.setAsyncHandler(
    opId,
    (response) => promise.resolve(decode(response) as R),
  );

  const response = core.dispatch(opId, encode(data));

  if (response != null || response != undefined) {
    throw new Error("Expected null response!");
  }

  return promise;
}

export function unwrapResponse<T, R extends PluginResponse<T>>(response: R): T {
  if (response.err) {
    throw response.err;
  }

  if (response.ok) {
    return response.ok;
  }

  throw new Error("Invalid response");
}
