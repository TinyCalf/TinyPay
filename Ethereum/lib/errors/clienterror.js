class ClientError {

  constructor() {
    let args = Array.prototype.slice.call(arguments)

    switch (args.length) {
    case 0:
      this.code = 'BADREQUEST'
      this.message = 'Bad Request'
      break
    default:
    case 2:
      this.code = args[0]
      this.message = args[1]
      break;
    }
  }


}

ClientError.prototype.toString = () => {
  return `<ClientError: ${this.code} ${this.message}>`
}

module.exports = ClientError