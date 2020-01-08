const http = require('http');

const template = pieceOfHtml => `
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
    <title>Document</title>
</head>
<body>
    ${pieceOfHtml}
</body>
</html>`;

const greating = `<h1>Hello ....</h1><form action="/addUser" method="POST" >
        <input type="text" name="from_input" />
        <button type="submit">POST</button>
    </form>`;
const noPage = `<h1>404 no such page ...</h1>`;
const users = ['Marek', 'Hania', 'Grazyna'];
const wrongMethod = `<h1>Wrong method, use post ...</h1>`;

const server = http.createServer((req, res) => {
    const { url, method } = req;

    switch (url) {
        case '/':
            {
                const responseBody = template(greating);
                res.setHeader('Content-Type', 'text/html');
                res.write(responseBody);
                res.end();
            }
            break;
        case '/users': {
            let usersHtml = `<h1>Users</h1>`;
            users.forEach((user, index) => {
                usersHtml += `<h1>${index}</h1><h2>${user}</h2>`;
            });
            const responseBody = template(usersHtml);
            res.write(responseBody);
            res.end();
            break;
        }
        case '/addUser': {
            if (method === 'POST') {
                const body = [];
                req.on('data', chunk => {
                    body.push(chunk);
                });
                req.on('end', () => {
                    const parsedBody = Buffer.concat(body).toString();
                    const newUser = parsedBody.replace('from_input=', '').replace(/[+]/g, ' ');
                    users.push(newUser);
                    res.end();
                });
            } else {
                res.setHeader('Content-Type', 'text/html');
                res.write(template(wrongMethod));
            }
            res.statusCode = 302;
            res.setHeader('Location', '/users');
            res.end();
            break;
        }
        default:
            {
                const responseBody = template(noPage);
                res.statusCode = 404;
                res.write(responseBody);
                res.end();
            }
            break;
    }
});

server.listen(3000);
