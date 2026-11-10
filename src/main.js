const { app, BrowserWindow, ipcMain, shell } = require("electron");
const { mkdir, readFile, writeFile } = require("node:fs/promises");
const path = require("node:path");
const { skills } = require("./skills");

function getUserInstructionsPath() {
  return path.join(app.getPath("userData"), "LOCAL_MODEL.md");
}

function getUserSkillsPath() {
  return path.join(app.getPath("userData"), "skills.json");
}

async function getInstalledSkillIds() {
  try {
    const savedIds = JSON.parse(await readFile(getUserSkillsPath(), "utf8"));
    if (!Array.isArray(savedIds) || !savedIds.every((id) => typeof id === "string")) {
      throw new Error("The installed skills file has an invalid format.");
    }
    const availableIds = new Set(skills.map((skill) => skill.id));
    return [...new Set(savedIds.filter((id) => availableIds.has(id)))];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    console.error("Could not read installed skills:", error);
    throw new Error(error.message || "Could not read your installed skills.");
  }
}

async function saveInstalledSkillIds(ids) {
  const skillsPath = getUserSkillsPath();
  try {
    await mkdir(path.dirname(skillsPath), { recursive: true });
    await writeFile(skillsPath, JSON.stringify(ids, null, 2), "utf8");
  } catch (error) {
    console.error("Could not save installed skills:", error);
    throw new Error("Could not save your installed skills. Check disk space and try again.");
  }
}

async function getLocalInstructions() {
  const instructionsPath = getUserInstructionsPath();

  try {
    return await readFile(instructionsPath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Could not read the local assistant instructions:", error);
      throw new Error("Could not read your local assistant instructions.");
    }
  }

  try {
    const defaultInstructions = await readFile(path.join(app.getAppPath(), "LOCAL_MODEL.md"), "utf8");
    await mkdir(path.dirname(instructionsPath), { recursive: true });
    await writeFile(instructionsPath, defaultInstructions, { flag: "wx" });
  } catch (error) {
    if (error.code !== "EEXIST") {
      console.error("Could not create the local assistant instructions:", error);
      throw new Error("Could not create your editable LOCAL_MODEL.md in Morrow's local data folder.");
    }
  }

  try {
    return await readFile(instructionsPath, "utf8");
  } catch (error) {
    console.error("Could not read the initialized local assistant instructions:", error);
    throw new Error("Could not read your local LOCAL_MODEL.md. Check the file and try again.");
  }
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 760,
    minHeight: 600,
    title: "Morrow",
    backgroundColor: "#111116",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  window.loadFile(path.join(__dirname, "index.html"));
}

ipcMain.handle("model:chat", async (_event, { baseUrl, model, messages }) => {
  if (typeof baseUrl !== "string" || typeof model !== "string" || !Array.isArray(messages)) {
    throw new Error("Check your model settings and try again.");
  }

  let endpoint;
  try {
    const url = new URL(baseUrl);
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("The endpoint must use HTTP or HTTPS.");
    }
    endpoint = `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
  } catch (error) {
    throw new Error(error.message || "Enter a valid model endpoint URL.");
  }

  const requestUrl = endpoint.endsWith("/chat/completions")
    ? endpoint
    : `${endpoint}/chat/completions`;

  let response;
  try {
    response = await fetch(requestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model.trim(),
        messages: [
          {
            role: "system",
            content: [
              await getLocalInstructions(),
              ...((await getInstalledSkillIds())
                .map((id) => skills.find((skill) => skill.id === id))
                .filter(Boolean)
                .map((skill) => `## Installed skill: ${skill.name}\n${skill.instructions}`))
            ].join("\n\n")
          },
          ...messages.map(({ role, content }) => ({ role, content }))
        ],
        stream: false
      }),
      signal: AbortSignal.timeout(120_000)
    });
  } catch (error) {
    if (error.name === "TimeoutError") {
      throw new Error("The model took too long to respond. Check that it is running, then try again.");
    }
    throw new Error(`Could not reach your local model at ${requestUrl}. Check that it is running and try again.`);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error(`The model returned an unreadable response (HTTP ${response.status}).`);
  }

  if (!response.ok) {
    const detail = result?.error?.message || result?.message;
    throw new Error(detail || `The model returned an error (HTTP ${response.status}).`);
  }

  const content = result?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("The model returned an empty reply. Check the selected model and try again.");
  }

  return content.trim();
});

ipcMain.handle("model:test-connection", async (_event, { baseUrl, model }) => {
  if (typeof baseUrl !== "string" || typeof model !== "string" || !model.trim()) {
    throw new Error("Enter your model API URL and model name first.");
  }

  let endpoint;
  try {
    const url = new URL(baseUrl);
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("The endpoint must use HTTP or HTTPS.");
    }
    endpoint = `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
  } catch (error) {
    throw new Error(error.message || "Enter a valid model endpoint URL.");
  }

  const requestUrl = endpoint.endsWith("/chat/completions")
    ? endpoint
    : `${endpoint}/chat/completions`;
  let response;
  try {
    response = await fetch(requestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model.trim(),
        messages: [{ role: "user", content: "Reply with OK." }],
        max_tokens: 8,
        stream: false
      }),
      signal: AbortSignal.timeout(60_000)
    });
  } catch (error) {
    if (error.name === "TimeoutError") {
      throw new Error("The model took too long to answer the connection check. Make sure it is loaded, then try again.");
    }
    throw new Error(`Could not reach ${requestUrl}. Check that the server is running and the URL includes /v1 when required.`);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error(`The model endpoint returned an unreadable response (HTTP ${response.status}). Check that the URL points to an OpenAI-compatible chat completions API.`);
  }

  if (!response.ok) {
    const detail = result?.error?.message || result?.error || result?.message;
    throw new Error(
      typeof detail === "string" && detail
        ? `The model server returned HTTP ${response.status}: ${detail}`
        : `The model server returned HTTP ${response.status} for ${requestUrl}.`
    );
  }

  const content = result?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    const detail = result?.error?.message || result?.error || result?.message;
    throw new Error(
      typeof detail === "string" && detail
        ? `The model server did not complete a chat request: ${detail}. Check that the URL includes /v1 when required and that the model name is correct.`
        : "The model server did not return a chat completion. Check that the URL includes /v1 when required and that the model name is correct."
    );
  }

  return { connected: true };
});

ipcMain.handle("model:get-instructions", async () => ({
  content: await getLocalInstructions(),
  path: getUserInstructionsPath()
}));
ipcMain.handle("skills:list", async () => ({
  skills: skills.map(({ id, name, category, description }) => ({ id, name, category, description })),
  installedIds: await getInstalledSkillIds()
}));
ipcMain.handle("skills:install", async (_event, id) => {
  if (typeof id !== "string" || !skills.some((skill) => skill.id === id)) {
    throw new Error("That skill is not available to install.");
  }
  const installedIds = await getInstalledSkillIds();
  if (!installedIds.includes(id)) {
    installedIds.push(id);
    await saveInstalledSkillIds(installedIds);
  }
  return installedIds;
});
ipcMain.handle("skills:uninstall", async (_event, id) => {
  if (typeof id !== "string" || !skills.some((skill) => skill.id === id)) {
    throw new Error("That skill is not available to uninstall.");
  }
  const installedIds = (await getInstalledSkillIds()).filter((installedId) => installedId !== id);
  await saveInstalledSkillIds(installedIds);
  return installedIds;
});
ipcMain.handle("model:open-instructions", async () => {
  await getLocalInstructions();
  const error = await shell.openPath(getUserInstructionsPath());
  if (error) {
    console.error("Could not open the local assistant instructions:", error);
    throw new Error(`Could not open LOCAL_MODEL.md: ${error}`);
  }
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
