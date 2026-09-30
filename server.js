const express = require('express');
const productsRoutes = require('./routes/productsRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/products', productsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Every request gets a response: unexpected errors become JSON 500s,
// so requests never hang.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

module.exports = app;
