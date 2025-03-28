const fs = require("fs");

function toBase64(filepath) {
    const img = fs.readFileSync(filepath);
    return "data:image/png;base64," + Buffer.from(img).toString("base64");
}

const base64string = toBase64("img.jpg");
console.log(base64string);