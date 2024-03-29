import { Notification } from "../ts/notification.ts";
import { assertThrows } from "https://deno.land/std@0.134.0/testing/asserts.ts";

Deno.test("Attempt unsupported platform feature (strict)", () => {
  const notif = new Notification();
  assertThrows(
    () => (notif as any).icon("/path/to/icon"),
    Error,
    "Notification instance does not explicitly support",
  );
});

Deno.test({
  name: "Attempt supported platform feature (strict, linux)",
  ignore: Deno.build.os !== "linux",
  fn() {
    const notif = new Notification({ linux: true });
    (notif as any).icon("/path/to/icon");
  },
});

Deno.test({
  name: "Attempt supported platform feature (strict, windows)",
  ignore: Deno.build.os !== "windows",
  fn() {
    const notif = new Notification({ windows: true });
    (notif as any).subtitle("Example subtitle");
  },
});

Deno.test({
  name: "Attempt supported platform feature (strict, macos)",
  ignore: Deno.build.os !== "darwin",
  fn() {
    const notif = new Notification({ macos: true });
    (notif as any).subtitle("Example subtitle");
  },
});

Deno.test({
  name: "Attempt supported platform feature on invalid os (strict, macos)",
  ignore: Deno.build.os !== "darwin",
  fn() {
    const notif = new Notification({ linux: true });
    assertThrows(
      () => (notif as any).icon("/path/to/icon"),
      Error,
      "Current operating system (macos) does not support icon.",
    );
  },
});

Deno.test({
  name: "Attempt supported platform feature on invalid os (strict, windows)",
  ignore: Deno.build.os !== "windows",
  fn() {
    const notif = new Notification({ linux: true });
    assertThrows(
      () => (notif as any).icon("/path/to/icon"),
      Error,
      `Current operating system (windows) does not support icon.`,
    );
  },
});

Deno.test({
  name: "Attempt supported platform feature on invalid os (strict, linux)",
  ignore: Deno.build.os !== "linux",
  fn() {
    const notif = new Notification({ macos: true, windows: true });
    assertThrows(
      () => (notif as any).subtitle("Example subtitle"),
      Error,
      `Current operating system (linux) does not support subtitle.`,
    );
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
    // Show not throw on windows/linux
    (notif as any).subtitle("Example subtitle");
  },
});

Deno.test({
  name: "Attempt unsupported platform feature (non-strict, non-windows)",
  ignore: Deno.build.os === "windows",
  fn() {
    const notif = new Notification({ windows: true }, false);
    // Should not throw on linux/macos
    (notif as any).subtitle("Example subtitle");
  },
});

Deno.test({
  name: "Attempt supported multi-platform feature (strict, windows and macos)",
  ignore: Deno.build.os !== "windows" && Deno.build.os !== "darwin",
  fn() {
    const notif = new Notification({ windows: true, macos: true });
    (notif as any).subtitle("Example subtitle");
  },
});
