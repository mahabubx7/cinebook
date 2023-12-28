import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeSave, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { Role } from 'App/Enums'
import Theater from './Theater'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public fname?: string

  @column({ serializeAs: null })
  public lname?: string

  @column({ serializeAs: null })
  public middle?: string

  @column()
  public phone?: string

  @column({ serializeAs: null })
  // @no-swagger
  public rememberMeToken?: string

  @column()
  public isEmailVerified?: boolean

  @column()
  public isActive?: boolean

  @column()
  public isDeleted?: boolean

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

  // preload theaters
  // @no-swagger
  @hasMany(() => Theater, { foreignKey: 'vendorId' })
  public theaters: HasMany<typeof Theater>

  // process full name
  // @no-swagger
  public get getName() {
    if (!this.fname && !this.lname) return 'N/A'
    else if (this.middle) {
      return this.fname + ' ' + this.middle + ' ' + this.lname
    }
    return this.fname + ' ' + this.lname
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
