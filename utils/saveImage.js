import fs from "node:fs";

export const saveImage = (file) => {
  const newPath = `./uploads/${file.originalname}`;
  fs.renameSync(file.path, newPath);
};
