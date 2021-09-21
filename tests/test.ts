import { Notification } from "../ts/notification.ts";
import {
  assertThrows,
  unimplemented,
} from "https://deno.land/std@0.107.0/testing/asserts.ts";

Deno.test("Send basic notification", () => {
  // Create a new notification
  const notif = new Notification();

  // Add a simple message
  notif.title("My message");

  // Display it
  notif.show();
});

Deno.test("Attempt unsupported platform feature", () => {
  const notif = new Notification();
  assertThrows(
    () => (notif as any).icon("/path/to/icon"),
    Error,
    "Notification instance does not explicitly support",
  );
});

Deno.test({
  name: "Attempt supported platform feature (linux)",
  ignore: Deno.build.os !== "linux",
  fn() {
    const notif = new Notification({ linux: true });
    (notif as any).icon("/path/to/icon");
  },
});

Deno.test({
  name: "Attempt supported platform feature (windows)",
  ignore: Deno.build.os !== "windows",
  fn() {
    const notif = new Notification({ windows: true });
    (notif as any).icon("/path/to/icon");
  },
});

Deno.test({
  name: "Attempt supported platform feature (macos)",
  ignore: Deno.build.os !== "darwin",
  fn() {
    const notif = new Notification({ macos: true });
    unimplemented("There are no macos-specific features yet.");
  },
});

Deno.test({
  name: "Attempt unsupported platform feature (non-strict, non-linux)",
  ignore: Deno.build.os === "linux",
  fn() {
    const notif = new Notification({ linux: true }, false);
    // Should not throw on windows/macos
    (notif as any).icon("/path/to/icon");
  },
});

Deno.test({
  name: "Attempt unsupported platform feature (non-strict, non-macos)",
  ignore: Deno.build.os === "darwin",
  fn() {
    const notif = new Notification({ macos: true }, false);
    unimplemented("There are no macos-specific features yet.");
  },
});

Deno.test({
  name: "Attempt unsupported platform feature (non-strict, non-windows)",
  ignore: Deno.build.os === "windows",
  fn() {
    const notif = new Notification({ windows: true }, false);
    // Should not throw on linux/macos
    (notif as any).icon("/path/to/icon");
  },
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
