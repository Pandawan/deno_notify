import { Plug } from "./deps.ts";

const VERSION = "1.0.1";
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
  notify_send: { parameters: ["buffer", "usize"], result: "u8" },
});

export { library };
