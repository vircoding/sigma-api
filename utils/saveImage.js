import fs from "node:fs";

export const saveImage = (file, nameIndex, postId) => {
  const newPath = `./uploads/${postId}/image_${nameIndex}.jpg`;
  fs.renameSync(file.path, newPath);
  return `https://sigma-api-ehki.onrender.com/uploads/${postId}/image_${nameIndex}.jpg`;
};
