import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { Role } from 'App/Enums'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  // @no-swagger
  public rememberMeToken?: string

  @column()
  public isEmailVerified?: boolean

  @column()
  // @enum(user, vendor, manager, admin, super_admin)
  public role: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // hash password before saving
  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  // check if user is USER | Customer
  // @no-swagger
  public get isCustomer() {
    return this.role === Role.USER
  }

  // check if user is ADMIN
  // @no-swagger
  public get isAdmin() {
    return this.role === Role.ADMIN
  }

  // check if user is VENDOR
  // @no-swagger
  public get isVendor() {
    return this.role === Role.VENDOR
  }

  // check if user is Manager
  // @no-swagger
  public get isManager() {
    return this.role === Role.MANAGER
  }

  // check if user is SUPER . ADMIN
  // @no-swagger
  public get isSuperAdmin() {
    return this.role === Role.SUPER_ADMIN
  }
}
