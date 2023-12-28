import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/apply', 'VendorsController.create').as('vendor.register')
  Route.put('/:id', 'VendorsController.update').as('vendor.update')
  Route.delete('/:id', 'VendorsController.delete').as('vendor.delete')
  Route.get('/:id', 'VendorsController.getById').as('vendor.getById')
  Route.get('/', 'VendorsController.getVendors').as('vendor.getVendors')
}).prefix('/vendor')
