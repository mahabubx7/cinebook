import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'TheatersController.addTheater').as('addTheater').middleware('auth')
  Route.put('/:id', 'TheatersController.updateTheater').as('updateTheater').middleware('auth')
  Route.delete('/:id', 'TheatersController.deleteTheater').as('deleteTheater').middleware('auth')
  Route.get('/vendor/:id', 'TheatersController.getTheatersByVendor').as('getTheatersByVendor')
  Route.get('/', 'TheatersController.getNearbyTheaters').as('getNearestTheatersByVendor')
  Route.get('/:id', 'TheatersController.getTheaterInfo').as('getTheaterInfo')
}).prefix('theater')
