import { notify_send } from "./plugin.ts";

type PlatformFeature<Platform extends boolean, FunctionType> = Platform extends
  true ? FunctionType : never;

// Resources
// Web Notifications API: https://developer.mozilla.org/en-US/docs/Web/API/Notification
// Notify-rust API: https://github.com/hoodie/notify-rust/blob/main/src/notification.rs

type MacSoundNames =
  | "Basso"
  | "Frog"
  | "Hero"
  | "Pop"
  | "Submarine"
  | "Blow"
  | "Funk"
  | "Morse"
  | "Purr"
  | "Tink"
  | "Bottle"
  | "Glass"
  | "Ping"
  | "Sosumi";

export class Notification<
  MacOS extends boolean = false,
  Windows extends boolean = false,
  Linux extends boolean = false,
> {
  /**
   * Which platform-specific features to support in this notification.
   */
  private supports: { macos: MacOS; windows: Windows; linux: Linux };
  /**
   * Whether or not to error if a feature is called on an operating system that does not support it.
   */
  private strictSupport: boolean;

  private _title: string | null = null;
  private _subtitle: string | null = null;
  private _body: string | null = null;
  private _icon: string | null = null;
  private _soundName: string | null = null;
  private _timeout: "never" | number | null = null;

  /**
   * Create a Notification.
   * Most fields are empty by default.
   *
   * Platform specific-features are locked behind the `supports` parameter.
   *
   * @param supports Which platform-specific features to support in this notification.
   * @param strictSupport Whether or not to error if a feature is called on an operating system that does not support it.
   *
   * @example
   * ```ts
   * // By default, no platform-specific features are allowed
   * const n1 = new Notification();
   *
   * // Allow macos-specific features
   * // This will throw if a macos-specific feature is called on non-macos platforms.
   * const n2 = new Notification({ macos: true });
   *
   * // Allow macos-specific features, ignore the features on non-macos platforms.
   * const n3 = new Notification({ macos: true }, false);
   * ```
   */
  public constructor(
    {
      macos = false as MacOS,
      windows = false as Windows,
      linux = false as Linux,
    }: { macos?: MacOS; windows?: Windows; linux?: Linux } = {},
    strictSupport: boolean = true,
  ) {
    this.supports = {
      macos,
      windows,
      linux,
    };
    this.strictSupport = strictSupport;
  }

  /**
   * Set the `title`.
   * This is a required field.
   *
   * For more elaborate content, use the `body` field.
   *
   * @param title
   */
  public title = (title: string) => {
    this._title = title;
    return this;
  };

  /**
   * Set the `subtitle`.
   * Available on macOS and Windows.
   *
   * For more elaborate content, use the `body` field.
   *
   * @param subtitle
   */
  public subtitle = ((subtitle: string) => {
    if (this.#verifyPlatform(["macos", "windows"], "subtitle") === false) {
      return;
    }
    this._subtitle = subtitle;
    return this;
  }) as PlatformFeature<MacOS | Windows, (subtitle: string) => this>;

  /**
   * Set the `body`.
   *
   * Multiline textual content of the notification.
   * Each line should be treated as a paragraph.
   * Simple html markup may be supported on some platforms.
   *
   * @param body
   */
  public body = (body: string) => {
    this._body = body;
    return this;
  };

  /**
   * Set the `icon`.
   * Available on Linux.
   *
   * Can either be a file:// URI,
   * or a common icon name, usually those in `/usr/share/icons`
   * can all be used (or freedesktop.org names).
   *
   * @param icon
   */
  public icon = ((icon: string) => {
    if (this.#verifyPlatform(["linux"], "icon") === false) return;
    this._icon = icon;
    return this;
  }) as PlatformFeature<Linux, (icon: string) => this>;

  /**
   * Set the `soundName` to play with the notification.
   *
   * With macOS support, a list of default sound names is provided.
   *
   * @param soundName
   */
  public soundName = (
    soundName: MacOS extends true ? MacSoundNames : string,
  ) => {
    this._soundName = soundName;
    return this;
  };

  /**
   * Set the `timeout`.
   * Available on Windows and Linux.
   *
   * This sets the time (in milliseconds) from the time the notification is displayed
   * until it is closed again by the Notification Server.
   *
   * Setting this to `'never'` will cause the notification to never expire.
   *
   * @param timeout
   */
  public timeout = ((timeout: "never" | number) => {
    if (this.#verifyPlatform(["windows", "linux"], "timeout") === false) return;

    // TODO: Once TypeScript 4.5 comes out, add compile-time check for numbers greater than 0 (see https://stackoverflow.com/a/69090186/4588880)
    if (typeof timeout === "number" && timeout <= 0) {
      throw new Error(
        "Notification timeout must be a number greater than 0 (or 'never').",
      );
    }

    this._timeout = timeout;
    return this;
  }) as PlatformFeature<Windows | Linux, (timeout: "never" | number) => this>;

  /**
   * Display the notification to the user.
   * @throws When an error occurs while sending the notification.
   */
  public show = () => {
    // Check has minimum requirements to be sent
    if (this.#verifyCanBeSent() !== true) return;

    const json = JSON.stringify(this);
    const result = notify_send(json);

    if (result.type === "error") {
      throw new Error(`${result.message} (when: ${result.when})`);
    }
  };

  /**
   * Clone the notification into a separate instance, maintaining all the properties.
   *
   * @returns The new notification instance.
   */
  public clone = () => {
    return Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this,
    ) as Notification<MacOS, Windows, Linux>;
  };

  /**
   * Verify whether or not the notification has the minimum required fields to be sent.
   *
   * @throws If the notification cannot be sent with the appropriate explanation error.
   * @returns True if the notification can be sent.
   */
  #verifyCanBeSent = () => {
    // Notification NEEDS at least a title
    if (this._title === null) {
      throw new Error(`Notification instance must have a title.`);
    }
    return true;
  };

  /**
   * Verify whether a feature meant for a given platform should be run on the current platform.
   *
   * @param requestedPlatforms The requested platform to verify against the current platform.
   * @throws If the platform is not supported by the notification instance.
   * @throws If the feature should not be run (while in strict mode).
   * @returns True if the feature should be run, false if the feature should not be run (while in non-strict mode).
   */
  #verifyPlatform = (
    requestedPlatforms: ("macos" | "linux" | "windows")[],
    featureName: string,
  ) => {
    const currentPlatform = Deno.build.os === "darwin"
      ? "macos"
      : Deno.build.os;

    // List of platforms that are supported by the notification instance
    const supportedPlatforms = requestedPlatforms.filter((platform) =>
      this.supports[platform]
    );

    // If the requested platforms are not supported by this Notification instance, throw an error
    if (supportedPlatforms.length === 0) {
      const unsupportedPlatforms = requestedPlatforms.filter((platform) =>
        this.supports[platform] === false
      );
      throw new Error(
        `Notification instance does not explicitly support ${
          unsupportedPlatforms.join(", or ")
        }.`,
      );
    }

    // Whether or not the oen of the requested & supported platform is the current platform
    const isPlatformValid = supportedPlatforms.some((platform) => (
      currentPlatform === platform
    ));

    // If we're not strictly checking for support, just return whether or not the platform is valid
    if (this.strictSupport === false) {
      return isPlatformValid;
    }
    // Otherwise, we are strictly checking for support

    // If we are strictly checking for support, and the platform is not valid, throw an error
    if (isPlatformValid === false) {
      throw new Error(
        `Current operating system (${currentPlatform}) does not support ${featureName}.`,
      );
    }
    // Otherwise, we are strictly checking for support AND the platform is valid
    return true;
  };
}
