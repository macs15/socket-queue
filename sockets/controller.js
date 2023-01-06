import TicketControl from '../models/ticket-control.js'

const ticketControl = new TicketControl()

export const socketController = socket => {
  socket.emit('last-ticket', ticketControl.last)
  socket.emit('queued-tickets', ticketControl.tickets.length)
  socket.emit('current-state', ticketControl.lastFour)

  socket.on('next-ticket', (_, callback) => {
    const next = ticketControl.next()
    callback(next)

    socket.broadcast.emit('queued-tickets', ticketControl.tickets.length)
  })

  socket.on('attend-ticket', ({ office }, callback) => {
    if (!office) {
      callback({ ok: false, msg: 'Field office is required' })
    }

    const ticket = ticketControl.attendTicket(office)

    socket.emit('queued-tickets', ticketControl.tickets.length)
    socket.broadcast.emit('queued-tickets', ticketControl.tickets.length)
    socket.broadcast.emit('current-state', ticketControl.lastFour)

    if (!ticket) {
      callback({
        ok: false,
        msg: 'No tickets left'
      })
      return
    }

    callback({ ok: true, ticket })
  })
}
