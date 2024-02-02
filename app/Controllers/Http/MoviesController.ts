import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Movie from 'App/Models/Movie'
import { MovieService } from 'App/Services'
import CreateMovieDto from 'App/Validators/movie/CreateMovieDto'
import UpdateMovieDto from 'App/Validators/movie/UpdateMovieDto'

export default class MoviesController {
  constructor(private readonly service = new MovieService()) {}

  public async index({ response }: HttpContextContract) {
    const movies = await this.service.getList()
    return response.ok(movies)
  }

  public async show({ response, params }: HttpContextContract) {
    const movie = await this.service.getById(params.id)
    if (!movie) {
      return response.notFound({ message: 'Movie not found' })
    }
    return response.ok(movie)
  }

  public async getByUid({ response, params }: HttpContextContract) {
    const movie = await this.service.getByUid(params.uid)
    if (!movie) {
      return response.notFound({ message: 'Movie not found' })
    }
    return response.ok(movie)
  }

  public async store({ request, bouncer, auth, response }: HttpContextContract) {
    const payload = await request.validate(CreateMovieDto)
    await auth.authenticate()
    await bouncer.with('MoviePolicy').authorize('create')
    const movie = await this.service.create(payload)
    return response.created(movie)
  }

  public async update({ request, bouncer, auth, response, params }: HttpContextContract) {
    const payload = await request.validate(UpdateMovieDto)
    await auth.authenticate()
    await bouncer.with('MoviePolicy').authorize('update')
    const updated = await this.service.update(params.id, payload)
    if (!updated) {
      return response.notFound({ message: "Movie couldn't be updated!" })
    }
    return response.accepted({ message: 'Movie updated successfully!' })
  }

  public async destroy({ response, bouncer, auth, params }: HttpContextContract) {
    await auth.authenticate()
    await bouncer.with('MoviePolicy').authorize('delete')
    const deleted = await this.service.delete(params.id)
    if (!deleted) {
      return response.notFound({ message: "Movie couldn't be deleted!" })
    }
    return response.accepted({ message: 'Movie deleted successfully!' })
  }
}
