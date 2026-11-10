const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { JSDOM } = require("jsdom");

const script = fs.readFileSync(path.join(__dirname, "../Shared (Extension)/Resources/content.js"), "utf8");
const fixture = `<!doctype html><html><head></head><body>
  <ytd-guide-entry-renderer id="shorts-menu"><a class="yt-simple-endpoint" href="/shorts/demo">Shorts</a></ytd-guide-entry-renderer>
  <ytd-guide-entry-renderer id="subscriptions"><a class="yt-simple-endpoint" href="/feed/subscriptions">Subscriptions</a></ytd-guide-entry-renderer>
  <ytd-reel-shelf-renderer id="shorts-shelf">
    <ytd-reel-item-renderer id="short-one"><ytm-shorts-lockup-view-model id="nested-short"></ytm-shorts-lockup-view-model></ytd-reel-item-renderer>
    <ytd-reel-item-renderer id="short-two"></ytd-reel-item-renderer>
  </ytd-reel-shelf-renderer>
  <ytd-video-renderer id="normal-video"><a href="/watch?v=ordinary">Normal video</a></ytd-video-renderer>
  <ytd-comments id="comments">Ordinary comments</ytd-comments>
</body></html>`;

function page(t, url = "https://www.youtube.com/results?search_query=demo") {
  const dom = new JSDOM(fixture, { url, runScripts: "outside-only" });
  t.after(() => dom.window.close());
  const localItems = {};
  const messages = [];
  let settingsCallback;
  let settingsChanged;
  dom.window.console.log = () => {};
  dom.window.browser = {
    storage: {
      sync: { get(_keys, callback) { settingsCallback = callback; } },
      local: {
        get(_keys, callback) { callback({ ...localItems }); },
        set(update, callback) { Object.assign(localItems, update); callback?.(); },
      },
      onChanged: { addListener(callback) { settingsChanged = callback; } },
    },
    runtime: { sendMessage(message) { messages.push(message.type); return Promise.resolve(); } },
  };
  dom.window.eval(script);
  return {
    window: dom.window, document: dom.window.document, localItems, messages,
    async loadSettings(settings) { settingsCallback(settings); await Promise.resolve(); },
    changeSettings(changes) { settingsChanged(changes, "sync"); },
    async flushCounter() { dom.window.flushHiddenShortsCount(); await Promise.resolve(); },
  };
}

test("saved Shorts-off choice is loaded before any destructive initial filtering", async t => {
  const app = page(t);
  app.window.processPage();
  assert.ok(app.document.getElementById("shorts-shelf"));
  await app.loadSettings({ hideShorts: false });
  assert.ok(app.document.getElementById("shorts-shelf"));
  assert.ok(app.document.getElementById("shorts-menu"));
  assert.equal(app.document.getElementById("nyts-critical-hide-style"), null);
  app.changeSettings({ hideShorts: { newValue: true } });
  assert.equal(app.document.getElementById("shorts-shelf"), null);
  assert.equal(app.document.getElementById("shorts-menu"), null);
  assert.ok(app.document.getElementById("normal-video"));
  assert.ok(app.document.getElementById("subscriptions"));
  assert.equal(app.document.getElementById("comments").style.display, "");
  assert.deepEqual(app.messages, ["nyts-youtube-visit"]);
});

test("nested Shorts are counted once per DOM subtree and repeated processing adds nothing", async t => {
  const app = page(t);
  await app.loadSettings({});
  await app.flushCounter();
  assert.equal(app.localItems.shortsHiddenCount, 2);
  const firstActiveAt = app.localItems.firstActiveAt;
  app.window.processPage();
  app.window.processPage();
  await app.flushCounter();
  assert.equal(app.localItems.shortsHiddenCount, 2);
  assert.equal(app.localItems.firstActiveAt, firstActiveAt);
});

test("legacy recommendations migrate while explicit newer choices and subscription pages are preserved", async t => {
  const app = page(t, "https://www.youtube.com/feed/subscriptions");
  const migrated = JSON.parse(JSON.stringify(app.window.normalizeStoredSettings({ hideRecommendations: true, hideWatchRecommendations: false })));
  assert.deepEqual(migrated, { hideShorts: true, hideHomeFeed: true, hideWatchRecommendations: false, hideComments: false, hideCommunityPosts: false });
  await app.loadSettings({ hideRecommendations: true, hideWatchRecommendations: false });
  assert.equal(app.document.body.dataset.nytsHideHome, undefined);
  assert.equal(app.document.body.dataset.nytsCollapseWatchSidebar, undefined);
  assert.equal(app.document.body.dataset.nytsHideComments, undefined);
  assert.ok(app.document.getElementById("normal-video"));
  assert.ok(app.document.getElementById("subscriptions"));
});
