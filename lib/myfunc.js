const axios = require("axios");

function pickPrefix(text, prefixes = [".", "!"]) {
  return prefixes.find((p) => text.startsWith(p)) || null;
}

function isUrl(text = "") {
  return /(https?:\/\/[^\s]+)/i.test(text);
}

async function getBuffer(url, opts = {}) {
  const res = await axios.get(url, { responseType: "arraybuffer", ...opts });
  return Buffer.from(res.data);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

module.exports = {
  pickPrefix,
  isUrl,
  getBuffer,
  sleep
};
