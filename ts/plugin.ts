import { CacheSetting, dlopen } from "https://deno.land/x/plug@1.0.0/mod.ts";

const VERSION = "1.4.2";
const CACHE_POLICY: CacheSetting =
  Deno.env.get("NOTIFY_PLUGIN_URL") === undefined ? "use" : "reloadAll";
const NOTIFY_PLUGIN_URL = Deno.env.get("NOTIFY_PLUGIN_URL") ??
  `https://github.com/Pandawan/deno_notify/releases/download/${VERSION}/`;

const library = await dlopen({
  name: "deno_notify",
  url: NOTIFY_PLUGIN_URL,
  cache: CACHE_POLICY,
  suffixes: {
    darwin: `.${Deno.build.arch}`,
  },
}, {
  notify_send: { parameters: ["buffer", "usize"], result: "buffer" },
});

// TODO: Check out https://github.com/webview/webview_deno/blob/main/src/ffi.ts
function readPointer(v: Deno.PointerValue): Uint8Array {
  const ptr = new Deno.UnsafePointerView(v);
  const lengthBe = new Uint8Array(4);
  const view = new DataView(lengthBe.buffer);
  ptr.copyInto(lengthBe, 0);
  const buf = new Uint8Array(view.getUint32(0));
  ptr.copyInto(buf, 4);
  return buf;
}

type NotifySendResult = {
  type: "success";
} | {
  type: "error";
  when: string;
  message: string;
};

function notify_send(json: string): NotifySendResult {
  const encodedJson = new TextEncoder().encode(json);
  const ptrResult = library.symbols.notify_send(
    encodedJson,
    encodedJson.length,
  );
  // TODO: Use Deno.UnsafePointerView#getCString
  const decodedJson = new TextDecoder().decode(readPointer(ptrResult));
  const result = JSON.parse(decodedJson);
  return result as NotifySendResult;
}

export { notify_send };
