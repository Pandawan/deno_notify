use deno_core::serde::Deserialize;
use deno_core::serde_json;
use notify_rust::{self, error::Error as NotifyRustError, Notification};

#[derive(Debug, Deserialize)]
#[serde(tag = "type")]
enum NotificationTimeout {
    /// Do not expire, user will have to close this manually.
    Never,
    /// Expire after n milliseconds.
    Milliseconds(u32),
}

impl Into<notify_rust::Timeout> for NotificationTimeout {
    fn into(self) -> notify_rust::Timeout {
        match self {
            NotificationTimeout::Never => notify_rust::Timeout::Never,
            NotificationTimeout::Milliseconds(t) => notify_rust::Timeout::Milliseconds(t),
        }
    }
}

#[derive(Debug, Deserialize)]
struct NotificationOptions {
    #[serde(rename = "_title")]
    title: String,

    #[serde(rename = "_subtitle")]
    subtitle: Option<String>,

    #[serde(rename = "_body")]
    body: Option<String>,

    #[serde(rename = "_icon")]
    icon: Option<String>,

    #[serde(rename = "_soundName")]
    sound_name: Option<String>,

    #[serde(rename = "_timeout")]
    timeout: Option<NotificationTimeout>,
}

fn send_notification(options: NotificationOptions) -> Result<(), NotifyRustError> {
    let mut notification = Notification::new();

    // Set Notification options
    notification.summary(&options.title);

    if let Some(subtitle) = &options.subtitle {
        notification.subtitle(subtitle);
    }

    if let Some(body) = &options.body {
        notification.body(body);
    }

    if let Some(icon) = &options.icon {
        notification.icon(icon);
    }

    if let Some(sound_name) = &options.sound_name {
        notification.sound_name(sound_name);
    }

    if let Some(timeout) = options.timeout {
        notification.timeout(timeout);
    }

    // Display it
    match notification.show() {
        Ok(_) => Ok(()),
        Err(error) => Err(error),
    }
}

// TODO: Return buffers are not available yet
#[no_mangle]
pub extern "C" fn notify_send(ptr: *const u8, len: usize) -> u8 {
    let buf = unsafe { std::slice::from_raw_parts(ptr, len) };

    // Try parsing JSON into NotificationOptions object
    let options: NotificationOptions = match serde_json::from_slice(buf) {
        Ok(opt) => opt,
        Err(error) => {
            println!("Error reading input data as JSON: {}", error);
            return 1;
        }
    };

    // Try sending the notification
    match send_notification(options) {
        Ok(_) => 0,
        Err(error) => {
            println!("Error sending notification: {}", error);
            1
        }
    }
}
