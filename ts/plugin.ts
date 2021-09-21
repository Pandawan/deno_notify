import { Plug } from "./deps.ts";

const VERSION = "1.0.0";
const POLICY = Deno.env.get("PLUGIN_URL") === undefined
  ? Plug.CachePolicy.STORE
  : Plug.CachePolicy.NONE;
const PLUGIN_URL = Deno.env.get("PLUGIN_URL") ??
  `https://github.com/Pandawan/deno_notify/releases/download/${VERSION}/`;

await Plug.prepare({
  name: "deno_notify",
  url: PLUGIN_URL,
  policy: POLICY,
});
