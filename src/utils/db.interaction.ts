import { randomUUID } from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const DB_FILE_PATH = resolve(process.cwd(), 'db', 'db.json');

export interface DbRecord {
  id: string;
  [key: string]: unknown;
}

interface DbData {
  records: DbRecord[];
}

function readDb(): DbData {
  if (!existsSync(DB_FILE_PATH)) {
    return { records: [] };
  }

  const content = readFileSync(DB_FILE_PATH, 'utf8');
  return JSON.parse(content) as DbData;
}

function writeDb(data: DbData): void {
  writeFileSync(DB_FILE_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export function dbInsert(record: Omit<DbRecord, 'id'>): DbRecord {
  const data = readDb();
  const newRecord: DbRecord = { id: randomUUID(), ...record };

  data.records.push(newRecord);
  writeDb(data);

  return newRecord;
}

export function dbFindAll(): DbRecord[] {
  return readDb().records;
}

export interface DbFindOneQuery {
  owner?: string;
}

function getRecordOwner(record: DbRecord): string | undefined {
  const payload = record.payload as
    | {
        installation?: { account?: { login?: string } };
        sender?: { login?: string };
        action?: string;
      }
    | undefined;

  return payload?.installation?.account?.login ?? payload?.sender?.login;
}

function isActiveInstallation(record: DbRecord): boolean {
  const payload = record.payload as { action?: string } | undefined;
  return payload?.action !== 'deleted' && payload?.action !== 'suspend';
}

export function dbFindOne(query: DbFindOneQuery): DbRecord | undefined {
  const records = [...readDb().records].reverse();

  return records.find((record) => {
    if (query.owner && getRecordOwner(record) !== query.owner) {
      return false;
    }

    return isActiveInstallation(record);
  });
}

export function dbFindById(id: string): DbRecord | undefined {
  return readDb().records.find((record) => record.id === id);
}

export function dbUpdate(
  id: string,
  updates: Partial<Omit<DbRecord, 'id'>>,
): DbRecord | undefined {
  const data = readDb();
  const index = data.records.findIndex((record) => record.id === id);

  if (index === -1) {
    return undefined;
  }

  data.records[index] = { ...data.records[index], ...updates, id };
  writeDb(data);

  return data.records[index];
}

export function dbDelete(id: string): boolean {
  const data = readDb();
  const index = data.records.findIndex((record) => record.id === id);

  if (index === -1) {
    return false;
  }

  data.records.splice(index, 1);
  writeDb(data);

  return true;
}
