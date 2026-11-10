const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const script = fs.readFileSync(
  process.env.NYTS_BACKGROUND_UNDER_TEST || path.join(__dirname, "../Shared (Extension)/Resources/background.js"),
  "utf8"
);
const interval = 15 * 60 * 1000;
const initialTime = Date.UTC(2026, 9, 9, 10);

function background({ initialItems = {}, nativeFailures = 0, hasStorage = true } = {}) {
  const items = { ...initialItems };
  const nativeMessages = [];
  let now = initialTime;
  let remainingFailures = nativeFailures;
  let listener;
  const context = vm.createContext({
    Date: { now: () => now },
    browser: {
      storage: hasStorage ? { local: {
        async get() { return { ...items }; },
        async set(update) { Object.assign(items, update); },
      } } : {},
      runtime: {
        onMessage: { addListener(value) { listener = value; } },
        async sendNativeMessage(application, message) {
          nativeMessages.push({ application, type: message.type });
          if (remainingFailures-- > 0) throw new Error("Injected transient native bridge failure");
          return { echo: message };
        },
      },
    },
  });
  vm.runInContext(script, context);
  return {
    items,
    nativeMessages,
    setTime(value) { now = value; },
    visit() { return context.handleYouTubeVisit(); },
    dispatch(request) { return listener(request); },
  };
}

test("a transient native failure does not suppress confirmation on the next YouTube load", async () => {
  const app = background({ nativeFailures: 1 });
  await app.visit();
  assert.equal(app.items.firstActiveAt, initialTime);
  assert.equal(app.items.lastActivityReportAt, undefined, "only successful native reports may start the 15-minute interval");
  app.setTime(initialTime + 1000);
  await app.visit();
  assert.equal(app.nativeMessages.length, 2);
  assert.equal(app.items.lastActivityReportAt, initialTime + 1000);
});

test("successful reports are throttled until the exact 15-minute boundary", async () => {
  const app = background();
  await app.visit();
  assert.deepEqual(app.nativeMessages, [{ application: "application.id", type: "youtube-visit" }]);
  app.setTime(initialTime + interval - 1);
  await app.visit();
  assert.equal(app.nativeMessages.length, 1);
  app.setTime(initialTime + interval);
  await app.visit();
  assert.equal(app.nativeMessages.length, 2);
  assert.equal(app.items.firstActiveAt, initialTime);
  assert.equal(app.items.lastActivityReportAt, initialTime + interval);
});

test("a failed refresh preserves the previous successful timestamp and retries on a later load", async () => {
  const previous = initialTime - interval;
  const app = background({ initialItems: { firstActiveAt: initialTime - 3 * interval, lastActivityReportAt: previous }, nativeFailures: 1 });
  await app.visit();
  assert.equal(app.items.lastActivityReportAt, previous);
  app.setTime(initialTime + 1000);
  await app.visit();
  assert.equal(app.nativeMessages.length, 2);
  assert.equal(app.items.lastActivityReportAt, initialTime + 1000);
  assert.equal(app.items.firstActiveAt, initialTime - 3 * interval);
});

test("an unavailable optional native handler does not reject the activity task", async () => {
  const app = background({ nativeFailures: 2 });
  await assert.doesNotReject(app.visit());
  app.setTime(initialTime + 1000);
  await assert.doesNotReject(app.visit());
  assert.equal(app.items.firstActiveAt, initialTime);
  assert.equal(app.nativeMessages.length, 2);
});

test("missing storage and unrelated messages are harmless and never call the native handler", async () => {
  const app = background({ hasStorage: false });
  await assert.doesNotReject(app.visit());
  app.dispatch({ type: "unrelated" });
  app.dispatch(null);
  assert.equal(app.nativeMessages.length, 0);
});
