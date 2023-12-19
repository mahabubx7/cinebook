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
   * @returns Promise<Movie | null>
   */
  public async getById(id: number) {
    return this.model.query().where('id', id).preload('screens').first()
  }

  /**
   * Get one by id (UID)
   * @param uid string
   * @returns Promise<Movie | null>
   */
  public async getByUid(uid: string) {
    return this.model.query().where('uid', uid).preload('screens').first()
  }

  /**
   * Get List (latest first)
   * @param pageLimit number (default: 10)
   * @param page number (default: 1)
   * @returns Promise<Movie[]> (paginated)
   */
  public async getList({ page = 1, pageLimit = 10 }: { page?: number; pageLimit?: number } = {}) {
    return this.model.query().preload('screens').paginate(page, pageLimit)
  }

  /**
   * Update a Movie
   * @param id number
   * @param payload Partial<Movie>
   * @returns Promise<any[]>
   */
  public async update(id: number, payload: Partial<Movie>) {
    return this.model
      .query()
      .where('id', id)
      .update(payload)
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Remove a Movie
   * @param id number
   * @returns Promise<any[]>
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
