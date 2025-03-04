import { verbose, Database } from "sqlite3";
import { open } from "sqlite";

// debugging, remove for release
verbose();


export async function createUser(fname: string, name : String, email : String, pass : String) { 
    /**
     * Writes the given user data to the database
     * 
     * @param name The user's name
     * @param email The user's email
     * @param pass A hash of the user's password
     */

    const db = await open({
        filename: fname,
        driver: Database
    });

    const result = await db.run(
        `INSERT INTO users (name, email, pass) VALUES ($name, $email, $pass)`,
        {
            $name: name, 
            $email: email, 
            $pass: pass
        }
    );
}

export async function createDatabase(fname: string) {
    const db = await open({
        filename: fname,
        driver: Database
    });

    const result = await db.run(`
        CREATE TABLE users
        ( 
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            pass TEXT NOT NULL 
        )
    `);
}

export async function getUserHash(fname: string, email: String) {
    const db = await open({
        filename: fname,
        driver: Database
    });

    const result = await db.get(`
        SELECT pass FROM users WHERE email = $email`,
    {
        $email: email,
    });

    return result.pass;
}