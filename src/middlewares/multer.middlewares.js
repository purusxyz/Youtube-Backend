import multer from "multer";
import fs from "fs";
import path from "path";

// ✅ absolute correct path (NO mistakes possible)
const uploadPath = path.resolve("public/temp");

// ✅ ensure folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("UPLOAD DEST:", uploadPath); // 🔥 debug
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

export const upload = multer({ storage });