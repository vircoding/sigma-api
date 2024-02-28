import fs from "node:fs";

export const saveImage = (file, nameIndex, postId) => {
  const newPath = `./dist/uploads/images/${postId}-image_${nameIndex}.jpg`;
  fs.renameSync(file.path, newPath);

  if (process.env.MODE === "development") {
    return `http://localhost:5000/uploads/images/${postId}-image-${nameIndex}.jpg`;
  } else if (process.env.MODE === "production") {
    return `https://sigmacuba.com/uploads/images/${postId}-image-${nameIndex}.jpg`;
  }
};

export const saveAvatar = (file, uid) => {
  const newPath = `./dist/uploads/avatars/${uid}-avatar.jpg`;
  fs.renameSync(file.path, newPath);

  if (process.env.MODE === "development") {
    return `http://localhost:5000/uploads/avatars/${uid}-avatar.jpg`;
  } else if (process.env.MODE === "production") {
    return `https://sigmacuba.com/uploads/avatars/${uid}-avatar.jpg`;
  }
};

export const getStandardImageUrl = () => {
  if (process.env.MODE === "development") {
    return "http://localhost:5000/standard-image.jpg";
  } else if (process.env.MODE === "production") {
    return "https://sigmacuba.com/standard-image.jpg";
  }
};

export const getStandardAvatarUrl = () => {
  if (process.env.MODE === "development") {
    return "http://localhost:5000/standard-avatar.jpg";
  } else if (process.env.MODE === "production") {
    return "https://sigmacuba.com/standard-avatar.jpg";
  }
};
