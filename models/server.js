import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server as ServerIo } from 'socket.io'
import { socketController } from '../sockets/controller.js'

class Server {
  constructor() {
    this.app = express()
    this.port = process.env['PORT'] || 3000
    this.server = createServer(this.app)
    this.io = new ServerIo(this.server)
    this.paths = {}

    // Middleware
    this.middleware()

    // App routes
    this.routes()

    // Sockets
    this.sockets()
  }

  middleware() {
    this.app.use(cors())

    this.app.use(express.static('public'))
  }

  routes() {}

  sockets() {
    this.io.on('connection', socketController)
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log('server running on port', process.env['PORT'])
    })
  }
}

export default Server
