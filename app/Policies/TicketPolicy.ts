import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Ticket from 'App/Models/Ticket'
import User from 'App/Models/User'

export default class TicketPolicy extends BasePolicy {
  public async before(user: User, action: string) {
    if ((user.isAdmin || user.isSuperAdmin) && ['create'].includes(action)) return true
  }

  public async create(user: User) {
    return user.isVendor // <--- Only vendors can create tickets
  }

  public async update(user: User, ticket: Ticket) {
    return user.id === ticket.ownerId || user.isManager // <--- Only owner or manager or higher ranked
  }

  public async delete(user: User, ticket: Ticket) {
    return user.id === ticket.ownerId // <--- Only owner or admins
  }
}
