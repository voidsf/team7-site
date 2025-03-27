import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL || "", { ssl: "verify-full" });

// god the amount i could do if js had 'using' like in python

export type UserDetails = {
  name: string;
  email: string;
  pass: string;
};

export type DeviceDetails = {
  device_id: string;
  user_email: string;
  types: Array<{ type_name: string; count: number }>;
};

export type DatabaseRequestStatus = {
  error?: string;
  code:
    | 0 // success
    | 1 // Database does not exist
    | 2 // A user with this email already exists
    | 3 // Database already exists
    | 4 // Could not create database
    | 5 // Could not open database
    | 6 // User does not exist
    | 7 // Could not read from database
    | 8 // A device with this id already exists
    | 9; // User has no associated devices
};

export const SUCCESS: DatabaseRequestStatus = { code: 0 };

export async function createUser(
  fname: string,
  userDetails: UserDetails,
): Promise<DatabaseRequestStatus> {
  // try to write to database, if writing fails return error status and close database

  let result;

  try {
    result = await sql`
      INSERT INTO users 
      (name, email, pass) 
      VALUES 
      (${userDetails.name}, 
      ${userDetails.email}, 
      ${userDetails.pass})
    `;
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      // duplicate key value
      return { error: "A user with this email already exists", code: 2 };
    }

    return { error: "Could not write to database", code: 3 };
  }

  if (result === undefined) {
    return { error: "Could not write to database", code: 3 };
  }

  return SUCCESS;
}

export async function createDevice(
  fname: string,
  deviceDetails: DeviceDetails,
): Promise<DatabaseRequestStatus> {
  let result;

  // try to open database, if database fails to open return error status
  try {
    result = await sql`
      INSERT INTO devices
      (device_id, user_email)
      VALUES
      (${deviceDetails.device_id},
      ${deviceDetails.user_email})
    `;
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      // duplicate key value
      return { error: "A device with this id already exists", code: 8 };
    }
  }

  if (result === undefined) {
    return { error: "Could not write to database", code: 3 };
  }

  return SUCCESS;
}

export async function getAllUserDevices(
  fname: string,
  email: string,
): Promise<{ status: DatabaseRequestStatus; devices?: Array<DeviceDetails> }> {
  console.log(`getting devices associated with ${email}`);
  let result;

  try {
    result = await sql`
      SELECT device_id FROM devices WHERE user_email = ${email}
    `;
  } catch (error) {
    return { status: { error: "Could not read from database", code: 7 } };
  }

  if (!result) {
    return { status: { error: "User has no associated devices", code: 9 } };
  }

  const devices: Array<DeviceDetails> = [];

  for (let i = 0; i < result.length; i++) {
    const deviceDetails: DeviceDetails = {
      device_id: result[i].device_id,
      user_email: email,
      types: [],
    };

    devices.push(deviceDetails);
  }

  console.log("getting further device details");

  for (let device of devices) {
    try {
      result = await sql`
        SELECT type, count FROM recycling_types WHERE device_id = ${device.device_id}
      `;
    } catch (error) {
      console.log(`failed on device ${device.device_id}
        ${JSON.stringify(error)}`);

      return { status: { error: "Could not read from database", code: 7 } };
    }

    for (let i = 0; i < result.length; i++) {
      device.types.push({
        type_name: result[i].type,
        count: result[i].count,
      });
    }
  }

  console.log(JSON.stringify(devices));

  return { status: SUCCESS, devices: devices };
}

export async function getUserHash(
  fname: string,
  email: string,
): Promise<{ status: DatabaseRequestStatus; hash?: string }> {
  // check if the database exists
  let result;

  try {
    result = await sql`
      SELECT pass FROM users WHERE email = ${email}
    `;
  } catch (error) {
    return { status: { error: "Could not read from database", code: 7 } };
  }

  // if the email is not recognised by the database, i.e. it returns no rows, return an error
  if (!result) {
    return { status: { error: "User does not exist", code: 6 } };
  }

  return { status: SUCCESS, hash: result[0].pass };
}

export async function getUserDetails(
  fname: string,
  email: string,
): Promise<{ status: DatabaseRequestStatus; details?: UserDetails }> {
  // check if file exists
  let result;

  try {
    result = await sql`
      SELECT name, email FROM users WHERE email = ${email}
    `;
  } catch (error) {
    return { status: { error: "Could not read from database", code: 7 } };
  }

  if (!result) {
    return { status: { error: "User does not exist", code: 6 } };
  }

  const userDetails: UserDetails = {
    name: result[0].name,
    email: result[0].email,
    pass: "",
  };

  return { status: SUCCESS, details: userDetails };
}
