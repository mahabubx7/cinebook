/*
|-----------------------------------------------------------
| @Purpose : Role enum for user roles
| @Use     : Access control with @adonisjs/bouncer
| @Features:
|    - Role: Roles as enum
|    - RoleType: Role type string options
|-----------------------------------------------------------
*/

export enum Role {
  USER = 'user',
  VENDOR = 'vendor', // VENDOR
  MANAGER = 'manager', // (platform) Manager
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin', // above all
}
