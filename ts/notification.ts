type PlatformFeature<Platform extends boolean, FunctionType> = Platform extends
  true ? FunctionType : never;

// Resources
// Web Notifications API: https://developer.mozilla.org/en-US/docs/Web/API/Notification
// Notify-rust API: https://github.com/hoodie/notify-rust/blob/main/src/notification.rs

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

  private _title: string = "";
  private _body: string = "";

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
   * Display the notification to the user.
   */
  public show = () => {
    console.log(`Show Notification`, { title: this._title, body: this._body });
    throw new Error("TODO!");
  };

  /**
   * Clone the notification into a separate instance, maintaining all the properties.
   * 
   * @returns The new notification.
   */
  public clone = () => {
    return Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this,
    ) as Notification<MacOS, Windows, Linux>;
  };

  public someMacFeature: PlatformFeature<MacOS, () => number> = (() => {
    if (this.#verifyPlatform("macos") === false) return;

    console.log("Platform is macos");
    return 0;
  }) as PlatformFeature<MacOS, () => number>;

  public someWindowsFeature: PlatformFeature<Windows, () => number> = (() => {
    if (this.#verifyPlatform("windows") === false) return;

    console.log("Platform is windows");
    return 0;
  }) as PlatformFeature<Windows, () => number>;

  /**
   * Verify whether a feature meant for a given platform should be run on the current platform.
   * 
   * @param isPlatform The requested platform to verify against the current platform.
   * @throws If the platform is not supported by the notification instance.
   * @throws If the feature should not be run (while in strict mode).
   * @returns True if the feature should be run, false if the feature should not be run (while in non-strict mode).
   */
  #verifyPlatform = (isPlatform: "macos" | "windows" | "linux") => {
    const errorMessage =
      `${isPlatform} platform feature is not supported on ${Deno.build.os}.`;

    // If the requested platform is not supported by this Notification instance, throw an error
    if (this.supports[isPlatform] === false) {
      throw new Error(errorMessage);
    }

    // Whether or not the requested platform is the current platform
    const isPlatformValid = (
      (Deno.build.os === isPlatform) ||
      (Deno.build.os == "darwin" && isPlatform == "macos")
    );

    // If we're not strictly checking for support, just return whether or not the platform is valid
    if (this.strictSupport === false) {
      return isPlatformValid;
    }
    // Otherwise, we are strictly checking for support

    // If we are strictly checking for support, and the platform is not valid, throw an error
    if (isPlatformValid === false) {
      throw new Error(errorMessage);
    }
    // Otherwise, we are strictly checking for support AND the platform is valid
    return true;
  };
}
