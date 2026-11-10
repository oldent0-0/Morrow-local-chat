const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("morrow", {
  chat: (request) => ipcRenderer.invoke("model:chat", request),
  testConnection: (baseUrl) => ipcRenderer.invoke("model:test-connection", baseUrl),
  getInstructions: () => ipcRenderer.invoke("model:get-instructions"),
  openInstructions: () => ipcRenderer.invoke("model:open-instructions"),
  listSkills: () => ipcRenderer.invoke("skills:list"),
  installSkill: (id) => ipcRenderer.invoke("skills:install", id),
  uninstallSkill: (id) => ipcRenderer.invoke("skills:uninstall", id)
});
