import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'TicketsController.create').middleware('auth')
  Route.get('/:ticketCode', 'TicketsController.getOneTicket').middleware('auth')
}).prefix('ticket')
