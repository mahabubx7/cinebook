import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'MoviesController.index')
  Route.get('/:id', 'MoviesController.show')
  Route.get('/uid/:uid', 'MoviesController.getByUid')
  Route.post('/', 'MoviesController.store')
  Route.put('/:id', 'MoviesController.update')
  Route.delete('/:id', 'MoviesController.destroy')
}).prefix('movie')
