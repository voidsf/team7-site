const fs = require("fs");
const http = require("http");

const img_content = fs.readFileSync("result.txt");
const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/sense',
    method: 'POST',

    headers: {
        'Content-Type': 'application/json',
        'Content-Length': img_content.length
    }
}, (res) => {
    console.log(res.statusCode);
    console.log(res.headers);

    res.on('data', (d) => {
        console.log(d);
    })
});

req.on('error', (error) => {
    console.error(`An error occurred: ${error.message}`);
});

req.write(img_content);

req.end();

