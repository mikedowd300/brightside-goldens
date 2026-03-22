const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const dataFilePath = path.join(__dirname, 'data', 'site-data.json');

app.use(cors());
app.use(express.json());

async function readSiteData() {
  const fileContents = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(fileContents);
}

async function writeSiteData(data) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/site-data', async (_request, response) => {
  try {
    const data = await readSiteData();
    response.json(data);
  } catch (error) {
    response.status(500).json({ message: 'Unable to read site data.' });
  }
});

app.put('/api/site-data', async (request, response) => {
  try {
    await writeSiteData(request.body);
    response.json({ message: 'Site data updated successfully.' });
  } catch (error) {
    response.status(500).json({ message: 'Unable to update site data.' });
  }
});

app.listen(port, () => {
  console.log(`Brightside Goldens API listening on port ${port}`);
});
