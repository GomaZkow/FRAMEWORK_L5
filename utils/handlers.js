module.exports = {
  errorHandler: (error, res) => {
    console.error("Server Error:", error);
    res.status = error.statusCode || 500;
    res.send({
      error: error.message || "server error",
    });
  },
};
