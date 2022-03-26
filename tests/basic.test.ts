import { Notification } from "../ts/notification.ts";
import {
  assert,
  assertNotStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.132.0/testing/asserts.ts";

Deno.test("Creating a notification", () => {
  new Notification();
});

Deno.test("Chaining option calls", () => {
  const notif = new Notification()
    .title("Example title")
    .body("Example body");

  assert(notif instanceof Notification);
});

Deno.test("Require title", () => {
  const notif = new Notification();
  assertThrows(
    () => notif.show(),
    Error,
    "Notification instance must have a title",
  );
});

Deno.test("Send basic notification", () => {
  // Create a new notification
  const notif = new Notification();

  // Add a simple message
  notif.title("My message");

  // Display it
  notif.show();
});

Deno.test("Send complex notification", () => {
  // Create a new notification
  const notif = new Notification(
    { macos: true, windows: true, linux: true },
    // Attempting to use all options, so silently fail on other platforms
    false,
  );

  // Set options
  notif
    .title("Title")
    .subtitle("Subtitle")
    .body("Body")
    .icon("utilities-terminal")
    .soundName("Basso")
    .timeout(10);

  // Display it
  notif.show();
});

Deno.test("Cloning notifications", () => {
  // Create a new notification
  const notif = new Notification();

  // Add a simple message
  notif.title("My message");

  // Make sure the clone is not the same object
  const newNotif = notif.clone();
  assertNotStrictEquals(notif, newNotif);

  // Make sure the title is not the same
  newNotif.title("Another message");
  assertNotStrictEquals((notif as any)._title, (newNotif as any)._title);
});
