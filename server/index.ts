import {Nitro} from 'nitropack'
import { connMongo } from './db/mongo.conn'

export default async (_nitroApp: Nitro) => {
    try {
       await connMongo();
    } catch(e) {
        console.log(e)
    }
}