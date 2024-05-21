import mongoose from 'mongoose'
import { eHandler } from "../utils/eHandler";

const config = useRuntimeConfig();
const app = mongoose;

const uri: string = config.privateRuntimeConfig.mongodb_url || "";

export const connMongo = async () => {
  app.connect(uri).then(() => {
    console.log("\x1b[33mSuccessfully connected! \n \x1b[0m");
  }).catch((e) => {
    eHandler(e);
  })
};

export default connMongo;