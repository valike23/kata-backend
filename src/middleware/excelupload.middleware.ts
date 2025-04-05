// middlewares/upload.middleware.ts
import multer from 'multer';

const storage = multer.memoryStorage();

export const excelUpload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
