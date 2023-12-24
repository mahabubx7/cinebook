import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'BookingsController.create').middleware('auth')
}).prefix('booking')
