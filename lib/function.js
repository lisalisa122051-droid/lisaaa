const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

class JSONDB {
  constructor(filePath) {
    this.filePath = filePath;
    ensureDirSync(path.dirname(filePath));
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
    this._lock = Promise.resolve();
  }

  async _read() {
    try {
      const raw = await fsp.readFile(this.filePath, "utf8");
      return JSON.parse(raw || "{}");
    } catch {
      return {};
    }
  }

  async _write(data) {
    // simple lock biar ga bentrok write
    this._lock = this._lock.then(() =>
      fsp.writeFile(this.filePath, JSON.stringify(data, null, 2))
    );
    return this._lock;
  }

  async get(key) {
    const db = await this._read();
    return db[key] ?? null;
  }

  async set(key, value) {
    const db = await this._read();
    db[key] = value;
    await this._write(db);
    return value;
  }

  async ensure(key, defaultValue) {
    const exist = await this.get(key);
    if (exist) return exist;
    await this.set(key, defaultValue);
    return defaultValue;
  }

  async all() {
    return this._read();
  }
}

module.exports = {
  JSONDB
};
