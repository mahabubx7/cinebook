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
import { MovieService } from './MovieService'
import Database from '@ioc:Adonis/Lucid/Database'

interface CreateTicketParams {
  ownerId: number
  showId: number
  seats: number[]
}

export class TicketService {
  constructor(private readonly model = Ticket) {}

  /**
   * @private
   * Processed Seat Names
   * @param names string[]
   * @returns Promise<string[]>
   */
  private async processSeatNames(namesArr: string[]) {
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

    return seatNames
  }

  /**
   * @private
   * Process Seats
   * @param seats number[]
   * @param onlySeats boolean
   * @returns Promise<Record<string, any>>
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
      const seatNames = await this.processSeatNames(seatNamesArr)
      const totalPrice = bookings.reduce((total, seat) => total + seat.price, 0)

      return { seatNames, totalPrice: Math.round(totalPrice) }
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
      const seatNames = await this.processSeatNames(seatNamesArr)
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
   * @includes BookingInfo (Seats, Theater, Show)
   */
  public async getById(id: number) {
    const ticket = await this.model.findBy('id', id)
    if (!ticket) return null
    let seats = await Booking.query().where('ticketId', ticket.id).select('id')
    const { seatNames } = await this.processSeats(
      seats.map((seat) => seat.id),
      {
        onlySeats: true,
      }
    )
    const show = await ticket.related('show').query().first()
    const movie = await show!.related('movie').query().first()
    const theater = await show!
      .related('theater')
      .query()
      .select('id', 'name', 'address', 'location', Database.st().asGeoJSON('location'))
      .first()
    const movieWithInfo = await new MovieService().getMovieInfo(movie!.tmdbId, movie!)
    const booking = await Booking.query()
      .where('ticketId', ticket.id)
      .andWhere('showId', show!.id)
      .first()
    return {
      ...ticket.toJSON(),
      bookingInfo: {
        date: booking!.date,
        showStartsAt: show!.startTime,
        showEndsAt: show!.endTime,
        theater: {
          id: theater!.id,
          name: theater!.name,
          address: theater!.address,
          location: JSON.parse(theater!.location),
        },
        seats: seatNames,
        movie: {
          ...movie?.toJSON(),
          info: movieWithInfo!.info,
        },
      },
    }
  }

  /**
   * Get one Ticket by TicketID
   * @param ticketCode string
   * @returns Promise<Ticket | null>
   * @includes BookingInfo (Seats, Theater, Show)
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
    const show = await ticket.related('show').query().first()
    const movie = await show!.related('movie').query().first()
    const theater = await show!
      .related('theater')
      .query()
      .select('id', 'name', 'address', 'location', Database.st().asGeoJSON('location'))
      .first()
    const movieWithInfo = await new MovieService().getMovieInfo(movie!.tmdbId, movie!)
    const booking = await Booking.query()
      .where('ticketId', ticket.id)
      .andWhere('showId', show!.id)
      .first()
    return {
      ...ticket.toJSON(),
      bookingInfo: {
        date: booking!.date,
        showStartsAt: show!.startTime,
        showEndsAt: show!.endTime,
        theater: {
          id: theater!.id,
          name: theater!.name,
          address: theater!.address,
          location: JSON.parse(theater!.location),
        },
        seats: seatNames,
        movie: {
          ...movie?.toJSON(),
          info: movieWithInfo!.info,
        },
      },
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
