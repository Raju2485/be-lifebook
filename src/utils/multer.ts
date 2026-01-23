import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dir = `${path.join(process.cwd())}/src/uploads`;
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

