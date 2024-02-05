export const parsePostReq = (req, res, next) => {
  const data = JSON.parse(req.body.data);
  for (const prop in data) {
    if (Object.hasOwnProperty.call(data, prop)) {
      req.body[prop] = data[prop];
    }
  }
  console.log(req.body);
  console.log(req.body.type);
  next();
};
