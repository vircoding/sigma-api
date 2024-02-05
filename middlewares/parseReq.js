export const parsePostReq = (req, res, next) => {
  const data = JSON.parse(req.body.data);
  for (const prop in data) {
    if (Object.hasOwnProperty.call(data, prop)) {
      req.body[prop] = data[prop];
    }
  }
  next();
};
