import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'ScreeningsController.index')
  Route.get('/:id', 'ScreeningsController.getById')
  Route.get('/uid/:uid', 'ScreeningsController.getByUid')
  Route.post('/', 'ScreeningsController.create')
  Route.put('/:id', 'ScreeningsController.update')
  Route.delete('/:id', 'ScreeningsController.destroy')
}).prefix('screen')
