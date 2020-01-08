const fs = require('fs');

const routesHandler = (req, res) => {
    const { url, method } = req;
    let outputBody;
    const formBody = `   
    <form action="/mess" method="POST" >
        <input type="text" name="from_input" />
        <button type="submit">POST</button>
    </form>`;

    const textBody = `<h1>inne niż mess ...</h1>`;

    const noPage = `<h1>404 no page</h1>`;

    res.setHeader('Content-Type', 'text/html');

    switch (url) {
        case '/':
            res.setHeader('Content-Type', 'text/html');
            outputBody = formBody;
            break;
        case '/mess':
            outputBody = textBody;
            if (method === 'POST') {
                const body = [];
                req.on('data', chunk => {
                    console.log(chunk);
                    body.push(chunk);
                });
                req.on('end', () => {
                    const parsedBody = Buffer.concat(body).toString();
                    console.log(parsedBody);
                    const messagae = parsedBody.split('=')[1];
                    fs.writeFile('testPost.txt', messagae, err => {
                        console.log(err);
                        res.statusCode = 302;
                        res.setHeader('Location', '/');
                    });
                });
            }
            break;

        default:
            outputBody = noPage;
            break;
    }

    res.write(`<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
    <title>From server</title>
</head>
<body>
    ${outputBody}
</body>
</html>`);
    res.end();
};

module.exports = routesHandler;
