import { prepare, deferred } from "./deps.ts";
import { resolve } from "https://deno.land/std@v0.50.0/path/mod.ts";

let DENO_NOTIFS_PLUGIN_BASE = Deno.env.get("DENO_NOTIFS_PLUGIN_BASE");
export const PLUGIN_URL_BASE = DENO_NOTIFS_PLUGIN_BASE
  ? resolvePathToURL(DENO_NOTIFS_PLUGIN_BASE)
  : "https://github.com/PandawanFr/deno_notifs/releases/download/0.1.0";

let DENO_NOTIFS_PLUGIN = Deno.env.get("DENO_NOTIFS_PLUGIN");
const PLUGIN_URL = DENO_NOTIFS_PLUGIN
  ? resolvePathToURL(DENO_NOTIFS_PLUGIN)
  : undefined;
const DEBUG = Boolean(Deno.env.get("DENO_NOTIFS_DEBUG"));

let pluginId: number | null = null;

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

function resolvePathToURL(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    let resolvedPath = resolve(path);
    return "file://" + resolvedPath;
  }
}

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
    throw `Bad op id for ${op}`;
  }

  return id;
}

export function opSync<R extends NotifsResponse<any>>(
  op: string,
  data: object,
): R {
  if (pluginId === null) {
    throw "The plugin must be initialized before use";
  }

  const opId = getOpId(op);
  const response = core.dispatch(opId, encode(data))!;

  return decode(response) as R;
}

export async function opAsync<R extends NotifsResponse<any>>(
  op: string,
  data: object,
): Promise<R> {
  if (pluginId === null) {
    throw "The plugin must be initialized before use";
  }

  const opId = getOpId(op);
  const promise = deferred<R>();

  core.setAsyncHandler(
    opId,
    (response) => promise.resolve(decode(response) as R),
  );

  const response = core.dispatch(opId, encode(data));

  if (response != null || response != undefined) {
    throw "Expected null response!";
  }

  return promise;
}

export function unwrapResponse<T, R extends NotifsResponse<T>>(response: R): T {
  if (response.err) {
    throw response.err;
  }

  if (response.ok) {
    return response.ok;
  }

  throw "Invalid response";
}

/**
 * Load the plugin
 */
export async function load(cache = true, verbose = false) {
  unload();
  pluginId = await prepare({
    name: "deno_notifs",
    checkCache: cache,
    printLog: verbose,
    urls: {
      darwin: PLUGIN_URL || `${PLUGIN_URL_BASE}/libdeno_notifs.dylib`,
      windows: PLUGIN_URL || `${PLUGIN_URL_BASE}/deno_notifs.dll`,
      linux: PLUGIN_URL || `${PLUGIN_URL_BASE}/libdeno_notifs.so`,
    },
  });
}

/**
 * Free the plugin resource
 */
export function unload(): void {
  if (pluginId !== null) Deno.close(pluginId);
  pluginId = null;
}

export interface NotifsResponse<T> {
  err?: string;
  ok?: T;
}

await load(!DEBUG, DEBUG);
window.addEventListener("unload", unload);
