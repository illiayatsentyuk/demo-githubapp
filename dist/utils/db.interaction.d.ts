export interface DbRecord {
    id: string;
    [key: string]: unknown;
}
export declare function dbInsert(record: Omit<DbRecord, 'id'>): DbRecord;
export declare function dbFindAll(): DbRecord[];
export interface DbFindOneQuery {
    owner?: string;
}
export declare function dbFindOne(query: DbFindOneQuery): DbRecord | undefined;
export declare function dbFindById(id: string): DbRecord | undefined;
export declare function dbUpdate(id: string, updates: Partial<Omit<DbRecord, 'id'>>): DbRecord | undefined;
export declare function dbDelete(id: string): boolean;
