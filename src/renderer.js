const CHAT_STORAGE_KEY = "morrow.chats.v1";
const SETTINGS_STORAGE_KEY = "morrow.settings.v1";
const FOLDER_STORAGE_KEY = "morrow.folders.v1";
const MAX_LOGO_SIZE = 512 * 1024;
const themes = [
  { id: "ink-wash", name: "Ink Wash", colors: ["#252525", "#CFCFCF", "#7D7D7D", "#545454"], accent: "#CFCFCF", accentBright: "#F1F1F1", accentDeep: "#545454", bg: "#171717", rail: "#1C1C1C", surface: "#222222", raised: "#2B2B2B", hover: "#363636", border: "#454545", borderSoft: "#333333", text: "#F1F1F1", muted: "#BDBDBD", subtle: "#999999" },
  { id: "ocean-breeze", name: "Ocean Breeze", colors: ["#10075A", "#4776B1", "#68B2D4", "#ADDEED", "#D6EFF7"], accent: "#68B2D4", accentBright: "#ADDEED", accentDeep: "#10075A", bg: "#0D1025", rail: "#11152D", surface: "#171D38", raised: "#20294A", hover: "#283454", border: "#344263", borderSoft: "#293652", text: "#E8F4F8", muted: "#AFC7D8", subtle: "#879FB5" },
  { id: "fiery-red-sunset", name: "Fiery Red Sunset", colors: ["#05071D", "#2F0A17", "#5A1114", "#871A15", "#B3251A", "#BE3E20", "#CC6529", "#DB9035", "#E4A63C", "#ECBC43"], accent: "#CC6529", accentBright: "#ECBC43", accentDeep: "#5A1114", bg: "#110D18", rail: "#19101B", surface: "#21131E", raised: "#2C1920", hover: "#392024", border: "#4A2927", borderSoft: "#352126", text: "#F5ECE7", muted: "#C6A69A", subtle: "#A7877C" },
  { id: "cherry-blossom", name: "Cherry Blossom", colors: ["#F5DADB", "#CF6B8C", "#76173E", "#32343E", "#1D2021"], accent: "#CF6B8C", accentBright: "#F5DADB", accentDeep: "#76173E", bg: "#151719", rail: "#1B1B20", surface: "#242127", raised: "#302830", hover: "#3A2D37", border: "#4A3543", borderSoft: "#372A34", text: "#F5EBEF", muted: "#C4A9B2", subtle: "#A58D97" },
  { id: "gradient-blues", name: "Gradient Blues", colors: ["#6918B1", "#6662C7", "#75A7D9", "#7DBDDF", "#89CDDE", "#A2ECDD", "#AFFCDD"], accent: "#75A7D9", accentBright: "#AFFCDD", accentDeep: "#6918B1", bg: "#141323", rail: "#1A172D", surface: "#211D38", raised: "#2D2850", hover: "#39335C", border: "#49436D", borderSoft: "#39334F", text: "#EFEEF8", muted: "#BAB8D2", subtle: "#9391AF" },
  { id: "monochrome-beach", name: "Monochrome Beach", colors: ["#353535", "#4F6D70", "#FFFFFF", "#D9D9D9", "#364A61"], accent: "#4F6D70", accentBright: "#D9D9D9", accentDeep: "#364A61", bg: "#14191D", rail: "#1A2026", surface: "#222A30", raised: "#2C373E", hover: "#35434B", border: "#46545A", borderSoft: "#364249", text: "#F0F2F1", muted: "#B5C0C0", subtle: "#89999B" },
  { id: "mossy-woods", name: "Mossy Woods", colors: ["#0C100D", "#B9BAA5", "#D5D5CA", "#8D352F", "#7D3028"], accent: "#8D352F", accentBright: "#D5D5CA", accentDeep: "#7D3028", bg: "#11140F", rail: "#191B15", surface: "#23241D", raised: "#303027", hover: "#3B3B30", border: "#4D493C", borderSoft: "#39382E", text: "#F0EFE5", muted: "#BCBBA9", subtle: "#999887" },
  { id: "vibrant-sunset", name: "Vibrant Sunset", colors: ["#E1752E", "#E27F31", "#E38A34", "#E59537", "#E7A13A", "#200343", "#371068", "#532094", "#7134B8", "#9254D5"], accent: "#E27F31", accentBright: "#E7A13A", accentDeep: "#532094", bg: "#130A20", rail: "#1C102A", surface: "#241535", raised: "#321D48", hover: "#402650", border: "#52345E", borderSoft: "#3D2948", text: "#F7EFFA", muted: "#C9B6D2", subtle: "#A58EAE" }
];
const themeById = new Map(themes.map((theme) => [theme.id, theme]));
const assistantMark = `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M7 23.5V10.1c0-1.6 1.8-2.4 3-1.3l6 5.7 6-5.7c1.2-1.1 3-.3 3 1.3v13.4" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 23.5v-6.3l4 3.6 4-3.6v6.3" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const pageTitles = {
  chat: "Chat",
  connection: "Connection",
  sessions: "Sessions",
  skills: "Skills",
  channels: "Channels",
  instances: "Instances",
  cron: "Cron",
  advanced: "Advanced",
  diagnostics: "Diagnostics",
  themes: "Themes",
  settings: "Settings"
};

const elements = {
  chatView: document.querySelector("#view-chat"),
  composer: document.querySelector("#composer"),
  conversationScroll: document.querySelector("#conversation-scroll"),
  endpointInput: document.querySelector("#endpoint-input"),
  errorBanner: document.querySelector("#error-banner"),
  messageInput: document.querySelector("#message-input"),
  messages: document.querySelector("#messages"),
  workspaceScroll: document.querySelector("#workspace-scroll"),
  sendButton: document.querySelector("#send-button"),
  welcome: document.querySelector("#welcome"),
  connectionForm: document.querySelector("#connection-form"),
  connectionState: document.querySelector("#connection-state"),
  connectionFeedback: document.querySelector("#connection-feedback"),
  testConnection: document.querySelector("#test-connection"),
  modelInput: document.querySelector("#model-input"),
  pageTitle: document.querySelector("#page-title"),
  sessionList: document.querySelector("#session-list"),
  sessionCount: document.querySelector("#session-count"),
  sessionsState: document.querySelector("#sessions-state"),
  settingsSessionCount: document.querySelector("#settings-session-count"),
  navConnectionStatus: document.querySelector("#nav-connection-status"),
  sidebarStatusDot: document.querySelector("#sidebar-status-dot"),
  sidebarStatusText: document.querySelector("#sidebar-status-text"),
  instanceModelDetail: document.querySelector("#instance-model-detail"),
  instanceModelState: document.querySelector("#instance-model-state"),
  advancedEndpoint: document.querySelector("#advanced-endpoint"),
  advancedModel: document.querySelector("#advanced-model"),
  promptPreview: document.querySelector("#prompt-preview"),
  promptPath: document.querySelector("#prompt-path"),
  skillsList: document.querySelector("#skills-list"),
  skillsInstalledCount: document.querySelector("#skills-installed-count"),
  skillsFeedback: document.querySelector("#skills-feedback"),
  chatHistoryList: document.querySelector("#chat-history-list"),
  chatSidebarContent: document.querySelector("#chat-sidebar-content"),
  folderList: document.querySelector("#folder-list"),
  chatSearchInput: document.querySelector("#chat-search-input"),
  searchClear: document.querySelector("#search-clear"),
  chatSearchEmpty: document.querySelector("#chat-search-empty"),
  settingsNavigation: document.querySelector("#settings-navigation"),
  sidebarTitle: document.querySelector("#sidebar-title"),
  sidebarNewChat: document.querySelector("#sidebar-new-chat"),
  settingsBack: document.querySelector("#settings-back"),
  sidebarSettings: document.querySelector("#sidebar-settings"),
  diagnosticIndicator: document.querySelector("#diagnostic-model-indicator"),
  diagnosticDescription: document.querySelector("#diagnostic-model-description"),
  diagnosticResult: document.querySelector("#diagnostic-model-result"),
  themeOptions: document.querySelector("#theme-options"),
  themeFeedback: document.querySelector("#theme-feedback"),
  logoInput: document.querySelector("#logo-input"),
  logoPreviewImage: document.querySelector("#logo-preview-image"),
  logoPreviewDefault: document.querySelector("#logo-preview-default"),
  logoFeedback: document.querySelector("#logo-feedback"),
  chooseLogo: document.querySelector("#choose-logo"),
  resetLogo: document.querySelector("#reset-logo")
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Unable to read ${key} from local storage:`, error);
    return fallback;
  }
}

function createChat() {
  return { id: crypto.randomUUID(), title: "New chat", messages: [] };
}

function readChats() {
  const savedChats = readStorage(CHAT_STORAGE_KEY, []);
  if (!Array.isArray(savedChats)) return [];
  return savedChats.filter((chat) =>
    chat && typeof chat.id === "string" && typeof chat.title === "string" &&
    Array.isArray(chat.messages) &&
    chat.messages.every((message) =>
      message && ["user", "assistant"].includes(message.role) && typeof message.content === "string"
    )
  );
}

const chats = readChats();
const storedFolders = readStorage(FOLDER_STORAGE_KEY, []);
const folders = Array.isArray(storedFolders)
  ? storedFolders.filter((folder) =>
    folder && typeof folder.id === "string" && typeof folder.name === "string"
  )
  : [];
const storedSettings = readStorage(SETTINGS_STORAGE_KEY, {});
const settings = storedSettings && typeof storedSettings === "object" && !Array.isArray(storedSettings)
  ? storedSettings
  : {};
let activeChatId = chats[0]?.id ?? "";
let selectedFolderId = "";
let activeView = "chat";
let isSending = false;
let isConnected = false;
let availableSkills = [];
let installedSkillIds = [];

function persistChats() {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error("Unable to save chat history:", error);
    showError("Your chat could not be saved to this device. Check available disk space and try again.");
  }
}

function persistSettings() {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error("Unable to save model settings:", error);
    setConnectionFeedback("Your settings could not be saved. Check available disk space and try again.", true);
    return false;
  }
}

settings.theme = themeById.has(settings.theme) ? settings.theme : "ink-wash";
if (typeof settings.logoData !== "string" ||
  !/^data:image\/(?:png|jpeg|webp|gif);base64,/.test(settings.logoData) ||
  settings.logoData.length > Math.ceil(MAX_LOGO_SIZE / 3) * 4 + 32) {
  delete settings.logoData;
}

function showCustomizationFeedback(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("error", isError);
}

function applyTheme() {
  const theme = themeById.get(settings.theme);
  if (!theme) return;
  document.documentElement.dataset.theme = theme.id;
  for (const button of elements.themeOptions.querySelectorAll("[data-theme-id]")) {
    button.setAttribute("aria-pressed", String(button.dataset.themeId === theme.id));
  }
}

function renderThemeOptions() {
  elements.themeOptions.replaceChildren();
  for (const theme of themes) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-option";
    button.dataset.themeId = theme.id;
    button.setAttribute("aria-pressed", String(theme.id === settings.theme));
    button.setAttribute("aria-label", `${theme.name} theme`);
    const swatches = document.createElement("span");
    swatches.className = "theme-swatches";
    swatches.setAttribute("aria-hidden", "true");
    swatches.style.setProperty("--swatch-count", String(theme.colors.length));
    for (const color of theme.colors) {
      const swatch = document.createElement("span");
      swatch.style.backgroundColor = color;
      swatches.append(swatch);
    }
    const name = document.createElement("span");
    name.className = "theme-option-name";
    name.textContent = theme.name;
    button.append(swatches, name);
    button.addEventListener("click", () => {
      const previousTheme = settings.theme;
      settings.theme = theme.id;
      applyTheme();
      if (!persistSettings()) {
        settings.theme = previousTheme;
        applyTheme();
        showCustomizationFeedback(elements.themeFeedback, "Unable to save this theme. Check available disk space and try again.", true);
        return;
      }
      showCustomizationFeedback(elements.themeFeedback, `${theme.name} theme applied and saved.`);
    });
    elements.themeOptions.append(button);
  }
}

function updateLogoPreview() {
  const hasLogo = Boolean(settings.logoData);
  elements.logoPreviewImage.hidden = !hasLogo;
  elements.logoPreviewDefault.hidden = hasLogo;
  elements.resetLogo.disabled = !hasLogo;
  if (hasLogo) elements.logoPreviewImage.src = settings.logoData;
  else elements.logoPreviewImage.removeAttribute("src");
}

function setAssistantMark(container) {
  if (!settings.logoData) {
    container.innerHTML = assistantMark;
    return;
  }
  const image = document.createElement("img");
  image.className = "assistant-custom-logo";
  image.alt = "";
  image.src = settings.logoData;
  container.replaceChildren(image);
}

function applyCustomization() {
  applyTheme();
  updateLogoPreview();
  setAssistantMark(document.querySelector(".welcome-mark"));
}

function applyLogo() {
  updateLogoPreview();
  setAssistantMark(document.querySelector(".welcome-mark"));
  renderMessages();
}

function activeChat() {
  return chats.find((chat) => chat.id === activeChatId);
}

function modelIsConfigured() {
  return typeof settings.endpoint === "string" && Boolean(settings.endpoint.trim()) &&
    typeof settings.model === "string" && Boolean(settings.model.trim());
}

function switchView(view) {
  if (!Object.hasOwn(pageTitles, view)) return;
  activeView = view;
  elements.pageTitle.textContent = pageTitles[view];
  const settingsMode = view !== "chat";
  elements.sidebarTitle.textContent = settingsMode ? "Settings" : "Chats";
  elements.chatSidebarContent.hidden = settingsMode;
  elements.settingsNavigation.hidden = !settingsMode;
  elements.sidebarNewChat.hidden = settingsMode;
  elements.settingsBack.hidden = !settingsMode;
  elements.sidebarSettings.setAttribute("aria-current", String(settingsMode));

  for (const [name, title] of Object.entries(pageTitles)) {
    const panel = document.querySelector(`#view-${name}`);
    if (panel) {
      panel.hidden = name !== view;
      panel.classList.toggle("visible", name === view);
    }
  }

  for (const menuLink of document.querySelectorAll(".menu-link[data-view]")) {
    menuLink.classList.toggle("active", menuLink.dataset.view === view);
    if (menuLink.dataset.view === view) menuLink.setAttribute("aria-current", "page");
    else menuLink.removeAttribute("aria-current");
  }

  if (view === "sessions") renderSessions();
  if (view === "skills") {
    void loadPromptPreview();
    void loadSkills();
  }
  elements.workspaceScroll.scrollTop = 0;
  if (view === "chat") elements.conversationScroll.scrollTop = elements.conversationScroll.scrollHeight;
}

function renderMessage(message) {
  const row = document.createElement("article");
  row.className = `message ${message.role}`;

  if (message.role === "assistant") {
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    setAssistantMark(avatar);
    avatar.setAttribute("aria-label", "Morrow");
    row.append(avatar);
  }

  const content = document.createElement("div");
  content.className = "message-content";
  content.textContent = message.content;
  row.append(content);
  return row;
}

function renderMessages() {
  const chat = activeChat();
  elements.messages.replaceChildren();
  elements.welcome.hidden = Boolean(chat?.messages.length);

  if (chat) {
    for (const message of chat.messages) elements.messages.append(renderMessage(message));
  }

  if (isSending && activeView === "chat" && chat) {
    const row = document.createElement("div");
    row.className = "message assistant";
    row.setAttribute("aria-label", "Model is responding");
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    setAssistantMark(avatar);
    const dots = document.createElement("div");
    dots.className = "typing-dots";
    dots.innerHTML = "<span></span><span></span><span></span>";
    row.append(avatar, dots);
    elements.messages.append(row);
  }

  elements.conversationScroll.scrollTop = elements.conversationScroll.scrollHeight;
}

function renderSessions() {
  elements.sessionList.replaceChildren();
  const count = chats.length;
  elements.sessionCount.textContent = String(count);
  elements.sessionsState.textContent = `${count} SAVED`;
  elements.settingsSessionCount.textContent = String(count);

  if (count === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No saved conversations yet. Start a chat and your sessions will show up here.";
    elements.sessionList.append(empty);
    return;
  }

  for (const chat of chats) {
    const card = document.createElement("div");
    card.className = "session-card";

    const open = document.createElement("button");
    open.className = "session-open";
    open.type = "button";
    open.setAttribute("aria-label", `Open conversation: ${chat.title}`);

    const symbol = document.createElement("span");
    symbol.className = "session-symbol";
    symbol.setAttribute("aria-hidden", "true");
    symbol.textContent = "↳";

    const copy = document.createElement("span");
    copy.className = "session-copy";
    const title = document.createElement("strong");
    title.textContent = chat.title;
    const detail = document.createElement("span");
    const messageCount = chat.messages.length;
    detail.textContent = `${messageCount} ${messageCount === 1 ? "message" : "messages"} · Saved on this device`;
    copy.append(title, detail);
    open.append(symbol, copy);
    open.addEventListener("click", () => {
      activeChatId = chat.id;
      clearError();
      renderMessages();
      switchView("chat");
    });

    const remove = document.createElement("button");
    remove.className = "session-delete";
    remove.type = "button";
    remove.textContent = "Delete";
    remove.setAttribute("aria-label", `Delete conversation: ${chat.title}`);
    remove.addEventListener("click", () => deleteChat(chat.id));

    card.append(open, remove);
    elements.sessionList.append(card);
  }
}

function saveFolders() {
  try {
    localStorage.setItem(FOLDER_STORAGE_KEY, JSON.stringify(folders));
  } catch (error) {
    console.error("Unable to save chat folders:", error);
    showError("Your folders could not be saved to this device. Check available disk space and try again.");
  }
}

function getVisibleChats(folderId = null) {
  const query = elements.chatSearchInput.value.trim().toLocaleLowerCase();
  return chats.filter((chat) => {
    const belongsToFolder = folderId === null
      ? !folders.some((folder) => folder.id === chat.folderId)
      : chat.folderId === folderId;
    return belongsToFolder && (!query || chat.title.toLocaleLowerCase().includes(query));
  });
}

function createChatRow(chat) {
  const row = document.createElement("div");
  row.className = `history-row${chat.id === activeChatId ? " active" : ""}`;

  const openButton = document.createElement("button");
  openButton.className = "history-chat-button";
  openButton.type = "button";
  openButton.title = chat.title;
  openButton.setAttribute("aria-current", chat.id === activeChatId ? "page" : "false");
  openButton.textContent = chat.title;
  openButton.addEventListener("click", () => {
    activeChatId = chat.id;
    clearError();
    render();
    switchView("chat");
  });

  const actionsButton = document.createElement("button");
  actionsButton.className = "history-actions-button";
  actionsButton.type = "button";
  actionsButton.title = "Conversation options";
  actionsButton.setAttribute("aria-label", `Options for ${chat.title}`);
  actionsButton.setAttribute("aria-expanded", "false");
  actionsButton.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="3" cy="8" r="1" fill="currentColor"/><circle cx="8" cy="8" r="1" fill="currentColor"/><circle cx="13" cy="8" r="1" fill="currentColor"/></svg>';

  const actions = document.createElement("div");
  actions.className = "history-actions-menu";
  actions.hidden = true;
  actionsButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const wasOpen = !actions.hidden;
    document.querySelectorAll(".history-actions-menu").forEach((menu) => { menu.hidden = true; });
    document.querySelectorAll(".history-actions-button").forEach((button) => button.setAttribute("aria-expanded", "false"));
    actions.hidden = wasOpen;
    actionsButton.setAttribute("aria-expanded", String(!wasOpen));
  });

  const rename = document.createElement("button");
  rename.type = "button";
  rename.textContent = "Rename";
  rename.addEventListener("click", () => {
    const title = window.prompt("Rename conversation", chat.title)?.trim();
    if (!title) return;
    chat.title = title;
    persistChats();
    render();
  });

  const move = document.createElement("button");
  move.type = "button";
  move.textContent = chat.folderId ? "Move to Chats" : "Move to folder…";
  move.addEventListener("click", () => {
    if (!chat.folderId && folders.length > 0) {
      const choices = folders.map((folder, index) => `${index + 1}. ${folder.name}`).join("\n");
      const selection = Number.parseInt(window.prompt(`Move to which folder?\n${choices}`, "1"), 10);
      if (!Number.isInteger(selection) || selection < 1 || selection > folders.length) return;
      chat.folderId = folders[selection - 1].id;
      selectedFolderId = chat.folderId;
    } else {
      delete chat.folderId;
    }
    persistChats();
    render();
  });
  move.disabled = !chat.folderId && folders.length === 0;
  if (move.disabled) move.title = "Create a folder first";

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "delete-chat-action";
  remove.textContent = "Delete";
  remove.addEventListener("click", () => deleteChat(chat.id));

  actions.append(rename, move, remove);
  row.append(openButton, actionsButton, actions);
  return row;
}

function renderChatSidebar() {
  const query = elements.chatSearchInput.value.trim();
  elements.folderList.replaceChildren();
  elements.chatHistoryList.replaceChildren();

  let visibleCount = 0;
  for (const folder of folders) {
    const matchingChats = getVisibleChats(folder.id);
    if (query && matchingChats.length === 0) continue;

    const folderRow = document.createElement("div");
    folderRow.className = `history-row folder-row${selectedFolderId === folder.id ? " selected" : ""}`;
    const toggle = document.createElement("button");
    toggle.className = "folder-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", String(!folder.collapsed));
    toggle.setAttribute("aria-label", `${folder.collapsed ? "Expand" : "Collapse"} folder ${folder.name}`);
    toggle.innerHTML = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    toggle.addEventListener("click", () => {
      folder.collapsed = !folder.collapsed;
      saveFolders();
      renderChatSidebar();
    });

    const selectFolder = document.createElement("button");
    selectFolder.className = "folder-name";
    selectFolder.type = "button";
    selectFolder.title = folder.name;
    selectFolder.textContent = folder.name;
    selectFolder.addEventListener("click", () => {
      selectedFolderId = selectedFolderId === folder.id ? "" : folder.id;
      renderChatSidebar();
    });

    const folderMenuButton = document.createElement("button");
    folderMenuButton.className = "history-actions-button folder-actions-button";
    folderMenuButton.type = "button";
    folderMenuButton.title = "Folder options";
    folderMenuButton.setAttribute("aria-label", `Options for folder ${folder.name}`);
    folderMenuButton.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="3" cy="8" r="1" fill="currentColor"/><circle cx="8" cy="8" r="1" fill="currentColor"/><circle cx="13" cy="8" r="1" fill="currentColor"/></svg>';
    folderMenuButton.addEventListener("click", () => {
      const name = window.prompt("Rename folder", folder.name)?.trim();
      if (!name) return;
      folder.name = name;
      saveFolders();
      renderChatSidebar();
    });

    folderRow.append(toggle, selectFolder, folderMenuButton);
    elements.folderList.append(folderRow);
    visibleCount += matchingChats.length;
    if (!folder.collapsed || query) {
      for (const chat of matchingChats) {
        const chatRow = createChatRow(chat);
        chatRow.classList.add("nested-chat");
        elements.folderList.append(chatRow);
      }
    }
  }

  const unfiledChats = getVisibleChats();
  visibleCount += unfiledChats.length;
  for (const chat of unfiledChats) elements.chatHistoryList.append(createChatRow(chat));
  elements.chatSearchEmpty.hidden = !query || visibleCount > 0;
}

function updateConnectionStatus() {
  const configured = modelIsConfigured();
  elements.connectionState.textContent = isConnected ? "CONNECTED" : configured ? "CONFIGURED" : "NOT CONNECTED";
  elements.navConnectionStatus.classList.toggle("ready", isConnected);
  elements.navConnectionStatus.setAttribute("aria-label", isConnected ? "Model connected" : configured ? "Model configured" : "Model not connected");
  elements.sidebarStatusDot.classList.toggle("ready", isConnected);
  elements.sidebarStatusText.textContent = isConnected
    ? `Connected · ${settings.model.trim()}`
    : configured ? "Model configured · not checked" : "Local · not connected";
  elements.instanceModelDetail.textContent = configured ? `${settings.model.trim()} · ${settings.endpoint.trim()}` : "Not configured";
  elements.instanceModelState.textContent = isConnected ? "CONNECTED" : configured ? "NOT CHECKED" : "NOT CONFIGURED";
  elements.instanceModelState.className = isConnected ? "online-badge" : "offline-badge";
  elements.advancedEndpoint.textContent = configured ? settings.endpoint.trim() : "Not configured";
  elements.advancedModel.textContent = configured ? settings.model.trim() : "Not configured";
}

function render() {
  renderMessages();
  renderSessions();
  renderChatSidebar();
  updateConnectionStatus();
}

function showError(message, actions = []) {
  elements.errorBanner.replaceChildren(document.createTextNode(message));
  for (const action of actions) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", action.onClick);
    elements.errorBanner.append(button);
  }
  elements.errorBanner.hidden = false;
  elements.conversationScroll.scrollTop = elements.conversationScroll.scrollHeight;
}

function clearError() {
  elements.errorBanner.hidden = true;
  elements.errorBanner.replaceChildren();
}

function setConnectionFeedback(message, isError = false) {
  elements.connectionFeedback.textContent = message;
  elements.connectionFeedback.classList.toggle("error", isError);
  elements.connectionFeedback.hidden = false;
}

function startNewChat() {
  const chat = createChat();
  if (selectedFolderId && folders.some((folder) => folder.id === selectedFolderId)) {
    chat.folderId = selectedFolderId;
  }
  chats.unshift(chat);
  activeChatId = chat.id;
  clearError();
  persistChats();
  render();
  switchView("chat");
  elements.messageInput.focus();
}

function deleteChat(chatId) {
  const chatIndex = chats.findIndex((chat) => chat.id === chatId);
  if (chatIndex === -1) return;
  chats.splice(chatIndex, 1);
  if (activeChatId === chatId) activeChatId = chats[0]?.id ?? "";
  persistChats();
  render();
}

async function loadPromptPreview() {
  elements.promptPreview.textContent = "Loading local model instructions…";
  try {
    const instructions = await window.morrow.getInstructions();
    elements.promptPreview.textContent = instructions.content;
    elements.promptPath.textContent = instructions.path;
  } catch (error) {
    console.error("Could not load local model instructions:", error);
    elements.promptPreview.textContent = error.message || "Could not load LOCAL_MODEL.md.";
    elements.promptPath.textContent = "Unavailable";
  }
}

function renderSkills() {
  elements.skillsList.replaceChildren();
  elements.skillsInstalledCount.textContent = `${installedSkillIds.length} INSTALLED`;

  if (availableSkills.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No skills are available right now.";
    elements.skillsList.append(empty);
    return;
  }

  for (const skill of availableSkills) {
    const installed = installedSkillIds.includes(skill.id);
    const card = document.createElement("article");
    card.className = "skill-card";

    const category = document.createElement("span");
    category.className = "skill-category";
    category.textContent = skill.category;
    const title = document.createElement("h3");
    title.textContent = skill.name;
    const description = document.createElement("p");
    description.textContent = skill.description;
    const footer = document.createElement("div");
    footer.className = "skill-card-footer";
    const state = document.createElement("span");
    state.className = installed ? "skill-installed" : "skill-available";
    state.textContent = installed ? "Installed" : "Available";
    const button = document.createElement("button");
    button.className = installed ? "secondary-button" : "primary-button";
    button.type = "button";
    button.textContent = installed ? "Uninstall" : "Install";
    button.addEventListener("click", () => void changeSkillInstallation(skill.id, !installed, button));
    footer.append(state, button);
    card.append(category, title, description, footer);
    elements.skillsList.append(card);
  }
}

async function loadSkills() {
  elements.skillsFeedback.hidden = true;
  elements.skillsList.replaceChildren();
  const loading = document.createElement("div");
  loading.className = "empty-state";
  loading.textContent = "Loading available skills…";
  elements.skillsList.append(loading);
  try {
    const result = await window.morrow.listSkills();
    availableSkills = result.skills;
    installedSkillIds = result.installedIds;
    renderSkills();
  } catch (error) {
    console.error("Could not load available skills:", error);
    elements.skillsList.replaceChildren();
    const message = document.createElement("div");
    message.className = "empty-state";
    message.textContent = error.message || "Could not load available skills.";
    elements.skillsList.append(message);
  }
}

async function changeSkillInstallation(id, shouldInstall, button) {
  button.disabled = true;
  elements.skillsFeedback.hidden = true;
  try {
    installedSkillIds = shouldInstall
      ? await window.morrow.installSkill(id)
      : await window.morrow.uninstallSkill(id);
    renderSkills();
    elements.skillsFeedback.textContent = shouldInstall
      ? "Skill installed. It will guide future chat replies."
      : "Skill uninstalled. It will no longer guide future chat replies.";
    elements.skillsFeedback.hidden = false;
  } catch (error) {
    console.error("Could not update installed skills:", error);
    elements.skillsFeedback.textContent = error.message || "Could not update installed skills.";
    elements.skillsFeedback.hidden = false;
    button.disabled = false;
  }
}

function setBusy(busy) {
  isSending = busy;
  elements.messageInput.disabled = busy;
  elements.sendButton.disabled = busy || !elements.messageInput.value.trim();
  renderMessages();
}

async function requestReply(chat) {
  clearError();
  setBusy(true);
  try {
    const content = await window.morrow.chat({
      baseUrl: settings.endpoint.trim(),
      model: settings.model.trim(),
      messages: chat.messages.map(({ role, content }) => ({ role, content }))
    });
    chat.messages.push({ role: "assistant", content });
    isConnected = true;
    persistChats();
    render();
  } catch (error) {
    console.error("Local model request failed:", error);
    showError(error.message || "The local model could not reply.", [
      { label: "Retry", onClick: () => requestReply(chat) },
      { label: "Connection settings", onClick: () => switchView("connection") }
    ]);
  } finally {
    setBusy(false);
    updateConnectionStatus();
  }
}

async function sendMessage(text) {
  if (isSending) return;
  if (!modelIsConfigured()) {
    switchView("connection");
    setConnectionFeedback("Connect your local model before starting a conversation.", true);
    return;
  }

  let chat = activeChat();
  if (!chat) {
    chat = createChat();
    chats.unshift(chat);
    activeChatId = chat.id;
  }

  const cleanText = text.trim();
  if (!cleanText) return;
  chat.messages.push({ role: "user", content: cleanText });
  if (chat.title === "New chat") {
    chat.title = cleanText.replace(/\s+/g, " ").slice(0, 34) || "New chat";
    if (cleanText.length > 34) chat.title += "…";
  }
  elements.messageInput.value = "";
  resizeInput();
  persistChats();
  render();
  await requestReply(chat);
}

function resizeInput() {
  elements.messageInput.style.height = "auto";
  elements.messageInput.style.height = `${Math.min(elements.messageInput.scrollHeight, 140)}px`;
  elements.sendButton.disabled = isSending || !elements.messageInput.value.trim();
}

async function checkConnection(baseUrl = settings.endpoint, model = settings.model) {
  if (typeof baseUrl !== "string" || !baseUrl.trim()) {
    throw new Error("Enter your model API base URL first.");
  }
  if (typeof model !== "string" || !model.trim()) {
    throw new Error("Enter your model name first.");
  }
  await window.morrow.testConnection({ baseUrl: baseUrl.trim(), model: model.trim() });
  return true;
}

for (const item of document.querySelectorAll("[data-view]")) {
  item.addEventListener("click", () => switchView(item.dataset.view));
}

document.querySelector("#sidebar-new-chat").addEventListener("click", startNewChat);
elements.sidebarSettings.addEventListener("click", () => switchView("settings"));
elements.settingsBack.addEventListener("click", () => switchView("chat"));
document.querySelector("#new-folder-button").addEventListener("click", () => {
  const name = window.prompt("Name this folder")?.trim();
  if (!name) return;
  const folder = { id: crypto.randomUUID(), name, collapsed: false };
  folders.push(folder);
  selectedFolderId = folder.id;
  saveFolders();
  renderChatSidebar();
});
elements.chatSearchInput.addEventListener("input", () => {
  elements.searchClear.classList.toggle("visible", Boolean(elements.chatSearchInput.value));
  renderChatSidebar();
});
elements.searchClear.addEventListener("click", () => {
  elements.chatSearchInput.value = "";
  elements.searchClear.classList.remove("visible");
  renderChatSidebar();
  elements.chatSearchInput.focus();
});
elements.composer.addEventListener("submit", (event) => {
  event.preventDefault();
  void sendMessage(elements.messageInput.value);
});

elements.messageInput.addEventListener("input", resizeInput);
elements.messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    elements.composer.requestSubmit();
  }
});

elements.connectionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  settings.endpoint = elements.endpointInput.value.trim().replace(/\/+$/, "");
  settings.model = elements.modelInput.value.trim();
  isConnected = false;
  persistSettings();
  updateConnectionStatus();
  setConnectionFeedback("Connection settings saved. Test the connection or start a chat.", false);
});

elements.testConnection.addEventListener("click", async () => {
  const baseUrl = elements.endpointInput.value.trim();
  const model = elements.modelInput.value.trim();
  elements.testConnection.disabled = true;
  elements.testConnection.textContent = "Checking…";
  setConnectionFeedback("Sending a short test prompt to your selected model…");

  try {
    await checkConnection(baseUrl, model);
    settings.endpoint = baseUrl.replace(/\/+$/, "");
    settings.model = model;
    persistSettings();
    isConnected = true;
    updateConnectionStatus();
    setConnectionFeedback("Connected. Your local model API is responding.");
  } catch (error) {
    console.error("Model connection check failed:", error);
    isConnected = false;
    updateConnectionStatus();
    setConnectionFeedback(error.message || "Could not connect to your local model.", true);
  } finally {
    elements.testConnection.disabled = false;
    elements.testConnection.textContent = "Send test prompt";
  }
});

document.querySelector("#run-diagnostics").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  button.textContent = "Checking…";
  elements.diagnosticIndicator.classList.remove("failed");
  elements.diagnosticDescription.textContent = "Checking your configured model endpoint…";
  elements.diagnosticResult.textContent = "CHECKING";

  try {
    await checkConnection();
    isConnected = true;
    elements.diagnosticIndicator.classList.add("okay");
    elements.diagnosticDescription.textContent = `The model server responded at ${settings.endpoint.trim()}.`;
    elements.diagnosticResult.textContent = "CONNECTED";
  } catch (error) {
    isConnected = false;
    elements.diagnosticIndicator.classList.remove("okay");
    elements.diagnosticIndicator.classList.add("failed");
    elements.diagnosticDescription.textContent = error.message || "Could not connect to the configured endpoint.";
    elements.diagnosticResult.textContent = "FAILED";
  } finally {
    updateConnectionStatus();
    button.disabled = false;
    button.textContent = "Run connection check";
  }
});

document.querySelector("#reload-prompt").addEventListener("click", () => void loadPromptPreview());
document.querySelector("#open-prompt").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  try {
    await window.morrow.openInstructions();
  } catch (error) {
    console.error("Could not open local model instructions:", error);
    elements.promptPath.textContent = error.message || "Could not open LOCAL_MODEL.md.";
  } finally {
    button.disabled = false;
  }
});
elements.chooseLogo.addEventListener("click", () => elements.logoInput.click());
elements.logoInput.addEventListener("change", () => {
  const file = elements.logoInput.files?.[0];
  if (!file) return;
  const supportedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  if (!supportedTypes.includes(file.type)) {
    showCustomizationFeedback(elements.logoFeedback, "Choose a PNG, JPEG, WebP, or GIF image.", true);
    elements.logoInput.value = "";
    return;
  }
  if (file.size === 0 || file.size > MAX_LOGO_SIZE) {
    showCustomizationFeedback(elements.logoFeedback, "Choose an image between 1 byte and 512 KB.", true);
    elements.logoInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("error", () => {
    showCustomizationFeedback(elements.logoFeedback, "The image could not be read. Choose another file and try again.", true);
    elements.logoInput.value = "";
  }, { once: true });
  reader.addEventListener("load", () => {
    if (typeof reader.result !== "string" || !reader.result.startsWith(`data:${file.type};base64,`)) {
      showCustomizationFeedback(elements.logoFeedback, "The image could not be read. Choose another file and try again.", true);
      elements.logoInput.value = "";
      return;
    }

    const previousLogo = settings.logoData;
    settings.logoData = reader.result;
    applyLogo();
    if (!persistSettings()) {
      if (previousLogo) settings.logoData = previousLogo;
      else delete settings.logoData;
      applyLogo();
      showCustomizationFeedback(elements.logoFeedback, "Unable to save this logo. Check available disk space and try again.", true);
    } else {
      showCustomizationFeedback(elements.logoFeedback, `${file.name} saved as your workspace logo.`);
    }
    elements.logoInput.value = "";
  }, { once: true });
  reader.readAsDataURL(file);
});
elements.resetLogo.addEventListener("click", () => {
  if (!settings.logoData) return;
  const previousLogo = settings.logoData;
  delete settings.logoData;
  applyLogo();
  if (!persistSettings()) {
    settings.logoData = previousLogo;
    applyLogo();
    showCustomizationFeedback(elements.logoFeedback, "Unable to reset the logo. Check available disk space and try again.", true);
  } else {
    showCustomizationFeedback(elements.logoFeedback, "Default Morrow logo restored.");
  }
});
document.querySelector("#clear-history").addEventListener("click", () => {
  if (!window.confirm("Delete all saved conversations on this computer? This cannot be undone.")) return;
  chats.splice(0, chats.length);
  activeChatId = "";
  persistChats();
  clearError();
  render();
});

document.querySelectorAll(".suggestion").forEach((button) => {
  button.addEventListener("click", () => void sendMessage(button.dataset.prompt));
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    startNewChat();
  }
  if (event.key === "Escape") {
    document.querySelectorAll(".history-actions-menu").forEach((menu) => { menu.hidden = true; });
  }
});

if (modelIsConfigured()) {
  elements.endpointInput.value = settings.endpoint;
  elements.modelInput.value = settings.model;
} else {
  switchView("connection");
}

renderThemeOptions();
applyCustomization();
render();
