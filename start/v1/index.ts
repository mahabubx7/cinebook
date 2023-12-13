import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  require('./auth') // <--- Auth routes
  require('./theater') // <--- Theater routes
}).prefix('v1') // <--- API version prefix [version (1)]
