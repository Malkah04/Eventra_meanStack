import multer from "multer";
import path from "path";

// مكان تخزين الصور
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/avatars"); // مجلد تخزين الصور
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user._id}-${Date.now()}${ext}`);
  }
});

// فلتر للصور بس
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const uploadAvatar = multer({ storage, fileFilter });
