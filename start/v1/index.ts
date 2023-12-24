import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  require('./auth') // <--- Auth routes
  require('./theater') // <--- Theater routes
  require('./vendor') // <--- Vendor routes
  require('./auditorium') // <--- Auditorium routes
  require('./movie') // <--- Movie routes
  require('./screen') // <--- Screening routes
  require('./booking') // <--- Booking routes
}).prefix('v1') // <--- API version prefix [version (1)]
