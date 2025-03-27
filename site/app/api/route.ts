import { incrementDeviceScore } from "@/database/database";
import { Enriqueta } from "next/font/google";

interface DeviceUpdatePostRequest {
    device_id: string;
    type: string;
}

function isValidDeviceRequest(request: any){
    return 'device_id' in request && 'type' in request;

}

export async function POST(request: Request) {

    const body = await request.json();

    // check if the request is in the right format
    if (!isValidDeviceRequest(body)) {
        return new Response(null, { status: 400});
    }

    const req: DeviceUpdatePostRequest = {
        device_id: body.device_id, 
        type: body.type
    }

    // get device info 
    const result = await incrementDeviceScore(req.device_id, req.type);

    if (result.error) {
        return new Response(null, { status: 500 });
    }

    // default response
    return new Response(null, { status: 201 });
}