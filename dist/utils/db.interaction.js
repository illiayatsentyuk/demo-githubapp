"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbInsert = dbInsert;
exports.dbFindAll = dbFindAll;
exports.dbFindOne = dbFindOne;
exports.dbFindById = dbFindById;
exports.dbUpdate = dbUpdate;
exports.dbDelete = dbDelete;
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = require("path");
const DB_FILE_PATH = (0, path_1.resolve)(process.cwd(), 'db', 'db.json');
function readDb() {
    if (!(0, fs_1.existsSync)(DB_FILE_PATH)) {
        return { records: [] };
    }
    const content = (0, fs_1.readFileSync)(DB_FILE_PATH, 'utf8');
    return JSON.parse(content);
}
function writeDb(data) {
    (0, fs_1.writeFileSync)(DB_FILE_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}
function dbInsert(record) {
    const data = readDb();
    const newRecord = { id: (0, crypto_1.randomUUID)(), ...record };
    data.records.push(newRecord);
    writeDb(data);
    return newRecord;
}
function dbFindAll() {
    return readDb().records;
}
function getRecordOwner(record) {
    const payload = record.payload;
    return payload?.installation?.account?.login ?? payload?.sender?.login;
}
function isActiveInstallation(record) {
    const payload = record.payload;
    return payload?.action !== 'deleted' && payload?.action !== 'suspend';
}
function dbFindOne(query) {
    const records = [...readDb().records].reverse();
    return records.find((record) => {
        if (query.owner && getRecordOwner(record) !== query.owner) {
            return false;
        }
        return isActiveInstallation(record);
    });
}
function dbFindById(id) {
    return readDb().records.find((record) => record.id === id);
}
function dbUpdate(id, updates) {
    const data = readDb();
    const index = data.records.findIndex((record) => record.id === id);
    if (index === -1) {
        return undefined;
    }
    data.records[index] = { ...data.records[index], ...updates, id };
    writeDb(data);
    return data.records[index];
}
function dbDelete(id) {
    const data = readDb();
    const index = data.records.findIndex((record) => record.id === id);
    if (index === -1) {
        return false;
    }
    data.records.splice(index, 1);
    writeDb(data);
    return true;
}
//# sourceMappingURL=db.interaction.js.map