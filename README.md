# Morrow

Morrow is a desktop assistant for talking to a local language model. Its dark workspace includes chat history, model connection settings, diagnostics, and editable assistant instructions. Chats are saved on your computer. Prompts go only to the API endpoint you configure; Morrow does not use a hosted AI service.

## Run on Windows

1. Install [Node.js](https://nodejs.org/) if it is not already installed.
2. Open this folder in PowerShell or a terminal.
3. Run `npm install` once.
4. Run `npm start` to open Morrow as a desktop app.

To make a Windows installer, run `npm run dist`. The installer will be created in `release`.

The Windows setup wizard lets you choose where to install Morrow and choose a per-user or per-machine install. It creates Start Menu and desktop shortcuts, and offers the option to launch Morrow when setup finishes.

## Connect a local model

Start a local model server that exposes an OpenAI-compatible **Chat Completions** endpoint. In Morrow's model settings, enter its API base URL and model name. For example, with Ollama's OpenAI-compatible endpoint:

- API base URL: `http://localhost:11434/v1`
- Model name: the model name available in your Ollama installation

Morrow sends a non-streaming request to `<API base URL>/chat/completions`. **Send test prompt** checks the selected model by sending a short chat-completions request, rather than calling a model-list endpoint that some local servers do not support. Include `/v1` in the API base URL when your server requires it; for Ollama, use `http://localhost:11434/v1`. No API key is required by Morrow. A model server may have its own configuration requirements.

## Customize your assistant

Morrow copies [`LOCAL_MODEL.md`](./LOCAL_MODEL.md) to its local app-data folder the first time you open the Skills page or send a message. That editable copy is included as the system instructions in every request. Use **Open instructions** in the Skills page to open the file in your default Markdown editor. After editing it, reload the preview; new messages pick up the updated instructions.

The Skills page also includes 10 built-in skills you can install or uninstall. Installed skills are saved in Morrow's local app-data folder and their instructions are added to future chat requests. Skills are instruction-only; they do not run scripts or install external files.

Open **Themes** in the sidebar to choose from eight color themes or upload a workspace logo. Logo files can be PNG, JPEG, WebP, or GIF up to 512 KB. Your appearance preferences are saved on this computer.

## MVP scope

- Dark desktop workspace with chat and infrastructure-style navigation
- Eight locally saved color themes and a customizable workspace logo
- Searchable, folder-organized conversations saved on this device
- Configurable OpenAI-compatible local model endpoint and model name
- Connection testing, diagnostics, and clear connection errors with retry
- Installable local assistant skills
- A Jarvis-inspired local assistant personality defined in `LOCAL_MODEL.md`
- No accounts, cloud sync, or built-in hosted model
