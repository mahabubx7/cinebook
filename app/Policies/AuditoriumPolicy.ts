import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Auditorium from 'App/Models/Auditorium'
import User from 'App/Models/User'

export default class AuditoriumPolicy extends BasePolicy {
  public async before(user: User, action: string) {
    console.log('Meta Data :=> ', {
      user,
      action,
    })
    if ((user.isAdmin || user.isSuperAdmin) && ['create'].includes(action)) return true
  }

  public async create(user: User) {
    return user.isVendor // <--- Only vendors can create auditoriums
  }

  public async update(user: User, auditorium: Auditorium) {
    return user.id === auditorium.theaterId || user.isManager // <--- Only owner/manager
  }

  public async delete(user: User) {
    return user.isSuperAdmin // <--- Only super-admins
  }
}
