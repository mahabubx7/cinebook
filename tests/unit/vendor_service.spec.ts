import { test } from '@japa/runner'
import { VendorService } from 'App/Services'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Vendor', (group) => {
  const vendorService = new VendorService()

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  }) // <--- prepare or rollback database

  // Vendor: create a vendor
  test('vendor: should create a vendor', async ({ assert }) => {
    const vendor = await vendorService.create({
      fname: 'tFirstName',
      lname: 'tLastName',
      email: 'vendor@email.com',
      password: 'password',
    }) // <--- Create a user<Vendor>

    // checks
    assert.exists(vendor.id) // <--- User has ID
    assert.exists(vendor.email) // <--- User has email
    assert.strictEqual(vendor.email, 'vendor@email.com') // <--- Email is OK!
    assert.notEqual(vendor.password, 'password') // <--- Password is hashed
    assert.strictEqual(vendor.role, 'vendor') // <--- Role is set to VENDOR
  })

  // Vendor: find a vendor (by Id)
  test('vendor: should find a vendor (by Id)', async ({ assert }) => {
    const vendor = await vendorService.create({
      fname: 'idFirstName',
      lname: 'idLastName',
      email: 'vendor2@email.com',
      password: 'password',
    })

    const findVendor = await vendorService.getById(vendor.id) // <--- Find user by ID
    // checks
    assert.notEqual(vendor, null) // <--- User cannot be null
    assert.exists(findVendor!.id) // <--- User has ID
    assert.strictEqual(findVendor!.role, 'vendor') // <--- Role is set to VENDOR
    assert.strictEqual(findVendor!.email, 'vendor2@email.com') // <--- Email is OK!
    assert.strictEqual(vendor.id, findVendor!.id) // <--- ID is same
  })

  // Vendor: get vendors
  test('vendor: should get vendors', async ({ assert }) => {
    await vendorService.create({
      fname: 'getFirstName',
      lname: 'gettLastName',
      email: 'vendor3@email.com',
      password: 'password',
    })

    const vendors = await vendorService.getVendors() // <--- Get all vendors
    // checks
    assert.isArray(vendors) // <--- Vendors is an array
    assert.notEmpty(vendors) // <--- Vendors is not empty
  })

  // Vendor: update a vendor
  test('vendor: should update a vendor', async ({ assert }) => {
    const vendor = await vendorService.create({
      fname: 'upFirstName',
      lname: 'upLastName',
      email: 'vendor4@email.com',
      password: 'password',
    })

    const updatedVendor = await vendorService.update(vendor.id, {
      fname: 'updatedFirstName',
      lname: 'updatedLastName',
    }) // <--- Update a vendor

    // checks
    assert.notEqual(vendor, null) // <--- User cannot be null
    assert.isTrue(updatedVendor) // <--- User has been updated
  })

  // Vendor: delete a vendor
  test('vendor: should delete a vendor', async ({ assert }) => {
    const vendor = await vendorService.create({
      fname: 'delFirstName',
      lname: 'delLastName',
      email: 'vendor5@email.com',
      password: 'password',
    })

    const deletedVendor = await vendorService.delete(vendor.id) // <--- Delete a vendor
    // checks
    assert.notEqual(vendor, null) // <--- User cannot be null
    assert.isTrue(deletedVendor) // <--- User has been deleted
    const findAgain = await vendorService.getById(vendor.id) // <--- Find vendor by ID
    assert.notEqual(findAgain, null) // <--- vendor cannot be found
    assert.strictEqual(findAgain!['is_deleted'], true) // <--- vendor is deleted
  })
})
