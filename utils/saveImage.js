import fs from "node:fs";

export const saveImage = (file, nameIndex, postId) => {
  const newPath = `./dist/uploads/images/${postId}-image_${nameIndex}.jpg`;
  fs.renameSync(file.path, newPath);
  return process.env.MODE === "developer"
    ? `http://localhost:5000/uploads/images/${postId}-image-${nameIndex}.jpg`
    : `https://sigmacuba.com/uploads/images/${postId}-image-${nameIndex}.jpg`;
};

export const saveAvatar = (file, uid) => {
  const newPath = `./dist/uploads/avatars/${uid}-avatar.jpg`;
  fs.renameSync(file.path, newPath);
  return process.env.MODE === "developer"
    ? `http://localhost:5000/uploads/avatars/${uid}-avatar.jpg`
    : `https://sigmacuba.com/uploads/avatars/${uid}-avatar.jpg`;
};
