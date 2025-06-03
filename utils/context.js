<<<<<<< Updated upstream
const createContext = (req, res) => {
  return {
    req,
    res,

    params: () => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const params = {};
      url.pathname.replace(/\/:([^/]+)/g, (match, key) => {
        params[key] = decodeURIComponent(
          url.pathname.replace(new RegExp(`/${match}`), "")
        );
      });
      return params;
    },

    query: () => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const query = {};
      url.searchParams.forEach((value, key) => {
        query[key] = value;
      });
      return query;
    },

    send(data) {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
    },
    json(data, statusCode = 200) {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = statusCode;
      res.end(JSON.stringify(data));
    },
    status(code) {
      res.statusCode = code;
      return this;
    },
  };
};

module.exports = createContext;
=======
module.exports = (req, res) => {
  const params = {};
  const urlParts = req && req.url ? req.url.split("/").filter(Boolean) : [];
  if (urlParts.length > 1 && !isNaN(urlParts[urlParts.length - 1])) {
    params.id = Number(urlParts[urlParts.length - 1]);
  }
  return {
    req,
    res,
    params,
    query: () => {
      const url = req && req.url ? new URL(req.url, `http://${req.headers.host}`) : null;
      const query = {};
      if (url) {
        url.searchParams.forEach((value, key) => {
          query[key] = value;
        });
      }
      return query;
    },
    json(data, statusCode = 200) {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = statusCode;
      res.end(JSON.stringify(data));
    }
  };
};
>>>>>>> Stashed changes
