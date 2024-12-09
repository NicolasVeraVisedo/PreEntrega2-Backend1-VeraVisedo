import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtiene la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
