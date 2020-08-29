const http = require('http');

class Express {

  constructor() {
    this.routes = {
      get: [],
      post: [],
      all: []
    }
  }

  get(path, handle) {
    const router = this.handleAddRoute(path, handle);
    this.routes.get.push(router);
  }

  post(path, handle) {
    const router = this.handleAddRoute(path, handle);
    this.routes.post.push(router);
  }

  use(path, handle) {
    const router = this.handleAddRoute(path, handle);
    this.routes.all.push(router);
  }

  handleAddRoute(path, handle) {
    let router = {};
    if (typeof path === 'string') {
      router = {
        path,
        handle
      }
    } else {
      router = {
        path: '/',
        handle: path
      }
    }
    return router;
  }

  match(method, url) {
    const matchedList = [];
    const allRouter = [...this.routes.all, ...this.routes[method]];
    allRouter.forEach((item) => {
      item.path === url && matchedList.push(item.handle);
    });
    return matchedList;
  }

  handle(req, res, stack) {
    const next = () => {
      // 拿到第一个匹配的中间件
			const middleware = stack.shift()
			if (middleware) {
				// 执行中间件
				middleware(req, res, next)
			}
    };
    next();
  }

  handleRequest() {
    return (req, res) => {
      const method = req.method.toLowerCase();
      const url = req.url;
      const matchedList = this.match(method, url);
      this.handle(req, res, matchedList);
    }
  }

  listen(...args) {
    http.createServer(this.handleRequest()).listen(...args);
  }
}

module.exports = Express