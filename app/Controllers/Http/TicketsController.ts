import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TicketService } from 'App/Services'

export default class TicketsController {
  constructor(private readonly ticketService: TicketService = new TicketService()) {}

  public async create({ request, auth, bouncer, response }: HttpContextContract) {
    const { showId, seats } = request.body()
    await auth.authenticate()
    await bouncer.with('TicketPolicy').authorize('create')
    const { id } = auth.user!

    const ticket = await this.ticketService.create({
      ownerId: id,
      showId,
      seats,
    })

    return response.created(ticket)
  }

  public async getOneTicket({ params, response }: HttpContextContract) {
    const { ticketCode } = params
    const ticket = await this.ticketService.getByTicketCode(ticketCode)
    if (!ticket) return response.notFound({ message: 'Ticket not found!' })
    return response.ok(ticket)
  }
}
