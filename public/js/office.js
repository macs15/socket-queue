// Referencias del HTML
const lblOffice = document.querySelector('h1')
const btnNextTicket = document.querySelector('button')
const lblPending = document.querySelector('#lblPendientes')
const lblTicket = document.querySelector('#lblTicket')
const alert = document.querySelector('.alert')

const searchParams = new URLSearchParams(window.location.search)

if (!searchParams.get('office')) {
  window.location = 'index.html'
  throw new Error('El escritorio es obligatorio')
}

const office = searchParams.get('office')
lblOffice.innerText = office
alert.style.display = 'none'

const socket = io()

socket.on('connect', () => {
  btnNextTicket.disabled = false
})

socket.on('queued-tickets', totalTickets => {
  lblPending.innerText = totalTickets
  alert.style.display = 'none'
})

socket.on('disconnect', () => {
  btnNextTicket.disabled = true
})

btnNextTicket.addEventListener('click', () => {
  socket.emit('attend-ticket', { office }, ({ ok, ticket }) => {
    if (!ok) {
      alert.style.display = ''
      lblTicket.innerText = '...'
      lblPending.innerText = ''

      return
    }

    lblTicket.innerText = 'Ticket ' + ticket.number
  })
})
