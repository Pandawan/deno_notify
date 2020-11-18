import { prepare } from "https://deno.land/x/plugin_prepare@v0.8.0/mod.ts";
import { resolve } from "https://deno.land/std@0.78.0/path/mod.ts";

export * from "./mod.ts";

const releaseUrl =
  "https://github.com/Pandawan/deno_notify/releases/download/0.4.4";

/**
 * Don't require env permissions if they're not given.
 * This means the DENO_NOTIF_ environment variables are only active if --allow-env is passed.
 */
const hasEnvironmentPermissions =
  (await Deno.permissions.query({ name: "env" })).state === "granted";

let DENO_NOTIFY_PLUGIN_BASE = hasEnvironmentPermissions
  ? Deno.env.get("DENO_NOTIFY_PLUGIN_BASE")
  : undefined;
export const PLUGIN_URL_BASE = DENO_NOTIFY_PLUGIN_BASE
  ? resolvePathToURL(DENO_NOTIFY_PLUGIN_BASE)
  : releaseUrl;

let DENO_NOTIFY_PLUGIN = hasEnvironmentPermissions
  ? Deno.env.get("DENO_NOTIFY_PLUGIN")
  : undefined;
const PLUGIN_URL = DENO_NOTIFY_PLUGIN
  ? resolvePathToURL(DENO_NOTIFY_PLUGIN)
  : undefined;
const DEBUG = hasEnvironmentPermissions
  ? Boolean(Deno.env.get("DENO_NOTIFY_DEBUG"))
  : false;

/**
 * Resolves local paths to file:// URLs, leaving any other type of path as is.
 * @param path The path to resolve
 */
function resolvePathToURL(path: string) {
  if (
    path.startsWith("http://") || path.startsWith("https://") ||
    path.startsWith("file://")
  ) {
    return path;
  } else {
    let resolvedPath = resolve(path);
    return "file://" + resolvedPath;
  }
}

/**
 * Load the plugin
 */
async function load(cache = true, verbose = false): Promise<number> {
  unload();
  return await prepare({
    name: "deno_notify",
    checkCache: cache,
    printLog: verbose,
    urls: {
      darwin: PLUGIN_URL || `${PLUGIN_URL_BASE}/libdeno_notify.dylib`,
      windows: PLUGIN_URL || `${PLUGIN_URL_BASE}/deno_notify.dll`,
      linux: PLUGIN_URL || `${PLUGIN_URL_BASE}/libdeno_notify.so`,
    },
  });
}

/**
 * Free the plugin resource
 */
function unload(): void {
  if (_pluginId !== null) Deno.close(_pluginId);
  _pluginId = null;
}

let _pluginId: number | null = 0;

export function getPluginId() {
  return _pluginId;
}

_pluginId = await load(!DEBUG, DEBUG);

window.addEventListener("unload", unload);
