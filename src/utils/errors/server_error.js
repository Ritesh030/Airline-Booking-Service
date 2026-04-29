const { StatusCodes } = require('http-status-codes')

class serverError extends Error {
      constructor(message = "Something went wrong", explanation = "Service layer error", statuscode = StatusCodes.INTERNAL_SERVER_ERROR) {
            super()
            this.message = message
            this.explanation = explanation
            this.statuscode = statuscode
      }
}

module.exports = serverError