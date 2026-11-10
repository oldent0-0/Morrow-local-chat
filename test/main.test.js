const assert = require("node:assert/strict");
const { mkdtemp, readFile, rm, writeFile } = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const appRoot = path.resolve(__dirname, "..");
const mainSource = require("node:fs").readFileSync(path.join(appRoot, "src", "main.js"), "utf8");

function createHandlers(fetchImpl = async () => ({ ok: true, status: 200 }), userDataPath = appRoot) {
  const handlers = new Map();
  const electron = {
    app: {
      getAppPath: () => appRoot,
      getPath: () => userDataPath,
      whenReady: () => ({ then: () => {} }),
      on: () => {},
      quit: () => {}
    },
    shell: { openPath: async () => "" },
    BrowserWindow: class {},
    ipcMain: { handle: (name, handler) => handlers.set(name, handler) }
  };

  vm.runInNewContext(mainSource, {
    AbortSignal,
    URL,
    __dirname: path.join(appRoot, "src"),
    console,
    fetch: fetchImpl,
    require: (name) => {
      if (name === "electron") return electron;
      if (name === "./skills") return require(path.join(appRoot, "src", "skills.js"));
      return require(name);
    }
  }, { filename: path.join(appRoot, "src", "main.js") });

  return handlers;
}

test("chat prepends LOCAL_MODEL.md as a system instruction", async () => {
  let request;
  const handlers = createHandlers(async (url, options) => {
    request = { url, options };
    return {
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: "At your service." } }] })
    };
  });

  const reply = await handlers.get("model:chat")({}, {
    baseUrl: "http://localhost:11434/v1",
    model: "test-model",
    messages: [{ role: "user", content: "Hello" }]
  });
  const instructions = await readFile(path.join(appRoot, "LOCAL_MODEL.md"), "utf8");
  const payload = JSON.parse(request.options.body);

  assert.equal(reply, "At your service.");
  assert.equal(request.url, "http://localhost:11434/v1/chat/completions");
  assert.equal(payload.model, "test-model");
  assert.equal(payload.messages[0].role, "system");
  assert.equal(payload.messages[0].content, instructions);
  assert.deepEqual(payload.messages[1], { role: "user", content: "Hello" });
});

test("connection check sends a short chat completion to the selected model", async () => {
  let requestedUrl;
  let requestOptions;
  const handlers = createHandlers(async (url, options) => {
    requestedUrl = url;
    requestOptions = options;
    return {
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: "OK" } }] })
    };
  });

  const result = await handlers.get("model:test-connection")({}, {
    baseUrl: "http://localhost:11434/v1/",
    model: "test-model"
  });

  assert.equal(requestedUrl, "http://localhost:11434/v1/chat/completions");
  assert.equal(requestOptions.method, "POST");
  assert.equal(JSON.parse(requestOptions.body).model, "test-model");
  assert.equal(JSON.parse(requestOptions.body).messages[0].content, "Reply with OK.");
  assert.equal(result.connected, true);
});

test("connection check rejects non-HTTP endpoints", async () => {
  const handlers = createHandlers(async () => {
    throw new Error("fetch should not run");
  });

  await assert.rejects(
    handlers.get("model:test-connection")({}, { baseUrl: "file:///tmp/model", model: "test-model" }),
    /HTTP or HTTPS/
  );
});

test("connection check rejects a server that returns 200 without a chat completion", async () => {
  const handlers = createHandlers(async () => ({
    ok: true,
    status: 200,
    json: async () => ({ error: "Unexpected endpoint or method." })
  }));

  await assert.rejects(
    handlers.get("model:test-connection")({}, {
      baseUrl: "http://localhost:11434/v1",
      model: "test-model"
    }),
    /Unexpected endpoint or method/
  );
});

test("instructions can be opened from their editable local data path", async () => {
  const handlers = createHandlers();
  const result = await handlers.get("model:get-instructions")({});

  assert.equal(result.path, path.join(appRoot, "LOCAL_MODEL.md"));
  assert.match(result.content, /thoughtful technical aide/);
  await handlers.get("model:open-instructions")({});
});

test("first use creates a persistent editable copy of the bundled instructions", async (t) => {
  const userDataPath = await mkdtemp(path.join(os.tmpdir(), "morrow-test-"));
  t.after(() => rm(userDataPath, { recursive: true, force: true }));
  const handlers = createHandlers(undefined, userDataPath);

  const initial = await handlers.get("model:get-instructions")({});
  const bundled = await readFile(path.join(appRoot, "LOCAL_MODEL.md"), "utf8");
  assert.equal(initial.path, path.join(userDataPath, "LOCAL_MODEL.md"));
  assert.equal(initial.content, bundled);

  const editedInstructions = `${bundled}\nAdditional personal preference.`;
  await writeFile(initial.path, editedInstructions, "utf8");
  const afterEdit = await handlers.get("model:get-instructions")({});
  assert.equal(afterEdit.content, editedInstructions);
});

test("skills can be installed locally and guide subsequent chat requests", async (t) => {
  const userDataPath = await mkdtemp(path.join(os.tmpdir(), "morrow-skills-test-"));
  t.after(() => rm(userDataPath, { recursive: true, force: true }));
  let request;
  const handlers = createHandlers(async (_url, options) => {
    request = options;
    return {
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: "Review complete." } }] })
    };
  }, userDataPath);

  const initial = await handlers.get("skills:list")({});
  assert.equal(initial.skills.length, 10);
  assert.deepEqual([...initial.installedIds], []);

  const installed = await handlers.get("skills:install")({}, "code-review");
  assert.deepEqual([...installed], ["code-review"]);
  const repeatedInstall = await handlers.get("skills:install")({}, "code-review");
  assert.deepEqual([...repeatedInstall], ["code-review"]);
  assert.equal((await handlers.get("skills:list")({})).installedIds[0], "code-review");

  await handlers.get("model:chat")({}, {
    baseUrl: "http://localhost:11434/v1",
    model: "test-model",
    messages: [{ role: "user", content: "Review this change." }]
  });
  const systemPrompt = JSON.parse(request.body).messages[0].content;
  assert.match(systemPrompt, /Installed skill: Code Review/);
  assert.match(systemPrompt, /prioritize actionable bugs and regressions/);

  const uninstalled = await handlers.get("skills:uninstall")({}, "code-review");
  assert.deepEqual([...uninstalled], []);
  await assert.rejects(handlers.get("skills:install")({}, "not-a-skill"), /not available/);
});
