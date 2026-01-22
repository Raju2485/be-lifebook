const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dir = `${path.join(process.cwd())}/app/uploads`;
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${(file.originalname).replaceAll(/[^a-z0-9.]/gi, '')}`);
  },
});

export const upload = multer({ storage: fileStorageEngine });

