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

enum ErrorCode {
  Success = 0,
  DatabaseDoesNotExist,
  UserAlreadyExists,
  DatabaseAlreadyExists,
  CouldNotCreateDatabase,
  CouldNotOpenDatabase,
  UserDoesNotExist,
  CouldNotReadFromDatabase,
  DeviceAlreadyExists,
  UserHasNoDevices,
  DeviceDoesNotExist,
}

export type DatabaseRequestStatus = {
  error?: string;
  code: ErrorCode;
};

export const SUCCESS: DatabaseRequestStatus = { code: ErrorCode.Success };

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
      return {
        error: "A user with this email already exists",
        code: ErrorCode.UserAlreadyExists,
      };
    }

    return {
      error: "Could not write to database",
      code: ErrorCode.CouldNotOpenDatabase,
    };
  }

  if (result === undefined) {
    return {
      error: "Could not write to database",
      code: ErrorCode.CouldNotOpenDatabase,
    };
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
      return {
        error: "A device with this id already exists",
        code: ErrorCode.DeviceAlreadyExists,
      };
    }
  }

  if (result === undefined) {
    return {
      error: "Could not write to database",
      code: ErrorCode.CouldNotOpenDatabase,
    };
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
    return {
      status: {
        error: "Could not read from database",
        code: ErrorCode.CouldNotReadFromDatabase,
      },
    };
  }

  if (!result) {
    return {
      status: {
        error: "User has no associated devices",
        code: ErrorCode.UserHasNoDevices,
      },
    };
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

      return {
        status: {
          error: "Could not read from database",
          code: ErrorCode.CouldNotReadFromDatabase,
        },
      };
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
    return {
      status: {
        error: "Could not read from database",
        code: ErrorCode.CouldNotReadFromDatabase,
      },
    };
  }

  // if the email is not recognised by the database, i.e. it returns no rows, return an error
  if (!result) {
    return {
      status: {
        error: "User does not exist",
        code: ErrorCode.UserDoesNotExist,
      },
    };
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
    return {
      status: {
        error: "Could not read from database",
        code: ErrorCode.CouldNotReadFromDatabase,
      },
    };
  }

  if (!result) {
    return {
      status: {
        error: "User does not exist",
        code: ErrorCode.UserDoesNotExist,
      },
    };
  }

  const userDetails: UserDetails = {
    name: result[0].name,
    email: result[0].email,
    pass: "",
  };

  return { status: SUCCESS, details: userDetails };
}

export async function getLeaderboardData() {
  let result;

  try {
    result = await sql`
      SELECT users.name, devices.device_id, 
      SUM(recycling_types.count) FILTER (where recycling_types.type <> 'Non-Recyclable') * 100 / sum(recycling_types.count) AS score
      FROM users 
      INNER JOIN devices ON users.email=devices.user_email 
      INNER JOIN recycling_types ON devices.device_id=recycling_types.device_id
      GROUP BY users.name, devices.device_id  
    `;
  } catch (error) {
    return {
      status: {
        error: "Could not read from database",
        code: ErrorCode.CouldNotReadFromDatabase,
      },
    };
  }

  return { status: SUCCESS, result: result };
}

export async function incrementDeviceScore(device_id: string, type: string) {
  // is this a real device?
  let result;

  try {
    result = await sql`
      select * from devices where device_id = ${device_id}
      `;
  } catch (error) {
    return {
      error: "Could not read from database",
      code: ErrorCode.CouldNotReadFromDatabase,
    };
  }

  console.log(result);

  if (!result) {
    return {
      error: "Device does not exist",
      code: ErrorCode.DeviceDoesNotExist,
    };
  }

  let result2;

  try {
    result2 = await sql`
      UPDATE recycling_types
      SET count = count + 1 
      WHERE device_id = ${device_id} AND type = ${type}
    `;
  } catch (error) {
    return {
      error: "Could not write to database",
      code: ErrorCode.CouldNotOpenDatabase,
    };
  }

  return SUCCESS;
}
