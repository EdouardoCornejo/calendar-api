// express.json() reports unparsable bodies as an HTML page with the stack trace.
// Express only treats 4-argument functions as error handlers, so no default params here.
const handleJsonError = (err, req, res, next) => {
  if (err.type !== "entity.parse.failed") {
    return next(err);
  }

  return res.status(400).json({
    status: "Error",
    msg: "Malformed JSON body",
  });
};

module.exports = {
  handleJsonError,
};
