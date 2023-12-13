import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/:id', 'TheatersController.getTheaterInfo').as('getTheaterInfo')
}).prefix('theater')
