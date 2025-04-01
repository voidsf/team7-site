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
}
