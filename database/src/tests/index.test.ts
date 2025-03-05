import { createDatabase, createUser, getUserHash } from "../database";
import { access, unlink } from "fs/promises";
import { open } from "sqlite";
import { Database, verbose } from "sqlite3";
import { UserDetails } from "../types/types";

// get verbose output from sqlite3
verbose();

const DB_FILENAME = "database.db";
let db;

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

    db = await open({
        filename: DB_FILENAME,
        driver: Database
    });
}

beforeAll(() => {
    return flickerDatabase(DB_FILENAME);
});


describe("Testing database.ts", () => {
    test("Database should be created with correct table schema", async () => {

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
    
    test("Users can be added to the database", async () => {

        // create a user
        const userDetails : UserDetails = {
            name: "John Smith", 
            email: "johnsmith@gmail.com",
            pass: "hashed_password_string"
        }

        await createUser(DB_FILENAME, userDetails);

        // check if user was added
        const userInfo = await db.get("SELECT * FROM users WHERE email = $email", {
            $email: userDetails.email
        });

        delete userInfo.id;

        const expected = {
            name: 'John Smith',
            email: 'johnsmith@gmail.com',
            pass: 'hashed_password_string'
        }

        expect(userInfo).toEqual(expected);
    });

    test("User password can be retrieved from the database", async () => {
        const userDetails : UserDetails = {
            name: "Jane Doe", 
            email: "janedoe@hotmail.com",
            pass: "hashed_password_string"
        };

        await createUser(DB_FILENAME, userDetails);

        const pass = await getUserHash(DB_FILENAME, userDetails.email);

        expect(pass).toEqual(userDetails.pass);
    });

    test("No duplicate emails can be added to the database", async () => {
        const userDetails : UserDetails[] = [
            {
                name: "John Hancock",
                email: "johnhancock@gmail.com",
                pass: "hashed_password_string"
            },
            {
                name: "John Hancock On A Second Account",
                email: "johnhancock@gmail.com",
                pass: "hashed_password_string"
            }
        ]

        try {
            // attempt to add users
            for (const user of userDetails) {
                await createUser(DB_FILENAME, user);
            }
        } catch (error) {
            // succeed test if error thrown
            expect(error).toBeInstanceOf(Error);
        }
        
    });
});