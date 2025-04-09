const { EventEmitter } = require("events");

class ErrorHandler extends EventEmitter {
  constructor() {
    super();
    this.on("error", this.handleError);
  }

  handleError(error, res) {
    console.error("Server Error:", error);
    res.statusCode = error.statusCode || 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: error.message || "Server error" }));
  }
}

module.exports = new ErrorHandler();
