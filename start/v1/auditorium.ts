import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'AuditoriumsController.store')
  Route.post('/:id/attach', 'AuditoriumsController.assignShows')
  Route.put('/:id', 'AuditoriumsController.update')
  Route.delete('/:id', 'AuditoriumsController.destroy')
  Route.get('/screen', 'AuditoriumsController.getByShow')
  Route.get('/uid/:uid', 'AuditoriumsController.show')
  Route.get('/:id', 'AuditoriumsController.getById')
  Route.get('/', 'AuditoriumsController.index')
}).prefix('auditorium')
