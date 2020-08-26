const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');

const app = new Koa();
const router = Router();

/* 中间件 */
app.use(async (ctx, next) => {
    console.log('middleware');
    next();
    console.log('middleware call');
});

/* 路由部分 */
router.get('/', (ctx) => {
    ctx.body = 'Home';
});
app.use(router.routes());

/* 静态文件 */
app.use(static('./'));

app.listen(3000);