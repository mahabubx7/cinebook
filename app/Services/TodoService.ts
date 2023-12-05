/*
|-------------------------------------------------------------
| @TodoService class
| @Author: Mahabub (@mahabubx7)
|-------------------------------------------------------------
|
| This is a service class that can be used to handle database
| access layer delicately & handle necessary operations.
|
|*/

import Todo from 'App/Models/Todo'

export class TodoService {
  constructor(private readonly model = Todo) {}

  /**
   * Create a new Todo
   * @param payload Partial<Todo>
   * @returns Promise<Todo>
   */
  public async create(payload: Partial<Todo>) {
    return this.model.create(payload)
  }

  /**
   * Get one by id
   * @param id number
   * @returns Promise<Todo>
   */
  public async getById(id: number) {
    return this.model.findOrFail(id).catch(() => null)
  }

  /**
   * Get all todos for a user
   * @param userId number
   * @returns Promise<Todo[]>
   */
  public async getTodos(userId: number) {
    return this.model.query().where('user_id', userId).orderBy('id', 'desc')
  }

  /**
   * Update a Todo
   * @param todo Todo
   * @param payload Partial<Todo>
   * @returns Promise<boolean>
   */
  public async update(todo: Todo, payload: Partial<Todo>) {
    const updates = { ...todo, ...payload }
    const result = await this.model
      .updateOrCreate({ id: todo.id }, updates)
      .then(() => true)
      .catch(() => false)

    return result
  }

  /**
   * Remove a Todo
   * @param todo Todo
   * @returns Promise<boolean>
   */
  public async remove(todo: Todo) {
    const result = await todo
      .delete()
      .then(() => true)
      .catch(() => false)

    return result
  }
}
