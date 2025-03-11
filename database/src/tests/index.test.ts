import { createDatabase, createUser, getUserHash, SUCCESS } from "../database";
import type { UserDetails } from "../database";

import { access, unlink } from "fs/promises";
import { open } from "sqlite";
import { Database, verbose } from "sqlite3";
import * as fs from "fs/promises"; 

const DB_FILENAME = "database.db";

async function fileExists(fname: string) : Promise<Boolean> {
    try {
        await fs.stat(fname);
        return true;
    } catch (error) {
        return false;
    }
}

async function isDeletable(fname: string) {
    try {
        await fs.unlink(fname);
        return true;
    } catch (error) {
        return false;
    }
}

describe("Files must not remain locked after function execution", () => {
    // tests here are reliant on the previous tests, if one fails, they will cascade.

    beforeAll(async () => {
        // check if file exists, if it does, kill it 
        if (await fileExists(DB_FILENAME)) {
            await unlink(DB_FILENAME);
        }
    })

    test("createDatabase", async () => {

        // create database and grab status 
        let status = await createDatabase(DB_FILENAME);
        expect(status).toBe(SUCCESS);

        // ping file to see if it is unlocked
        expect(await isDeletable(DB_FILENAME)).toBe(true);
    });

    test("createUser", async () => {
        // create database
        await createDatabase(DB_FILENAME);

        // create user and grab status
        let userDetails: UserDetails = {
            name: "test",
            email: "email@email.com",
            pass: "pass"
        };

        let status = await createUser(DB_FILENAME, userDetails);
        expect(status).toBe(SUCCESS);

        // ping file for unlock 
        expect(await isDeletable(DB_FILENAME)).toBe(true);
    });

    test("createUser (duplicate email)", async () => {
        // create database
        await createDatabase(DB_FILENAME);

        // create user and grab status
        let userDetails: UserDetails = {
            name: "test",
            email: "email@email.com",
            pass: "pass"
        };

        await createUser(DB_FILENAME, userDetails);
        let status = await createUser(DB_FILENAME, userDetails);

        expect(status.code).toBe(2);

        // ping file for unlock 
        expect(await isDeletable(DB_FILENAME)).toBe(true);
    });

    test("getUserHash", async () => {
        // setup
        await createDatabase(DB_FILENAME);

        let userDetails: UserDetails = {
            name: "test",
            email: "email@email.com",
            pass: "pass"
        };

        await createUser(DB_FILENAME, userDetails);

        // get hash
        let hash = await getUserHash(DB_FILENAME, userDetails.email);
        expect(hash.hash).toBe(userDetails.pass);

        // ping file for unlock 
        expect(await isDeletable(DB_FILENAME)).toBe(true);
    });

    test("getUserHash (user not present)", async () => {
        // setup
        await createDatabase(DB_FILENAME);

        let userDetails: UserDetails = {
            name: "test",
            email: "email@email.com",
            pass: "pass"
        };

        // get hash
        let hash = await getUserHash(DB_FILENAME, userDetails.email);
        
        // expect failure
        expect(hash.status.code).toBe(6);

        // ping file for unlock 
        expect(await isDeletable(DB_FILENAME)).toBe(true);
    });

    afterAll(async () => {
        // cleanup
        if (await fileExists(DB_FILENAME)) {
            await unlink(DB_FILENAME);
        }
    })

})

describe("Database functions must return correct information", () => {
    afterEach( async () => {
        // cleanup
        if (await fileExists(DB_FILENAME)) {
            await unlink(DB_FILENAME);
        }
    })

    test("createDatabase", async () => {
        let status = await createDatabase(DB_FILENAME);
        expect(status).toBe(SUCCESS);
    });

    test("createDatabase (duplicate)", async () => {
        await createDatabase(DB_FILENAME);
        let status = await createDatabase(DB_FILENAME);
        expect(status.code).toBe(3);
    });
    
    test("createUser", async () => {
        await createDatabase(DB_FILENAME);

        let userDetails: UserDetails = {
            name: "test",
            email: "test",
            pass: "test" 
        };

        let status = await createUser(DB_FILENAME, userDetails);
        expect(status).toBe(SUCCESS);

    });

    test("createUser (duplicate email)", async () => {
        await createDatabase(DB_FILENAME);

        let userDetails: UserDetails = {
            name: "test",
            email: "test",
            pass: "test" 
        };

        await createUser(DB_FILENAME, userDetails);
        let status = await createUser(DB_FILENAME, userDetails);
        expect(status.code).toBe(2);
    });

    test("createUser (no database)", async () => {
        let userDetails: UserDetails = {
            name: "test",
            email: "test",
            pass: "test" 
        };

        let status = await createUser(DB_FILENAME, userDetails);
        expect(status.code).toBe(1);
    });

    test("getUserHash", async () => {
        await createDatabase(DB_FILENAME);

        let userDetails: UserDetails = {
            name: "test",
            email: "test",
            pass: "test" 
        };

        await createUser(DB_FILENAME, userDetails);

        let hash = await getUserHash(DB_FILENAME, userDetails.email);
        expect(hash.hash).toBe(userDetails.pass);
    });

    test("getUserHash (fake user)", async () => {
        await createDatabase(DB_FILENAME);

        let hash = await getUserHash(DB_FILENAME, "fake");
        expect(hash.status.code).toBe(6);
    });

    test("getUserHash (no database)", async () => {
        let hash = await getUserHash(DB_FILENAME, "fake");
        expect(hash.status.code).toBe(1);
    });
});