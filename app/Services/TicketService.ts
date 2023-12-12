/*
|-------------------------------------------------------------
| @TicketService class
| @Author: Mahabub (@mahabubx7)
|-------------------------------------------------------------
|
| This is a service class that can be used to handle database
| access layer delicately & handle necessary operations.
|
|*/

import Ticket from 'App/Models/Ticket'

export class TicketService {
  constructor(private readonly model = Ticket) {}

  /**
   * Create a new Ticket
   * @params payload Partial<Ticket>
   * @returns Promise<Ticket>
   */
  public async create(payload: Partial<Ticket>) {
    return this.model.create(payload)
  }

  /**
   * Get one by id
   * @param id number
   * @returns Promise<Ticket>
   */
  public async getById(id: number) {
    return this.model.findOrFail(id)
  }

  /**
   * Update a Ticket
   * @param id number
   * @param payload Partial<Ticket>
   * @returns Promise<any[]>
   */
  public async update(id: number, payload: Partial<Ticket>) {
    return this.model.query().where('id', id).update(payload)
  }

  /**
   * Remove a Ticket
   * @param id number
   * @returns Promise<any[]>
   */
  public async delete(id: number) {
    return this.model.query().where('id', id).delete()
  }
}
