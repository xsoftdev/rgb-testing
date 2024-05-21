interface ServerError {
  message: string
}

export const eHandler = (error: ServerError): void => {
  console.log("\x1b[33mServer error:\x1b[0m " + error.message);}