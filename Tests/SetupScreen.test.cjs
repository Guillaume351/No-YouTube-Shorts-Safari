const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "Shared (App)/Base.lproj/Main.html"), "utf8");
const script = fs.readFileSync(path.join(root, "Shared (App)/Resources/Script.js"), "utf8");
const now = Date.UTC(2026, 9, 8, 12);
const day = 24 * 60 * 60 * 1000;

function screen() {
  const dom = new JSDOM(html, { url: "https://setup.invalid", runScripts: "outside-only" });
  const messages = [];
  dom.window.webkit = { messageHandlers: { controller: { postMessage: message => messages.push(message) } } };
  dom.window.Date.now = () => now;
  dom.window.eval(script);
  dom.window.show("ios");
  return { dom, window: dom.window, document: dom.window.document, messages };
}

test("setup does not present old, invalid or disabled activity as current success", () => {
  const { window, document } = screen();
  const status = document.getElementById("setup-status");
  window.showSetupStatus(now - day, null);
  assert.equal(status.dataset.state, "working");
  assert.match(status.textContent, /ran on YouTube/);
  for (const timestamp of [null, NaN, Infinity, 0, now + day]) {
    window.showSetupStatus(timestamp, true);
    assert.equal(status.dataset.state, "pending");
  }
  window.showSetupStatus(now - 15 * day, true);
  assert.equal(status.dataset.state, "pending");
  assert.match(status.textContent, /Last detected/);
  window.showSetupStatus(now - day, false);
  assert.equal(status.dataset.state, "off");
});

test("promotion waits for both native eligibility and recent setup evidence, then respects dismissal", () => {
  const { window, document, messages } = screen();
  const promo = document.getElementById("browsekind-promo");
  window.showSetupStatus(now - day, true);
  assert.equal(promo.hidden, true);
  window.showBrowseKindPromo();
  assert.equal(promo.hidden, false);
  window.showSetupStatus(now - day, false);
  assert.equal(promo.hidden, true);
  window.showSetupStatus(now - day, true);
  document.getElementById("browsekind-promo-dismiss").click();
  assert.equal(promo.hidden, true);
  assert.deepEqual(messages, ["dismiss-browsekind-promo"]);
  window.showSetupStatus(now - day, true);
  assert.equal(promo.hidden, true);
});

test("native eligibility arriving before setup never reveals a premature promotion", () => {
  const { window, document } = screen();
  window.showBrowseKindPromo();
  const promo = document.getElementById("browsekind-promo");
  assert.equal(promo.hidden, true);
  window.showSetupStatus(null, true);
  assert.equal(promo.hidden, true);
  window.showSetupStatus(now - 14 * day, null);
  assert.equal(promo.hidden, false);
  window.showSetupStatus(now - 14 * day - 1, null);
  assert.equal(promo.hidden, true);
});

test("every supported language has website-scoped steps and an explicitly illustrative preview", () => {
  const { window, document } = screen();
  for (const lang of ["en", "fr", "es", "it", "de", "ru", "ar"]) {
    const select = document.getElementById("language-selector");
    select.value = lang;
    select.dispatchEvent(new window.Event("change"));
    const instructions = document.querySelector('[data-i18n="iosInstructions"]');
    assert.equal(instructions.querySelectorAll("li").length, 3, lang);
    assert.match(instructions.textContent, /youtube\.com/);
    assert.match(instructions.textContent, /→/);
    for (const key of ["scope", "previewTitle", "previewNote", "previewBefore", "previewAfter", "previewVideo", "previewShorts", "previewRemoved"]) {
      assert.ok(document.querySelector(`[data-i18n="${key}"]`).textContent.trim(), `${lang}: ${key}`);
    }
    assert.equal(document.documentElement.lang, lang);
    assert.equal(document.documentElement.dir, lang === "ar" ? "rtl" : "ltr");
    window.showSetupStatus(now - 15 * day, true);
    assert.equal(document.getElementById("setup-status").dataset.state, "pending");
  }
});

test("setup shortcuts still send native actions and the optional video is not preloaded", () => {
  const { document, messages } = screen();
  for (const id of ["open-ios-settings", "open-youtube", "open-bundle"]) document.getElementById(id).click();
  assert.deepEqual(messages, ["open-ios-settings", "open-youtube", "open-bundle"]);
  assert.equal(document.querySelector("video").preload, "none");
  assert.equal(document.querySelector("details.video-guide").open, false);
  assert.ok(document.querySelector("details.safari-preview > summary"));
  const ids = [...document.querySelectorAll("[id]")].map(element => element.id);
  assert.equal(new Set(ids).size, ids.length);
});
