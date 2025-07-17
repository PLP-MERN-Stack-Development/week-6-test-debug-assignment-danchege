console.log('Server starting...');

const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  console.log('Request received');
  res.json({ message: 'Hello from Express!' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
