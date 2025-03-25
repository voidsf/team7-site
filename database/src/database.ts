import { verbose, Database } from "sqlite3";
import { open, Database as sqliteDatabase } from "sqlite";
import { stat } from "fs/promises";
import dummydata from "./dummydata";

// god the amount i could do if js had 'using' like in python

export type UserDetails = {
    name: string,
    email: string,
    pass: string
}

export type DatabaseRequestStatus = {
    error?: string;
    code: 0 // success
        | 1 // Database does not exist
        | 2 // A user with this email already exists
        | 3 // Database already exists
        | 4 // Could not create database
        | 5 // Could not open database
        | 6 // User does not exist
        | 7 // Could not read from database
        | 8 // A device with this id already exists
}


export const SUCCESS: DatabaseRequestStatus = { code: 0 };

// debugging, remove for release
verbose();

async function fileExists(fname: string) : Promise<Boolean> {
    try {
        await stat(fname);
        return true;
    } catch (error) {
        return false;
    }
}


export async function createUser(fname: string, userDetails: UserDetails): Promise<DatabaseRequestStatus> { 

    // check if the database exists
    if (!await fileExists(fname)) {
        return { error: "Database does not exist", code: 1 };
    }

    // define database variable before opening
    let db: sqliteDatabase;

    // try to open database, if database fails to open return error status
    try {
        db = await open({
            filename: fname,
            driver: Database
        });
    } catch (error) {
        return { error: "Could not open database", code: 5 };
    }

    // try to write to database, if writing fails return error status and close database

    try {
        await db.run(
            `INSERT INTO users (name, email, pass) VALUES ($name, $email, $pass)`,
            {
                $name: userDetails.name, 
                $email: userDetails.email, 
                $pass: userDetails.pass
            }
        );
    } catch (error) {

        // if duplicate emails, a 'sqlite_constraint' error will be thrown
        // catch it and return a status code 2, closing the database
        if (error.code == "SQLITE_CONSTRAINT") {
            await db.close();
            return { error: "A user with this email already exists", code: 2 };
        }

        // if unknown error, close database and return code 3
        await db.close();
        return { error: "Could not write to database", code: 3 };
    } 

    // return success status and close database
    await db.close();
    return SUCCESS;

}

export async function createDevice(fname: string, deviceDetails: any) : Promise<DatabaseRequestStatus>{
    // check if the database exists
    if (!await fileExists(fname)) {
        return { error: "Database does not exist", code: 1 };
    }

    // define database variable before opening
    let db: sqliteDatabase;

    // try to open database, if database fails to open return error status
    try {
        db = await open({
            filename: fname,
            driver: Database
        });
    } catch (error) {
        return { error: "Could not open database", code: 5 };
    }

    // write data
    try {
        await db.run(
            `INSERT INTO devices (device_id, user_email) VALUES ($device_id, $user_email)`, 
            {
                $device_id: deviceDetails.device_id,
                $user_email: deviceDetails.user_email
            }
        );

    } catch (error) {
        // if duplicate emails, a 'sqlite_constraint' error will be thrown
        // catch it and return a status code 8, closing the database
        if (error.code == "SQLITE_CONSTRAINT") {
            await db.close();
            return { error: "A device with this id already exists", code: 8 };
        }

        await db.close();
        return { error: "Could not write to database", code: 3 };
    }

    // insert types 
    for (const type of deviceDetails.types) {
        try {
            await db.run(
                `INSERT INTO counts (device_id, recycling_type, count) VALUES ($device_id, $recycling_type, $count)`,
                {
                    $device_id: deviceDetails.device_id,
                    $recycling_type: type.type_name,
                    $count: type.count
                }
            );
        } catch (error) {
            // a duplicate shouldn't happen here, if it does, the initial things are wrong 
            // since device details shouldn't change at runtime
            await db.close();
            return { error: "Could not write to database", code: 3 };
        }
    }

    await db.close();
    return SUCCESS;

}

export async function createDatabase(fname: string) : Promise<DatabaseRequestStatus>{

    // do not create database if it exists
    if (await fileExists(fname)) {
        return { error: "Database already exists", code: 3 };
    }

    // instantiate db variable before opening database
    let db: sqliteDatabase;

    // try opening database, if failed, return error status 5
    try {
        db = await open({
            filename: fname,
            driver: Database
        });
    } catch (error) {
        return { error: "Could not open database", code: 5 };
    }

    try {
        // create user table
        await db.run(`
            CREATE TABLE users
            ( 
                email TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                pass TEXT NOT NULL 
            )
        `);
        
        // create device table
        await db.run(`
            CREATE TABLE devices
            (
                device_id TEXT PRIMARY KEY,
                user_email TEXT NOT NULL          
            )
        `);

        // create device stats table
        await db.run(`
            CREATE TABLE counts
            (
                device_id TEXT,
                recycling_type TEXT,
                count INTEGER,
                PRIMARY KEY (device_id, recycling_type)
            )
        `);

        // fill with fake data
        for (const user of dummydata.users) {
            await createUser(fname, user);
        }

        for (const device of dummydata.devices) {
            await createDevice(fname, device);
        }
    } catch (error) {
        /* if table could not be created, close database and return error code 4 
         * this will be thrown due to a duplicate table if the database already exists
         * however this is checked so shouldn't happen 
         */
        await db.close();
        return { error: "Could not create database", code: 4 };
    }

    // close database and return success status
    await db.close();
    return SUCCESS;
}

export async function getUserHash(fname: string, email: String) : Promise<{status: DatabaseRequestStatus, hash?: string}>{
    
    // check if the database exists
    if (!await fileExists(fname)) {
        // if database does not exist, return appropriate error status
        return {status:{ error: "Database does not exist", code: 1 }};
    }
    
    // declare db variable before opening database
    let db: sqliteDatabase;
    
    // try opening database, return error on failure
    try {
        db = await open({
            filename: fname,
            driver: Database
        });
    } catch (error) {
        return {status:{ error: "Could not open database", code: 5 }};
    }

    // try to get the hash from the database

    let result;
    try {
        result = await db.get(`
            SELECT pass FROM users WHERE email = $email`,
        {
            $email: email,
        });
    } catch (error) {
        // if the email does not exist, return an error and close the database
        await db.close();
        return {status:{ error: "Could not read from database", code: 7 }};
    }

    // if the email is not recognised by the database, i.e. it returns no rows, return an error and close the database
    if (!result) {
        await db.close();
        return {status:{ error: "User does not exist", code : 6 }};
    }

    // close database and return success alongside user hash
    await db.close();
    return {status: SUCCESS, hash: result.pass};

}

export async function getUserDetails(fname: string, email: String) : Promise<{status: DatabaseRequestStatus, details?: UserDetails}>{
    // check if file exists
    if (!await fileExists(fname)) {
        return {status:{ error: "Database does not exist", code: 1 }};
    }

    // declare db variable before opening database
    let db: sqliteDatabase;

    // try opening database, return error on failure
    try {
        db = await open({
            filename: fname,
            driver: Database
        });
    } catch (error) {
        return {status:{ error: "Could not open database", code: 5 }};
    }

    let result;
    try {
        result = await db.get(`
            SELECT name, email, pass FROM users WHERE email = $email`, 
        {
            $email: email,
        });

    } catch (error) {
        await db.close();
        return {status:{ error: "Could not read from database", code: 7 }};
    }

    // if the email is not recognised by the database, i.e. it returns no rows, return an error and close the database
    if (!result) {
        await db.close();
        return {status:{ error: "User does not exist", code : 6 }};
    }

    await db.close();
    return {status: SUCCESS, details: result};
}