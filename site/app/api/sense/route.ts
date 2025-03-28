import roboflow from "roboflow";
import fs from 'fs';

const api_url = "https://detect.roboflow.com";
const api_key = "JbKtghalWkpDZLFsnKTa";
const workspace_name = "compscigroupproject";
const workflow_id = "detect-count-and-visualize";

const workspace_url = `${api_url}/${workspace_name}`;

interface SenseRequest { 
    device_id: string;
    image: string;
}

export async function POST(request: any) {

    const requestContents = await request.text();

    if (!requestContents) {
        return new Response("Invalid request", { status: 400 });
    }

    if (!requestContents.startsWith("data:image/png;base64,")) { 
        return new Response("Invalid image format", { status: 400 });
    }

    // remove first part of the image string
    const image = requestContents.split(';base64,').pop() || '';
    if (!image) {
        return new Response("Invalid image format", { status: 400 });
    }

    // decode base64 image
    fs.writeFile('temp.png', image, {encoding: 'base64'}, function(err) {
        console.log('File created');
    });

    const workspace = await roboflow.getWorkspace(api_url + workspace_url, api_key);
    console.log(JSON.stringify(workspace));

    return new Response(JSON.stringify({ message: "OK" }), { status: 200 });
}