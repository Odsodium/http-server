import { Server } from 'https://agorushkin.deno.dev/modules/http-server';

const server = new Server(false);

try {
    Deno.lstatSync('.\\log.txt')
} catch(_) { Deno.create('.\\log.txt'); }

server.use('/*', (ctx) => {
    const fileRoute = decodeURI(ctx.request.url.path.replace(/^\//, ''));
    const log = (message: string) => {
        console.log(message);
        const data = Deno.readTextFileSync('.\\log.txt');
        Deno.writeTextFileSync('.\\log.txt', `${data}\n${message}`);
    };

    log(`${'-'.repeat(175)}
    Connection at ${fileRoute}
    Headers = ${JSON.stringify(Object.fromEntries(ctx.request.headers), null, 2)}`);

    try {
        const text = Deno.readTextFileSync(fileRoute);
        ctx.response.headers.set('content-type', 'text/html');
        ctx.response.body = text.replace(/\r?\n/g, '<br>');
    } catch (_) {
        ctx.response.body = `No file located at ${fileRoute}`;
        ctx.response.status = 404;
    }
});

server.listen(8080);

//deno run --allow-all server.ts
//deno compile --allow-all --output=build.exe .\server.ts
//Jackmin is the best, Gorushkin = Loser
