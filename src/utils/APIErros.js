class ApiErrors extends Error {
    // constructor is used to create a new instance of the class instence = variable
    constructor(
        statusCode,
        message = 'Something went wrong',
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack) {
            this.stack = stack
        }else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiErrors}
