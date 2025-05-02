"use server";
import { getAllUserDevices, ErrorCode } from "../database/database";

import DetailDisplay from "./detaildisplay";

export default async function DeviceDetails({ email }: { email: string }) {
  const devices = await getAllUserDevices("database.db", email);
  
  console.log(devices);

  return (
    <>
      {devices.status.code == 0 && devices.devices != undefined ? (
        devices.devices.length != 0 ? 
        (<DetailDisplay details={devices.devices} />) : 
        (<p>There are devices associated with your account. Contact us to order a device</p>)
        
      ) : (
        
        <p>Could not retrieve devices</p>
      )}
    </>
  );
}
