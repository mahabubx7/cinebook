/*
|-------------------------------------------------------------
| @MovieService class
| @Author: Mahabub (@mahabubx7)
|-------------------------------------------------------------
|
| This is a service class that can be used to handle database
| access layer delicately & handle necessary operations.
|
|*/

import Movie from 'App/Models/Movie'

export class MovieService {
  constructor(private readonly model = Movie) {}

  /**
   * Create a new Movie
   * @params payload Partial<Movie>
   * @returns Promise<Movie>
   */
  public async create(payload: Partial<Movie>) {
    return this.model.create(payload)
  }

  /**
   * Get one by id
   * @param id number
   * @returns Promise<Movie>
   */
  public async getById(id: number) {
    return this.model.findOrFail(id)
  }

  /**
   * Update a Movie
   * @param id number
   * @param payload Partial<Movie>
   * @returns Promise<any[]>
   */
  public async update(id: number, payload: Partial<Movie>) {
    return this.model.query().where('id', id).update(payload)
  }

  /**
   * Remove a Movie
   * @param id number
   * @returns Promise<any[]>
   */
  public async delete(id: number) {
    return this.model.query().where('id', id).delete()
  }
}
