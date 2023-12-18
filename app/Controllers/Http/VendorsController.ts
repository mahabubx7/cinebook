import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { VendorService } from 'App/Services'
import CreateVendorDto from 'App/Validators/vendor/CreateVendorDto'
import UpdateVendorDto from 'App/Validators/vendor/UpdateVendorDto'

export default class VendorsController {
  constructor(private readonly vendorService = new VendorService()) {}

  // CREATE: Add new vendor account :: Register or application
  public async create({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateVendorDto)
    const vendor = await this.vendorService.create(payload)
    return response.created({ message: 'Vendor registration successful!', data: vendor })
  }

  // READ: Get vendor by id
  public async getById({ params, response }: HttpContextContract) {
    const vendor = await this.vendorService.getById(params.id)
    if (!vendor) return response.notFound({ message: 'Vendor not found!' })
    return response.ok({ ...vendor })
  }

  // READ: Get all vendors
  public async getVendors({ response }: HttpContextContract) {
    const vendors = await this.vendorService.getVendors()
    return response.ok(vendors)
  }

  // UPDATE: Update vendor account
  public async update({ params, request, response }: HttpContextContract) {
    const payload = await request.validate(UpdateVendorDto)
    const vendor = await this.vendorService.update(params.id, payload)
    if (!vendor) return response.notFound({ message: "Vendor couldn't be updated!" })
    return response.accepted({ message: 'Vendor updated successfully!' })
  }

  // DELETE: Delete vendor account
  public async delete({ params, response }: HttpContextContract) {
    const vendor = await this.vendorService.delete(params.id)
    if (!vendor) return response.notFound({ message: "Vendor couldn't be deleted!" })
    return response.accepted({ message: 'Vendor deleted successfully!' })
  }
}
