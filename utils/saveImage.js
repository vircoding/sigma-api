import fs from "node:fs";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

export const saveImage = (file, postId) => {
  const imageId = uuidv4();
  const newPath = `./dist/uploads/images/${postId}-${imageId}.jpg`;
  fs.renameSync(file.path, newPath);

  if (process.env.MODE === "development") {
    return `http://localhost:5000/uploads/images/${postId}-${imageId}.jpg`;
  } else if (process.env.MODE === "production") {
    return `https://sigmacuba.com/uploads/images/${postId}-${imageId}.jpg`;
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

export const updateAvatar = (file, uid) => {
  const path = `./dist/uploads/avatars/${uid}-avatar.jpg`;

  if (fs.existsSync(path)) {
    fs.renameSync(path, `./dist/uploads/avatars/${uid}-old-avatar.jpg`);
    fs.renameSync(file.path, path);
  }

  if (process.env.MODE === "development") {
    return `http://localhost:5000/uploads/avatars/${uid}-avatar.jpg`;
  } else if (process.env.MODE === "production") {
    return `https://sigmacuba.com/uploads/avatars/${uid}-avatar.jpg`;
  }
};

export const deleteOldAvatar = (uid) => {
  const path = `./dist/uploads/avatars/${uid}-old-avatar.jpg`;

  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
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

export const removeImage = (filename) => {
  const folder = `./dist/uploads/images`;
  const filePath = path.join(folder, filename);

  if (fs.existsSync(filePath)) {
    fs.renameSync(filePath, `./dist/uploads/images/old-${filename}`);
    return true;
  }

  return false;
};

export const unlinkImage = (filename, isOld) => {
  const folder = `./dist/uploads/images`;
  let filePath;

  if (isOld) {
    filePath = path.join(folder, "old-" + filename);
  } else {
    filePath = path.join(folder, filename);
  }

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
