const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { JSDOM } = require("jsdom");
const script = fs.readFileSync(path.join(__dirname, "../Shared (Extension)/Resources/content.js"), "utf8");

function page(t, url, stored = {}) {
  const dom = new JSDOM(`<!doctype html><html><head></head><body>
    <ytd-browse page-subtype="home"><ytd-rich-grid-renderer>
      <ytd-rich-item-renderer id="post-card"><ytd-post-renderer></ytd-post-renderer></ytd-rich-item-renderer>
      <ytd-rich-item-renderer id="video-card"><a href="/watch?v=ordinary">Video</a></ytd-rich-item-renderer>
    </ytd-rich-grid-renderer></ytd-browse>
    <ytm-rich-item-renderer id="mobile-post"><ytm-backstage-post-thread-renderer></ytm-backstage-post-thread-renderer></ytm-rich-item-renderer>
    <ytd-watch-flexy><div id="secondary"><ytd-watch-next-secondary-results-renderer id="related"></ytd-watch-next-secondary-results-renderer></div></ytd-watch-flexy>
  </body></html>`, { url, runScripts: "outside-only" });
  t.after(() => dom.window.close());
  const redirects = [];
  let onChanged;
  dom.window.console.log = () => {};
  dom.window.browser = {
    storage: {
      sync: { get(_keys, callback) { callback(stored); } },
      local: { get(_keys, callback) { callback({}); }, set(_items, callback) { callback?.(); } },
      onChanged: { addListener(callback) { onChanged = callback; } },
    },
    runtime: { sendMessage() { return Promise.resolve(); } },
  };
  dom.window.eval(script);
  dom.window.navigateToRegularPlayer = target => redirects.push(target);
  return {
    window: dom.window, document: dom.window.document, redirects,
    ready: Promise.resolve(),
    change(update) { onChanged(Object.fromEntries(Object.entries(update).map(([key, value]) => [key, { newValue: value }])), "sync"); },
  };
}

test("shared desktop/mobile Shorts play the selected video without entering the Shorts feed", async t => {
  for (const host of ["www.youtube.com", "m.youtube.com"]) {
    const app = page(t, `https://${host}/shorts/abc_DEF-123?si=share&t=14`, { hideShorts: true });
    await app.ready;
    assert.deepEqual(app.redirects, [`https://${host}/watch?v=abc_DEF-123&t=14`]);
    app.window.processPage();
    assert.equal(app.redirects.length, 1, "mutation processing does not repeat the same navigation");
    app.window.history.replaceState({}, "", "/watch?v=abc_DEF-123");
    app.window.processPage();
    assert.equal(app.redirects.length, 1, "regular player never loops back into a redirect");
    app.window.history.pushState({}, "", "/shorts/abc_DEF-123");
    app.window.processPage();
    assert.equal(app.redirects.length, 2, "a subsequent deliberate opening is redirected again");
  }
});

test("Shorts-off, bare Shorts route, invalid IDs and other sites are never rewritten", async t => {
  const app = page(t, "https://www.youtube.com/shorts/abc_DEF-123", { hideShorts: false });
  await app.ready;
  assert.deepEqual(app.redirects, []);
  app.change({ hideShorts: true });
  assert.equal(app.redirects.length, 1);
  for (const url of ["https://www.youtube.com/shorts", "https://www.youtube.com/shorts/nope", "https://www.youtube.com/watch?v=abc_DEF-123", "https://example.com/shorts/abc_DEF-123"]) {
    assert.equal(app.window.regularWatchUrlForShorts(url), null, url);
  }
});

test("community filter is optional, home-only and preserves ordinary videos and recycled cards", async t => {
  const app = page(t, "https://www.youtube.com/", { hideShorts: false });
  await app.ready;
  assert.equal(app.document.body.dataset.nytsHideCommunityPosts, undefined);
  app.change({ hideCommunityPosts: true });
  assert.equal(app.document.body.dataset.nytsHideCommunityPosts, "true");
  assert.equal(app.document.getElementById("post-card").dataset.nytsCommunityPost, "true");
  assert.equal(app.document.getElementById("mobile-post").dataset.nytsCommunityPost, "true");
  assert.equal(app.document.getElementById("video-card").dataset.nytsCommunityPost, undefined);
  app.document.getElementById("post-card").innerHTML = '<a href="/watch?v=newvideo">Recycled normal video</a>';
  app.window.processPage();
  assert.equal(app.document.getElementById("post-card").dataset.nytsCommunityPost, undefined);
  app.window.history.pushState({}, "", "/feed/subscriptions");
  app.window.processPage();
  assert.equal(app.document.body.dataset.nytsHideCommunityPosts, undefined);
  app.window.history.pushState({}, "", "/");
  app.change({ hideCommunityPosts: false });
  assert.equal(app.document.body.dataset.nytsHideCommunityPosts, undefined);
});

test("blank Home and watch recommendations remain independent and Home never redirects", async t => {
  const app = page(t, "https://www.youtube.com/", { hideShorts: false, hideHomeFeed: true, hideWatchRecommendations: false });
  await app.ready;
  assert.equal(app.window.location.pathname, "/");
  assert.deepEqual(app.redirects, []);
  assert.equal(app.document.body.dataset.nytsHideHome, "true");
  assert.equal(app.document.body.dataset.nytsHideWatch, undefined);
  app.window.history.pushState({}, "", "/watch?v=ordinary");
  app.window.processPage();
  assert.equal(app.document.body.dataset.nytsHideHome, undefined);
  assert.equal(app.document.body.dataset.nytsHideWatch, undefined);
  app.change({ hideWatchRecommendations: true });
  assert.equal(app.document.body.dataset.nytsHideWatch, "true");
  app.window.history.pushState({}, "", "/");
  app.window.processPage();
  assert.equal(app.document.body.dataset.nytsHideHome, "true");
  assert.equal(app.document.body.dataset.nytsHideWatch, undefined);
});
