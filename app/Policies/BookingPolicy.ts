import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Booking from 'App/Models/Booking'
import User from 'App/Models/User'

export default class BookingPolicy extends BasePolicy {
  public async create(user: User) {
    return user.isCustomer // <--- Only vendors can create theaters
  }

  public async update(user: User, booking: Booking) {
    return user.id === booking.ownerId || user.isVendor // <--- Only owner or manager or higher ranked
  }

  public async delete(user: User) {
    return user.isAdmin || user.isSuperAdmin // <--- Only admins
  }
}
