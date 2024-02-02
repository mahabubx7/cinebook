import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

interface Vendor {
  [x: string]: any
}

export default class VendorPolicy extends BasePolicy {
  public async before(user: User, action: string) {
    if ((user.isAdmin || user.isSuperAdmin) && ['create'].includes(action)) return true
  }

  public async create(user: User) {
    return user.isVendor // <--- Only vendors can create theaters
  }

  public async update(user: User, vendor: Vendor) {
    return user.id === vendor.id // <--- Only owner or admins
  }

  public async delete(user: User, vendor: Vendor) {
    return user.id === vendor.id // <--- Only owner or admins
  }
}
