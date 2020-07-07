const http = require('http')

class Application {
  constructor() {
    this.middlewares = []
  }

  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }

  callback() {
    return async (req, res) => {
      const ctx = new Context(req, res)
      const fn = compose(this.middlewares)
      try {
        await fn(ctx)
      } catch (e) {
        console.error(e)
        ctx.res.statusCode = 500
        ctx.res.end('Internel Server Error')
      }
      ctx.res.end(ctx.body)
    }
  }

  use(middleware) {
    this.middlewares.push(middleware)
  }
}

function compose(middlewares) {
  return ctx => {
    const dispatch = (i) => {
      const middleware = middlewares[i]
      if (i === middlewares.length) {
        return
      }
      return middleware(ctx, () => dispatch(i + 1))
    }
    return dispatch(0)
  }
}

class Context {
  constructor(req, res) {
    this.req = req
    this.res = res
  }
}

module.exports = Application