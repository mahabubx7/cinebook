import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Theater from 'App/Models/Theater'

export default class TheaterPolicy extends BasePolicy {
  public async before(user: User, action: string) {
    if ((user.isAdmin || user.isSuperAdmin) && !['create'].includes(action)) return true
  }

  public async create(user: User) {
    return user.isVendor // <--- Only vendors can create theaters
  }

  public async update(user: User, theater: Theater) {
    return user.id === theater.vendorId || user.isManager // <--- Only owner or manager or higher ranked
  }

  public async delete(user: User, theater: Theater) {
    return user.id === theater.vendorId // <--- Only owner or admins
  }
}
