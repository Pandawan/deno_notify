import { notify, getPluginId } from "../ts/prepared.ts";
import { assert } from "https://deno.land/std@0.71.0/testing/asserts.ts";

Deno.test("Check plugin id", () => {
  assert(getPluginId() !== null && getPluginId() !== 0);
});

// Need to send complete notification before simple because the icon can't change after being set on mac
Deno.test("Send complete notification", () => {
  notify({
    title: "A nice title",
    message: "A complete notification",
    icon: {
      app: "Safari",
    },
    sound: "Basso",
  });
});

Deno.test("Send partial notification", () => {
  notify({
    message: "A partial notification",
  });
});

Deno.test("Send simple notification", () => {
  notify("A simple notification");
});

/*
// Deno.close doesn't work right now, see: https://github.com/denoland/deno/issues/5975 
Deno.test("Load plugin manually", () => {
  const target = Deno.env.get("DENO_NOTIFY_PLUGIN_BASE");
  // Only attempt to load manually if not using online version
  if (target !== undefined) {
    const pluginId = getPluginId();
    // Close the plugin if already opened
    if (pluginId !== null) {
      Deno.close(pluginId);

      notify('My message');
    }

    assert(!(Deno as any).core.ops()['notify_send'], "Notify ops still exist after closing");

    const base = "deno_notify";
    let suffix = ".so";
    let prefix = "lib";

    if (Deno.build.os === "windows") {
      suffix = ".dll";
      prefix = "";
    } else if (Deno.build.os === "darwin") {
      suffix = ".dylib";
    }

    const filename = resolve(target, `${prefix}${base}${suffix}`);
    console.log("Opening filename: ", filename);

    Deno.openPlugin(filename);

    assert((Deno as any).core.ops()['notify_send'], "Notify ops were not loaded correctly");
  }
});
*/
