import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import CustomException from 'App/Exceptions/CustomException'
import Screening from 'App/Models/Screening'
import Theater from 'App/Models/Theater'
import User from 'App/Models/User'

export default class ScreeningPolicy extends BasePolicy {
  public async before(user: User, action: string) {
    if ((user.isAdmin || user.isSuperAdmin) && !['create'].includes(action)) return true
  }

  public async create(user: User) {
    return user.isVendor // <--- Only vendor can create screenings
  }

  public async update(user: User, screening: Screening) {
    const theater = await Theater.findBy('id', screening.theaterId)
    if (!theater) throw new CustomException('Theater not found')
    return theater.vendorId === user.id || user.isManager // <--- Only owner/manager
  }

  public async delete(user: User, screening: Screening) {
    const theater = await Theater.findBy('id', screening.theaterId)
    if (!theater) throw new CustomException('Theater not found')
    return theater.vendorId === user.id // <--- Only owner or admins
  }
}
