// server/index.js
const express = require('express');
const cors = require('cors');

// WICHTIG: genau so importieren
const { getSimCardsMock, getVehiclesMock } = require('./telekomClient');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/sim-cards', async (_req, res) => {
  try {
    const sims = await getSimCardsMock();
    res.json(sims);
  } catch (err) {
    console.error('Error in /api/sim-cards:', err);
    res.status(500).json({ error: 'Failed to load SIM cards (mock)' });
  }
});

app.get('/api/vehicles', async (_req, res) => {
  try {
    const vehicles = await getVehiclesMock();
    res.json(vehicles);
  } catch (err) {
    console.error('Error in /api/vehicles:', err);
    res.status(500).json({ error: 'Failed to load vehicle info (mock)' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
