import multer, { diskStorage } from 'multer';
import { extname } from 'path';

// Configuración del almacenamiento
const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars'); // Carpeta donde se guardan los archivos
  },
  filename: function (req, file, cb) {
    const ext = extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

export default upload;
