const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
app.use(compression());

// Sirve estáticos desde la raíz (index.html, /css, /js)
app.use(express.static(path.join(__dirname)));

// Fallback por si usas rutas del lado del cliente
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Superiores-The-Game on :${port}`));
