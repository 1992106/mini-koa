const { createServer } = require('http');

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
        handle
      }
    }
  }

  match(method, url) {
    const midllewareList = [];
    const allRouter = [...this.routes[method], ...this.routes.all];
    allRouter.forEach((item) => {
      item.path === url && midllewareList.push(item.handle);
    });
    return midllewareList;
  }

  handle(req, res, handle) {
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
    return function(req, res) {
      const method = req.method.toLowerCase();
      const url = req.url;
      const matchList = this.match(method, url);
      this.handle(matchList);
    }
  }

  listen(...args) {
    createServer(this.handleRequest.bind(this)).listen(...args);
  }
}