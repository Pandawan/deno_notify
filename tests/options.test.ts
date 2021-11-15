import { Notification } from "../ts/notification.ts";
import {
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.114.0/testing/asserts.ts";

Deno.test("Set title", () => {
  const title = "Example title";
  const notif = new Notification().title(title);
  assertStrictEquals((notif as any)._title, title);
});

Deno.test({
  name: "Set subtitle",
  ignore: Deno.build.os !== "darwin" && Deno.build.os !== "windows",
  fn() {
    const subtitle = "Example subtitle";
    const notif = new Notification({ macos: true, windows: true }).subtitle(
      subtitle,
    );
    assertStrictEquals((notif as any)._subtitle, subtitle);
  },
});

Deno.test("Set body", () => {
  const body = "Example body";
  const notif = new Notification().body(body);
  assertStrictEquals((notif as any)._body, body);
});

Deno.test({
  name: "Set icon",
  ignore: Deno.build.os !== "linux",
  fn() {
    const icon = "/path/to/icon";
    const notif = new Notification({ linux: true }).icon(icon);
    assertStrictEquals((notif as any)._icon, icon);
  },
});

Deno.test("Set soundName", () => {
  const soundName = "Basso";
  const notif = new Notification().soundName(soundName);
  assertStrictEquals((notif as any)._soundName, soundName);
});

Deno.test({
  name: "Set timeout",
  ignore: Deno.build.os !== "windows" && Deno.build.os !== "linux",
  fn() {
    const notif = new Notification({ linux: true, windows: true }).timeout(
      "never",
    );
    assertStrictEquals((notif as any)._timeout, "never");

    notif.timeout(10);
    assertStrictEquals((notif as any)._timeout, 10);
  },
});

Deno.test({
  name: "Error on negative timeout",
  ignore: Deno.build.os !== "windows" && Deno.build.os !== "linux",
  fn() {
    const notif = new Notification({ linux: true, windows: true });
    assertThrows(
      () => notif.timeout(-5),
      Error,
      `Notification timeout must be a number greater than 0 (or 'never').`,
    );
  },
});
