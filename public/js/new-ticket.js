// Referencias del HTML
const lblTicket = document.querySelector('#lblNewTicket')
const btnCreate = document.querySelector('button')

const socket = io()

socket.on('connect', () => {
  btnCreate.disabled = false
})

socket.on('disconnect', () => {
  btnCreate.disabled = true
})

socket.on('last-ticket', lastTicket => {
  lblTicket.innerText = `Ticket ${lastTicket}`
})

btnCreate.addEventListener('click', () => {
  socket.emit('next-ticket', null, ticket => {
    lblTicket.innerText = ticket
  })
})
