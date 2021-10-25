use deno_core::serde::Deserialize;
use deno_core::serde_json;
use notify_rust::{error::Error as NotifyRustError, Notification};

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
}

fn send_notification(options: NotificationOptions) -> Result<(), NotifyRustError> {
    let mut notification = Notification::new();

    // Notification title
    notification.summary(&options.title);

    // Notification subtitle
    if let Some(subtitle) = &options.subtitle {
        notification.subtitle(subtitle);
    }

    // Notification body
    if let Some(body) = &options.body {
        notification.body(body);
    }

    // Add an icon
    if let Some(icon) = &options.icon {
        notification.icon(icon);
    }

    // Add a sound
    if let Some(sound_name) = &options.sound_name {
        notification.sound_name(sound_name);
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

    let options: NotificationOptions = match serde_json::from_slice(buf) {
        Ok(opt) => opt,
        Err(error) => {
            println!("Error reading input data as JSON: {}", error);
            return 1;
        }
    };

    match send_notification(options) {
        Ok(_) => 0,
        Err(error) => {
            println!("Error reading input data as JSON: {}", error);
            1
        }
    }
}
