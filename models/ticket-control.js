import { createRequire } from 'module'
import path from 'path'
import { writeFileSync } from 'fs'

const require = createRequire(import.meta.url)

class Ticket {
  constructor(number, office) {
    this.number = number
    this.office = office
  }
}

export default class TicketControl {
  constructor() {
    this.last = 0
    this.today = new Date().getDate()
    this.tickets = []
    this.lastFour = []

    this.init()
  }

  get toJSON() {
    return {
      last: this.last,
      today: this.today,
      tickets: this.tickets,
      lastFour: this.lastFour
    }
  }

  async init() {
    const { last, today, tickets, lastFour } = await require('../db/data.json')
    if (today === this.today) {
      this.tickets = tickets
      this.lastFour = lastFour
      this.last = last
    } else {
      this.saveDB()
    }
  }

  saveDB() {
    const __dirname = path.resolve()
    const dbPath = path.join(__dirname, '/db/data.json')
    writeFileSync(dbPath, JSON.stringify(this.toJSON))
  }

  next() {
    this.last += 1
    const ticket = new Ticket(this.last, null)
    this.tickets.push(ticket)

    this.saveDB()
    return `Ticket ${ticket.number}`
  }

  attendTicket(office) {
    if (this.tickets.length === 0) return null

    const ticket = this.tickets.shift()
    ticket.office = office

    this.lastFour.unshift(ticket)

    if (this.lastFour.length > 4) {
      this.lastFour.splice(-1, 1)
    }

    this.saveDB()

    return ticket
  }
}
