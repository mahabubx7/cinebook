import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class MoviePolicy extends BasePolicy {
  public async before(user: User, action: string) {
    if ((user.isAdmin || user.isSuperAdmin) && ['create'].includes(action)) return true
  }

  public async create(user: User) {
    return user.isManager // <--- Only managers can create movies
  }

  public async update(user: User) {
    return user.isManager // <--- Only manager
  }

  public async delete(user: User) {
    return user.isManager // <--- Only manager
  }
}
