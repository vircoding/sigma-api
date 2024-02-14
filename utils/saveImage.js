import fs from "node:fs";

export const saveImage = (file, nameIndex, postId) => {
  const newPath = `./uploads/images/${postId}-image_${nameIndex}.jpg`;
  fs.renameSync(file.path, newPath);
  return `https://sigma-api-ehki.onrender.com/uploads/images/${postId}-image_${nameIndex}.jpg`;
};

export const saveAvatar = (file, uid) => {
  const newPath = `./uploads/avatars/${uid}-avatar.jpg`;
  fs.renameSync(file.path, newPath);
  return `https://sigma-api-ehki.onrender.com/uploads/avatars/${uid}-avatar.jpg`;
};
