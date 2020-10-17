// https://segmentfault.com/a/1190000022536921

const Koa = require('./koa');
const app = new Koa();

// logger
app.use(async (ctx, next) => {
	await next()
	const rt = ctx['X-Response-Time'];
	console.log(`${ctx.req.method} ${ctx.req.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx['X-Response-Time'] = `${ms}ms`;
});

// response
app.use(async ctx => {
	ctx.res.setHeader('Content-Type', 'application')
	ctx.res.end('This is like koa2');
});

app.listen(8000)