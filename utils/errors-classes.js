class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class Conflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
module.exports = {
  BadRequestError,
  Conflict,
  Forbidden,
  NotFound,
  UnauthorizedError,
};
