/*
|-------------------------------------------------------------
| @MovieService class
| @Author: Mahabub (@mahabubx7)
|-------------------------------------------------------------
|
| This is a service class that can be used to handle database
| access layer delicately & handle necessary operations.
|
|*/

import Movie from 'App/Models/Movie'
import Redis from '@ioc:Adonis/Addons/Redis'
import Env from '@ioc:Adonis/Core/Env'
import Screening from 'App/Models/Screening'
import Database from '@ioc:Adonis/Lucid/Database'
import Theater from 'App/Models/Theater'

export class MovieService {
  constructor(
    private readonly model = Movie,
    private readonly redis = Redis
  ) {}

  /**
   * Create a new Movie
   * @params payload Partial<Movie>
   * @returns Promise<Movie>
   */
  public async create(payload: Partial<Movie>) {
    return this.model.create(payload)
  }

  /**
   * Get Movie Info from TheMovieDB
   * @param tmdbId number
   * @param movie Movie
   * @returns Promise<Record<string, any>>
   */
  public async getMovieInfo(tmdbId: number) {
    if (!tmdbId) return null
    const key = `movie:info:${tmdbId}`
    const cached = await this.redis.get(key)
    if (cached) return JSON.parse(cached)
    const movieInfo = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
      headers: {
        Authorization: `Bearer ${Env.get('TMDB_API_KEY')}`,
        ContentType: 'application/json;charset=utf-8',
      },
    })
      .then((res) => res.json())
      .catch(() => null)

    if (!movieInfo) return null
    await this.redis.set(key, JSON.stringify(movieInfo), 'EX', 60 * 60 * 24 * 3) // 3 days
    return movieInfo
  }

  /**
   * Get one by id
   * @param id number
   * @returns Promise<Movie | null>
   * @includes MovieInfo (from TheMovieDB)
   */
  public async getById(id: number) {
    const key = `movie:id:${id}`
    const cached = await this.redis.get(key)
    if (cached) return JSON.parse(cached)
    const movie = await this.model.query().where('id', id).first()
    if (!movie) return null
    const movieData = await this.getMovieInfo(movie.tmdbId)
    const response = {
      ...movie.toJSON(),
      info: movieData,
    }
    await this.redis.set(key, JSON.stringify(response), 'EX', 60 * 60 * 24) // 24hrs
    return response
  }

  /**
   * Get one by id (UID)
   * @param uid string
   * @param coordinates [number, number] (optional)
   * @param theaterLimit number (optional) [default = 50]
   * @returns Promise<Movie | null>
   * @includes MovieInfo (from TheMovieDB)
   */
  public async getByUid(uid: string, coordinates?: [number, number], theaterLimit?: number) {
    const key = `movie:uid:${uid}`
    const cached = await this.redis.get(key)
    if (cached) return JSON.parse(cached)

    const movie = await this.model.query().where('uid', uid).first()
    if (!movie) return null

    const activeTheaters = await this.getTheatersByMovieId(movie.id, coordinates, theaterLimit)

    const movieInfo = await this.getMovieInfo(movie.tmdbId) // get movie info from tmdb

    const movieResponse = {
      ...movie.toJSON(),
      info: movieInfo,
      theaters: activeTheaters,
    }

    await this.redis.set(key, JSON.stringify(movieResponse), 'EX', 60 * 60 * 2) // 2 hr only
    return movieResponse
  }

  /**
   * Get Theaters By Movie (closet first @coordinates)
   * @param movieId number
   * @param coordinates [number, number] (default: 100)
   * @param theaterLimit number (default: 100)
   * @returns Promise<Theater[]>
   * @includes Shows (per Theater)
   */
  public async getTheatersByMovieId(
    movieId: number,
    coordinates?: [number, number],
    theaterLimit?: number
  ) {
    if (!movieId) return null
    const key = `movie:theaters:${movieId}`
    const cached = await this.redis.get(key)
    if (cached)
      return JSON.parse(cached).map((theater: Theater) => ({
        ...theater,
        location: JSON.parse(theater.location),
      }))
    let theaters: Theater[] = []

    // if coordinates given
    if (coordinates) {
      const [lat, lng] = coordinates
      theaters = await Theater.query()
        .select('*', Database.st().asGeoJSON('location'))
        .orderByRaw(`location <-> 'SRID=4326;POINT(${lng} ${lat})'::geometry`)
        .whereHas('screenings', (query) => {
          query
            .where('running', true)
            .where('movie_id', movieId)
            .andWhere('is_deleted', false)
            .orderBy('id', 'desc')
            .limit(theaterLimit ?? 50)
        })
        .preload('screenings')
    }

    // normally
    theaters = await Theater.query()
      .whereHas('screenings', (query) => {
        query
          .where('running', true)
          .where('movie_id', movieId)
          .andWhere('is_deleted', false)
          .orderBy('id', 'desc')
          .limit(theaterLimit ?? 50)
      })
      .select('*', Database.st().asGeoJSON('location'))
      .preload('screenings')

    theaters.forEach(async (theater) => {
      theater.location = await JSON.parse(theater.location)
    }) // <--- parsing geo location information

    // save to redis as cached
    await this.redis.set(key, JSON.stringify(theaters), 'EX', 60 * 60 * 2) // 2hrs only

    return theaters
  }

  /**
   * Get List (latest first)
   * @param pageLimit number (default: 10)
   * @param page number (default: 1)
   * @returns Promise<Movie[]> (paginated)
   */
  public async getList({ page = 1, pageLimit = 10 }: { page?: number; pageLimit?: number } = {}) {
    const redisKey = `movies:page:${page}:limit:${pageLimit}`
    const cached = await this.redis.get(redisKey)
    if (cached) return JSON.parse(cached)

    const movies = await this.model.query().orderBy('released_at', 'desc').paginate(page, pageLimit)

    const movieWithInfo: Record<string, any>[] = []
    for (const movie of movies.toJSON().data) {
      const onTheaters = await Screening.query()
        .where('movie_id', movie.id)
        .where('running', true)
        .count('* as shows')
        .groupBy('theater_id')
        .countDistinct('theater_id as total')

      const movieData = await this.getMovieInfo(movie.tmdbId)
      movieWithInfo.push({
        ...movie.toJSON(),
        info: movieData,
        on_theaters: +Number(onTheaters[0]?.$extras?.total) || 0,
        total_shows: +Number(onTheaters[0]?.$extras?.shows) || 0,
      })
    }

    const response = {
      ...movies.toJSON(),
      data: movieWithInfo,
    }

    // save to redis as cached
    await this.redis.set(redisKey, JSON.stringify(response), 'EX', 60 * 60 * 3) // 3hrs

    return response
  }

  /**
   * Update a Movie
   * @param id number
   * @param payload Partial<Movie>
   * @returns Promise<any[]>
   */
  public async update(id: number, payload: Partial<Movie>) {
    return this.model
      .query()
      .where('id', id)
      .update(payload)
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Remove a Movie
   * @param id number
   * @returns Promise<any[]>
   */
  public async delete(id: number) {
    return this.model
      .query()
      .where('id', id)
      .update({ isDeleted: true })
      .then(() => true)
      .catch(() => false)
  }
}
