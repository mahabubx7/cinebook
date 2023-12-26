/*
|-------------------------------------------------------------
| @TicketService class
| @Author: Mahabub (@mahabubx7)
|-------------------------------------------------------------
|
| This is a service class that can be used to handle database
| access layer delicately & handle necessary operations.
|
|*/

import Booking from 'App/Models/Booking'
import Ticket from 'App/Models/Ticket'

interface CreateTicketParams {
  ownerId: number
  showId: number
  seats: number[]
}

export class TicketService {
  constructor(private readonly model = Ticket) {}

  private async processSeatNames(seatsArr: number[], namesArr: string[]) {
    const names: Record<string, number[]> = {}
    namesArr.forEach((str) => {
      const match = str.match(/([a-zA-Z\s]+) \((\d+)\)/)
      if (match) {
        const name = match[1].trim()
        const seat = parseInt(match[2], 10)
        if (names[name]) {
          names[name].push(seat)
        } else {
          names[name] = [seat]
        }
      }
    })
    const seatNames: string[] = []
    for (const name in names) {
      const nums = names[name].join(',')
      seatNames.push(`${name} (${nums})`)
    }
  }

  /**
   * @private
   * Get processed Seat Name
   * @param seats number[]
   * @returns Promise<string[]>
   */
  private async processSeats(seats: number[], { onlySeats = false }: { onlySeats?: boolean } = {}) {
    if (!onlySeats) {
      const bookings = await Booking.query()
        .whereIn('id', seats)
        .select('seatNumber', 'auditoriumId', 'price')
        .preload('auditorium', (query) => query.select('name'))
        .catch((err) => {
          throw err
        })

      const seatNamesArr = bookings.map(
        (booking) => `${booking.auditorium.name} (${booking.seatNumber})`
      )
      const names: Record<string, number[]> = {}
      seatNamesArr.forEach((str) => {
        const match = str.match(/([a-zA-Z\s]+) \((\d+)\)/)
        if (match) {
          const name = match[1].trim()
          const seat = parseInt(match[2], 10)
          if (names[name]) {
            names[name].push(seat)
          } else {
            names[name] = [seat]
          }
        }
      })
      const seatNames: string[] = []
      for (const name in names) {
        const nums = names[name].join(',')
        seatNames.push(`${name} (${nums})`)
      }
      const totalPrice = bookings.reduce((total, seat) => total + seat.price, 0)

      return { seatNames, totalPrice }
    } else {
      const bookings = await Booking.query()
        .whereIn('id', seats)
        .select('seatNumber', 'auditoriumId')
        .preload('auditorium', (query) => query.select('name'))
        .catch((err) => {
          throw err
        })
      const seatNamesArr = bookings.map(
        (booking) => `${booking.auditorium.name} (${booking.seatNumber})`
      )
      const names: Record<string, number[]> = {}
      seatNamesArr.forEach((str) => {
        const match = str.match(/([a-zA-Z\s]+) \((\d+)\)/)
        if (match) {
          const name = match[1].trim()
          const seat = parseInt(match[2], 10)
          if (names[name]) {
            names[name].push(seat)
          } else {
            names[name] = [seat]
          }
        }
      })
      const seatNames: string[] = []
      for (const name in names) {
        const nums = names[name].join(',')
        seatNames.push(`${name} (${nums})`)
      }

      return { seatNames }
    }
  }

  /**
   * Create a new Ticket
   * @param payload CreateTicketParams
   * @returns Promise<Ticket>
   * @includes Show (+= Movie), Owner
   */
  public async create(payload: CreateTicketParams) {
    const { ownerId, showId, seats } = payload
    const { seatNames, totalPrice } = await this.processSeats(seats)
    const ticket = await this.model
      .create({
        ownerId,
        showId,
        price: totalPrice,
      })
      .catch((err) => {
        throw err
      })

    // attach ticket in booking
    await Booking.query().whereIn('id', seats).update({ ticketId: ticket.id })

    return {
      message: 'Ticket created successfully!',
      ticket: {
        id: ticket.id,
        uid: ticket.uid,
        price: ticket.price,
        isPaid: ticket.isPaid,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        seats: seatNames,
      },
    }
  }

  /**
   * Get one by id
   * @param id number
   * @returns Promise<Ticket | null>
   */
  public async getById(id: number) {
    return this.model.find(id)
  }

  /**
   * Get one Ticket by TicketID
   * @param ticketCode string
   * @returns Promise<Ticket | null>
   */
  public async getByTicketCode(ticketCode: string) {
    const ticket = await this.model.findBy('uid', ticketCode)
    if (!ticket) return null
    let seats = await Booking.query().where('ticketId', ticket.id).select('id')
    const { seatNames } = await this.processSeats(
      seats.map((seat) => seat.id),
      {
        onlySeats: true,
      }
    )
    return {
      ...ticket.toJSON(),
      seats: seatNames,
    }
  }

  /**
   * Update a Ticket
   * @param id number
   * @param payload Partial<Ticket>
   * @returns Promise<any[]>
   */
  public async update(id: number, payload: Partial<Ticket>) {
    return this.model.query().where('id', id).update(payload)
  }

  /**
   * Remove a Ticket
   * @param id number
   * @returns Promise<any[]>
   */
  public async delete(id: number) {
    return this.model.query().where('id', id).delete()
  }
}
