import { Notification } from "../ts/notification.ts";
import { assertStrictEquals } from "https://deno.land/std@0.107.0/testing/asserts.ts";

Deno.test("Set title", () => {
  let title = "Example title";
  const notif = new Notification().title(title);
  assertStrictEquals((notif as any)._title, title);
});

Deno.test({
  name: "Set subtitle",
  ignore: Deno.build.os !== "darwin",
  fn() {
    let subtitle = "Example subtitle";
    const notif = new Notification({ macos: true }).subtitle(subtitle);
    assertStrictEquals((notif as any)._subtitle, subtitle);
  },
});

Deno.test("Set body", () => {
  let body = "Example body";
  const notif = new Notification().body(body);
  assertStrictEquals((notif as any)._body, body);
});

Deno.test({
  name: "Set icon",
  ignore: Deno.build.os !== "windows" && Deno.build.os !== "linux",
  fn() {
    let icon = "/path/to/icon";
    const notif = new Notification({ linux: true, windows: true }).icon(icon);
    assertStrictEquals((notif as any)._icon, icon);
  },
});

Deno.test("Set soundName", () => {
  let soundName = "Basso";
  const notif = new Notification().soundName(soundName);
  assertStrictEquals((notif as any)._soundName, soundName);
});
