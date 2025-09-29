import express from 'express';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(compression());

// Sirve estáticos desde el directorio 'dist'
app.use(express.static(join(__dirname, 'dist')));

// Fallback para SPA (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`El servidor de Superiores-The-Game está corriendo en http://localhost:${port}`);
});
