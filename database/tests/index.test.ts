import { createDatabase, createUser, getUserHash } from "../src/database";
import { access, unlink } from "fs/promises";
import { open } from "sqlite";
import { Database, verbose } from "sqlite3";

// get verbose output from sqlite3
verbose();

const DB_FILENAME = "database.db";

/**
 * Deletes the database at the given filename, if it exists,
 * then creates a new database at the same filename.
 * @param filename 
 */
async function flickerDatabase(filename: string){ 
            
    // destroy database if exists
    try {
        await unlink(DB_FILENAME);
    } catch (error) {
        // File does not exist, this is what we want
    }

    await createDatabase(DB_FILENAME);
}

describe("Testing database.ts", () => {
    test("Database should be created with correct table schema", async () => {

        // destroy database and recreate if exists
        await flickerDatabase(DB_FILENAME);

        // check database schemas
        const db = await open({
            filename: DB_FILENAME,
            driver: Database
        });

        const table_info = await db.all("PRAGMA table_info(users)");

        // user table schema
        const expected = 
        [
            {
                cid: 0,
                name: "id", 
                type: "INTEGER", 
                notnull: 0, 
                dflt_value: null,
                pk: 1
            },{
                cid: 1,
                name: 'name',
                type: 'TEXT',
                notnull: 1,
                dflt_value: null,
                pk: 0
            },
            {
                cid: 2,
                name: 'email',
                type: 'TEXT',
                notnull: 1,
                dflt_value: null,
                pk: 0
            },
            {
                cid: 3,
                name: 'pass',
                type: 'TEXT',
                notnull: 1,
                dflt_value: null,
                pk: 0
            }
        ];

        expect(table_info).toEqual(expected);
        
    });
    
    
})