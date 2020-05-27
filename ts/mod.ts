import { unwrapResponse, opAsync } from "./plugin.ts";

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
   */
  title: string;
  /**
   * Multi-line message of the notification.
   * May support simple HTML markup on some platforms, see notify-rust.
   */
  message: string;
  /**
   * Icon to render the notification with.
   */
  icon?: Icon;
  /**
   * Sound to play when showing the notification.
   */
  sound?: string;
}

const defaultOptions: INotification = {
  title: "",
  message: "",
  icon: { name: "terminal" },
  sound: undefined,
};
export interface NotifyResult {
}

export async function notify(options: INotification): Promise<NotifyResult> {
  return unwrapResponse(
    await opAsync("notifs_send", { ...defaultOptions, ...options }),
  );
}
