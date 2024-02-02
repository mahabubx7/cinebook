/*
|-------------------------------------------------------------
| @VendorService class
| @Author: Mahabub (@mahabubx7)
|-------------------------------------------------------------
|
| This is a service class that can be used to handle database
| access layer delicately & handle necessary operations.
|
|*/

import Database from '@ioc:Adonis/Lucid/Database'
import { Role } from 'App/Enums'
import Theater from 'App/Models/Theater'
import User from 'App/Models/User'

export class VendorService {
  constructor(private readonly model = User) {}

  /**
   * Create a new Vendor
   * @param payload Partial<User>
   * @returns Promise<User> (Vendor)
   */
  public async create(payload: Partial<User>) {
    const vendor = await this.model.create({ ...payload, role: Role.VENDOR })
    return {
      name: vendor?.getName,
      ...vendor?.toJSON(),
    }
  }

  /**
   * Get one by id
   * @param id number
   * @returns Promise<User | null> (Vendor)
   * @includes Theater[]
   */
  public async getById(id: number) {
    let vendor = await this.model
      .query()
      .where('id', id)
      .where('role', Role.VENDOR)
      .preload('theaters', (query) => {
        query.select('*', Database.st().asGeoJSON('location'))
        query.preload('type', (query) => query.select(['id', 'name']))
      })
      .first()

    if (!vendor) return null

    // parse location
    vendor?.theaters.forEach((theater: Theater) => {
      theater.location = JSON.parse(theater.location)
    })

    const vendorName = vendor?.getName

    return {
      name: vendorName,
      ...vendor.toJSON(),
    }
  }

  /**
   * Get all Vendors [active]
   * @returns Promise<User[]> (vendors)
   */
  public async getVendors() {
    let vendors = await this.model
      .query()
      .where('role', Role.VENDOR)
      .preload('theaters', (query) => {
        query.select('*', Database.st().asGeoJSON('location'))
        query.preload('type', (query) => query.select(['id', 'name']))
      })
    // parse location
    vendors.forEach((vendor: any) => {
      vendor.theaters.forEach((theater: Theater) => {
        theater.location = JSON.parse(theater.location)
      })
      return {
        name: vendor.getName,
        ...vendor.toJSON(),
      }
    })
    return vendors
  }

  /**
   * Update a Vendor
   * @param id number
   * @param payload Partial<User>
   * @returns Promise<boolean>
   */
  public async update(id: number, payload: Partial<User>) {
    return this.model
      .query()
      .where('id', id)
      .where('role', Role.VENDOR)
      .update(payload)
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Remove a Vendor
   * @param id number
   * @returns Promise<boolean>
   */
  public async delete(id: number) {
    return this.model
      .query()
      .where('id', id)
      .update({ isDeleted: true })
      .then(() => true)
      .catch(() => false)
  }
}
