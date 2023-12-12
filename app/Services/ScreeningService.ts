/*
|-------------------------------------------------------------
| @ScreeningService class
| @Author: Mahabub (@mahabubx7)
|-------------------------------------------------------------
|
| This is a service class that can be used to handle database
| access layer delicately & handle necessary operations.
|
|*/

import Screening from 'App/Models/Screening'

export class ScreeningService {
  constructor(private readonly model = Screening) {}

  /**
   * Create a new Screening
   * @params payload Partial<Screening>
   * @returns Promise<Screening>
   */
  public async create(payload: Partial<Screening>) {
    return this.model.create(payload)
  }

  /**
   * Get one by id
   * @param id number
   * @returns Promise<Screening>
   */
  public async getById(id: number) {
    return this.model.findOrFail(id)
  }

  /**
   * Update a Screening
   * @param id number
   * @param payload Partial<Screening>
   * @returns Promise<any[]>
   */
  public async update(id: number, payload: Partial<Screening>) {
    return this.model.query().where('id', id).update(payload)
  }

  /**
   * Remove a Screening
   * @param id number
   * @returns Promise<any[]>
   */
  public async delete(id: number) {
    return this.model.query().where('id', id).delete()
  }
}
