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
  public async getMovieInfo(tmdbId: number, movie: Movie | number) {
    if (typeof movie === 'number') {
      const m = await this.model.find(movie)
      if (!m) return null
      movie = m
    }
    if (!tmdbId) return null
    const key = `movie:${movie.uid}`
    const cached = await this.redis.get(key)
    if (cached) {
      return {
        ...movie.toJSON(),
        info: JSON.parse(cached),
      }
    }
    const movieInfo = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
      headers: {
        Authorization: `Bearer ${Env.get('TMDB_API_KEY')}`,
        ContentType: 'application/json;charset=utf-8',
      },
    })
      .then((res) => res.json())
      .catch(() => null)

    if (!movieInfo) return { ...movie.toJSON(), info: null }
    await this.redis.set(key, JSON.stringify(movieInfo), 'EX', 60 * 60 * 24)
    return {
      ...movie.toJSON(),
      info: movieInfo,
    }
  }

  /**
   * Get one by id
   * @param id number
   * @returns Promise<Movie | null>
   * @includes MovieInfo (from TheMovieDB)
   */
  public async getById(id: number) {
    const movie = await this.model.query().where('id', id).preload('screens').first()
    if (!movie) return null
    const movieData = await this.getMovieInfo(movie.tmdbId, movie)
    return movieData
  }

  /**
   * Get one by id (UID)
   * @param uid string
   * @returns Promise<Movie | null>
   * @includes MovieInfo (from TheMovieDB)
   */
  public async getByUid(uid: string) {
    const movie = await this.model.query().where('uid', uid).preload('screens').first()
    if (!movie) return null
    const key = `movie:${movie.uid}`
    const cached = await this.redis.get(key)
    if (cached)
      return {
        ...movie.toJSON(),
        info: JSON.parse(cached),
      }
    const movieInfo = await fetch(`https://api.themoviedb.org/3/movie/${movie.tmdbId}`, {
      headers: {
        Authorization: `Bearer ${Env.get('TMDB_API_KEY')}`,
        ContentType: 'application/json;charset=utf-8',
      },
    })
      .then((res) => res.json())
      .catch(() => null)
    if (!movieInfo) return { ...movie.toJSON(), info: null }
    await this.redis.set(key, JSON.stringify(movieInfo), 'EX', 60 * 60 * 24)
    return {
      ...movie.toJSON(),
      info: movieInfo,
    }
  }

  /**
   * Get List (latest first)
   * @param pageLimit number (default: 10)
   * @param page number (default: 1)
   * @returns Promise<Movie[]> (paginated)
   */
  public async getList({ page = 1, pageLimit = 10 }: { page?: number; pageLimit?: number } = {}) {
    return this.model.query().preload('screens').paginate(page, pageLimit)
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
