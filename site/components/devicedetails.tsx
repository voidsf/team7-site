"use server";
import { getAllUserDevices } from "database";
import DetailDisplay from "./detaildisplay";

export default async function DeviceDetails({email}: {email:string}) {

    const devices = await getAllUserDevices("database.db", email);


    return (
        <>
            {devices.status.code == 0 ? 
                <DetailDisplay details={devices.devices} /> 
                : <p>Could not retrieve devices</p>
            }
        </>
    )
}