# Environment Setup Instructions

## Required Configuration Files

This project requires sensitive configuration files that are not included in the repository for security reasons. You need to create these files manually:

### 1. Google Cloud Service Account Key
- **File**: `daksh_2025-backend/daksh-447009-20ff32f1a756.json`
- **Template**: `daksh_2025-backend/daksh-447009-20ff32f1a756.json.example`
- **How to get**: 
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Select your project
  3. Go to IAM & Admin > Service Accounts
  4. Create or select a service account
  5. Create a new key (JSON format)
  6. Download and rename to `daksh-447009-20ff32f1a756.json`

### 2. Secret Keys Configuration
- **File**: `daksh_2025-backend/secret-key.json`
- **Template**: `daksh_2025-backend/secret-key.json.example`
- **Required Keys**:
  - `google_oauth_client_id`: Your Google OAuth client ID
  - `google_oauth_client_secret`: Your Google OAuth client secret
  - `gemini_api_key`: Your Google Gemini API key

### 3. Required Google Cloud APIs
Make sure these APIs are enabled in your Google Cloud project:
- Speech-to-Text API
- Text-to-Speech API
- Gemini AI API

### 4. Setup Steps
1. Copy the example files and remove the `.example` extension
2. Fill in your actual credentials
3. Never commit these files to version control
4. The `.gitignore` file is configured to exclude these sensitive files

## Security Notes
- Never share or commit actual credential files
- Keep your API keys secure
- Rotate keys regularly
- Use environment variables in production
