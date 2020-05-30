import { unwrapResponse, opSync } from "./plugin.ts";

export type Icon = {
  /**
   * Name of the application to use the icon.
   */
  app: string;
} | {
  /**
   * File URL to the icon (must be file://).
   */
  path: string;
} | {
  /**
   * Name of the icon in an icon theme, must be freedesktop.org compliant.
   */
  name: string;
};

interface INotification {
  /**
   * Single line title of the notification.
   * Defaults to "deno_notify"
   */
  title?: string;
  /**
   * Multi-line message of the notification.
   * May support simple HTML markup on some platforms, see notify-rust.
   */
  message: string;
  /**
   * Icon to render the notification with.
   * Set to "terminal" by default or if the icon is not found.
   */
  icon?: Icon;
  /**
   * Sound to play when showing the notification.
   */
  sound?: string;
}

const defaultOptions: INotification = {
  title: "deno_notify",
  message: "",
  icon: { name: "terminal" },
  sound: undefined,
};

export interface NotifyResult {}

/**
 * Send a simple notification with a message.
 * @param message
 * @example
 * ```ts
 * notify('Message');
 * ```
 */
export function notify(message: string): NotifyResult;
/**
 * Sends a notification with various options.
 * @param options
 * @example
 * ```ts
 * notify({
 *   title: 'Hello',
 *   message: 'World',
 *   icon: {
 *     app: "Terminal",
 *   },
 *   sound: "Basso",
 * });
 * ```
 */
export function notify(options: INotification): NotifyResult;
export function notify(
  options: string | INotification,
): NotifyResult {
  const data = typeof options === "string"
    ? {
      ...defaultOptions,
      message: options,
    }
    : { ...defaultOptions, ...options };

  return unwrapResponse(
    opSync("notify_send", data),
  );
}
