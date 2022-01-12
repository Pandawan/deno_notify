import { Plug } from "https://deno.land/x/plug@0.4.1/mod.ts";

const VERSION = "1.1.2";
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
  notify_send: { parameters: ["pointer", "usize"], result: "u8" },
});

export { library };
