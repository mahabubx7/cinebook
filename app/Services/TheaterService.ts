/*
|-------------------------------------------------------------
| @TheaterService class
| @Author: Mahabub (@mahabubx7)
|-------------------------------------------------------------
|
| This is a service class that can be used to handle database
| access layer delicately & handle necessary operations.
|
|*/

import Theater from 'App/Models/Theater'

export class TheaterService {
  constructor(private readonly model = Theater) {}

  /**
   * Create a new Theater
   * @params payload Partial<Theater>
   * @returns Promise<Theater>
   */
  public async create(payload: Partial<Theater>) {
    return this.model.create(payload)
  }

  /**
   * Get one by id
   * @param id number
   * @returns Promise<Theater>
   */
  public async getById(id: number) {
    return this.model.findOrFail(id)
  }

  /**
   * Update a Theater
   * @param id number
   * @param payload Partial<Theater>
   * @returns Promise<any[]>
   */
  public async update(id: number, payload: Partial<Theater>) {
    return this.model.query().where('id', id).update(payload)
  }

  /**
   * Remove a Theater
   * @param id number
   * @returns Promise<any[]>
   */
  public async delete(id: number) {
    return this.model.query().where('id', id).delete()
  }
}
