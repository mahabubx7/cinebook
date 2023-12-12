/*
|-------------------------------------------------------------
| @AuditoriumService class
| @Author: Mahabub (@mahabubx7)
|-------------------------------------------------------------
|
| This is a service class that can be used to handle database
| access layer delicately & handle necessary operations.
|
|*/

import Auditorium from 'App/Models/Auditorium'

export class AuditoriumService {
  constructor(private readonly model = Auditorium) {}

  /**
   * Create a new Auditorium
   * @params payload Partial<Auditorium>
   * @returns Promise<Auditorium>
   */
  public async create(payload: Partial<Auditorium>) {
    return this.model.create(payload)
  }

  /**
   * Get one by id
   * @param id number
   * @returns Promise<Auditorium>
   */
  public async getById(id: number) {
    return this.model.findOrFail(id)
  }

  /**
   * Update a Auditorium
   * @param id number
   * @param payload Partial<Auditorium>
   * @returns Promise<any[]>
   */
  public async update(id: number, payload: Partial<Auditorium>) {
    return this.model.query().where('id', id).update(payload)
  }

  /**
   * Remove a Auditorium
   * @param id number
   * @returns Promise<any[]>
   */
  public async delete(id: number) {
    return this.model.query().where('id', id).delete()
  }
}
