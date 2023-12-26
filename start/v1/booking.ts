import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'BookingsController.create').middleware('auth')
  Route.get('/pending', 'BookingsController.getPendingBookings').middleware('auth')
}).prefix('booking')
