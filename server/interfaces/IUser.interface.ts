import {Schema} from 'mongoose'

export interface IUser {
  email: string;
  password: string;
  avatar: string;
  files: any,
}