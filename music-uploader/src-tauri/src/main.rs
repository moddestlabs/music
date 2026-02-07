// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::State;
use std::sync::Mutex;

#[derive(Debug, Serialize, Deserialize)]
struct Config {
    github_token: Option<String>,
    github_owner: String,
    github_repo: String,
}

struct AppState {
    config: Mutex<Config>,
}

#[derive(Debug, Serialize, Deserialize)]
struct SongMetadata {
    artist: String,
    title: String,
    genres: Vec<String>,
    duration: String,
    filename: String,
    salt: String,
    iv: String,
    encrypted_at: String,
}

// Save GitHub credentials securely
#[tauri::command]
async fn save_credentials(
    state: State<'_, AppState>,
    token: String,
    owner: String,
    repo: String,
) -> Result<bool, String> {
    // Save to OS keyring
    let service = "music-uploader";
    let username = "github-token";
    
    match keyring::Entry::new(service, username) {
        Ok(entry) => {
            entry.set_password(&token).map_err(|e| e.to_string())?;
            
            // Update app state
            let mut config = state.config.lock().unwrap();
            config.github_token = Some(token);
            config.github_owner = owner;
            config.github_repo = repo;
            
            Ok(true)
        }
        Err(e) => Err(e.to_string()),
    }
}

// Load credentials from keyring
#[tauri::command]
async fn load_credentials(state: State<'_, AppState>) -> Result<Option<Config>, String> {
    let service = "music-uploader";
    let username = "github-token";
    
    match keyring::Entry::new(service, username) {
        Ok(entry) => {
            match entry.get_password() {
                Ok(token) => {
                    let config = state.config.lock().unwrap();
                    Ok(Some(Config {
                        github_token: Some(token),
                        github_owner: config.github_owner.clone(),
                        github_repo: config.github_repo.clone(),
                    }))
                }
                Err(_) => Ok(None),
            }
        }
        Err(e) => Err(e.to_string()),
    }
}

// Upload files to GitHub
#[tauri::command]
async fn upload_to_github(
    state: State<'_, AppState>,
    encrypted_data: Vec<u8>,
    metadata_json: String,
    filename: String,
) -> Result<String, String> {
    let config = state.config.lock().unwrap();
    
    let token = config.github_token.as_ref()
        .ok_or("No GitHub token found. Please configure credentials.")?;
    
    let owner = &config.github_owner;
    let repo = &config.github_repo;
    
    let client = reqwest::Client::new();
    
    // Upload encrypted file
    let encrypted_path = format!("music/{}.encrypted", filename);
    let encrypted_content = base64::Engine::encode(&base64::engine::general_purpose::STANDARD, &encrypted_data);
    
    let encrypted_url = format!(
        "https://api.github.com/repos/{}/{}/contents/{}",
        owner, repo, encrypted_path
    );
    
    let encrypted_body = serde_json::json!({
        "message": format!("Add encrypted music file: {}", filename),
        "content": encrypted_content,
        "branch": "main"
    });
    
    let encrypted_response = client
        .put(&encrypted_url)
        .header("Authorization", format!("Bearer {}", token))
        .header("User-Agent", "music-uploader")
        .header("Accept", "application/vnd.github+json")
        .json(&encrypted_body)
        .send()
        .await
        .map_err(|e| e.to_string())?;
    
    if !encrypted_response.status().is_success() {
        let error_text = encrypted_response.text().await.unwrap_or_default();
        return Err(format!("Failed to upload encrypted file: {}", error_text));
    }
    
    // Upload metadata JSON
    let metadata_path = format!("music/{}.json", filename);
    let metadata_content = base64::Engine::encode(&base64::engine::general_purpose::STANDARD, metadata_json.as_bytes());
    
    let metadata_url = format!(
        "https://api.github.com/repos/{}/{}/contents/{}",
        owner, repo, metadata_path
    );
    
    let metadata_body = serde_json::json!({
        "message": format!("Add metadata for: {}", filename),
        "content": metadata_content,
        "branch": "main"
    });
    
    let metadata_response = client
        .put(&metadata_url)
        .header("Authorization", format!("Bearer {}", token))
        .header("User-Agent", "music-uploader")
        .header("Accept", "application/vnd.github+json")
        .json(&metadata_body)
        .send()
        .await
        .map_err(|e| e.to_string())?;
    
    if !metadata_response.status().is_success() {
        let error_text = metadata_response.text().await.unwrap_or_default();
        return Err(format!("Failed to upload metadata: {}", error_text));
    }
    
    Ok(format!("Successfully uploaded {} files to GitHub!", filename))
}

// Open native file dialog
#[tauri::command]
async fn select_audio_file(app: tauri::AppHandle) -> Result<Option<PathBuf>, String> {
    use tauri_plugin_dialog::{DialogExt, MessageDialogKind};
    
    let file_path = app.dialog()
        .file()
        .add_filter("Audio Files", &["mp3", "wav", "m4a", "flac", "ogg"])
        .blocking_pick_file();
    
    Ok(file_path.map(|f| f.path.to_path_buf()))
}

fn main() {
    let app_state = AppState {
        config: Mutex::new(Config {
            github_token: None,
            github_owner: String::new(),
            github_repo: String::new(),
        }),
    };
    
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            save_credentials,
            load_credentials,
            upload_to_github,
            select_audio_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
