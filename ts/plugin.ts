import { Plug } from "https://deno.land/x/plug@0.5.1/mod.ts";

const VERSION = "1.2.0";
const POLICY = Deno.env.get("NOTIFY_PLUGIN_URL") === undefined
  ? Plug.CachePolicy.STORE
  : Plug.CachePolicy.NONE;
const NOTIFY_PLUGIN_URL = Deno.env.get("NOTIFY_PLUGIN_URL") ??
  `https://github.com/Pandawan/deno_notify/releases/download/${VERSION}/`;

const library = await Plug.prepare({
  name: "deno_notify",
  url: NOTIFY_PLUGIN_URL,
  policy: POLICY,
}, {
  notify_send: { parameters: ["pointer", "usize"], result: "pointer" },
});

function readPointer(v: any): Uint8Array {
  const ptr = new Deno.UnsafePointerView(v as Deno.UnsafePointer);
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
  const decodedJson = new TextDecoder().decode(readPointer(ptrResult));
  const result = JSON.parse(decodedJson);
  return result as NotifySendResult;
}

export { notify_send };
