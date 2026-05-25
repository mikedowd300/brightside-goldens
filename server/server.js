require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || ''
};
const bundledSeedDataFilePath = path.join(__dirname, 'data', 'site-data.json');
const dataFilePath = process.env.DATA_FILE_PATH
  ? path.resolve(process.env.DATA_FILE_PATH)
  : bundledSeedDataFilePath;
const dataDirectoryPath = path.dirname(dataFilePath);
const browserBuildPath = path.join(
  __dirname,
  '..',
  'dist',
  'brightside-goldens',
  'browser'
);
const defaultCloudinaryPrefix = '';
const defaultCloudinaryMaxResults = 500;
const maxCloudinaryMaxResults = 500;
const mockCloudinaryAssets = [
  {
    name: 'Golden Puppy Basket',
    url: 'https://res.cloudinary.com/demo/image/upload/v1/brightside-goldens/puppy-yawn.jpg',
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_320,h_220/v1/brightside-goldens/puppy-yawn.jpg',
    public_id: 'brightside-goldens/puppy-yawn',
    width: 320,
    height: 220,
    format: 'jpg',
    bytes: 182341,
    created_at: '2026-01-14T19:22:31Z',
    tags: ['mock', 'puppies'],
    context: {}
  },
  {
    name: 'Playful Puppies',
    url: 'https://res.cloudinary.com/demo/image/upload/v1/brightside-goldens/puppy-play.jpg',
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_320,h_220/v1/brightside-goldens/puppy-play.jpg',
    public_id: 'brightside-goldens/puppy-play',
    width: 320,
    height: 220,
    format: 'jpg',
    bytes: 176204,
    created_at: '2026-01-15T18:11:09Z',
    tags: ['mock', 'puppies'],
    context: {}
  },
  {
    name: 'Puppy Snuggle',
    url: 'https://res.cloudinary.com/demo/image/upload/v1/brightside-goldens/puppy-snuggle.jpg',
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_320,h_220/v1/brightside-goldens/puppy-snuggle.jpg',
    public_id: 'brightside-goldens/puppy-snuggle',
    width: 320,
    height: 220,
    format: 'jpg',
    bytes: 190612,
    created_at: '2026-01-16T21:45:42Z',
    tags: ['mock', 'puppies'],
    context: {}
  },
  {
    name: 'Theo Portrait',
    url: 'https://res.cloudinary.com/demo/image/upload/v1/brightside-goldens/theo.jpg',
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_320,h_220/v1/brightside-goldens/theo.jpg',
    public_id: 'brightside-goldens/theo',
    width: 320,
    height: 220,
    format: 'jpg',
    bytes: 201887,
    created_at: '2026-01-18T16:08:20Z',
    tags: ['mock', 'dogs'],
    context: {}
  },
  {
    name: 'Ivy Portrait',
    url: 'https://res.cloudinary.com/demo/image/upload/v1/brightside-goldens/ivy.jpg',
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_320,h_220/v1/brightside-goldens/ivy.jpg',
    public_id: 'brightside-goldens/ivy',
    width: 320,
    height: 220,
    format: 'jpg',
    bytes: 198450,
    created_at: '2026-01-20T14:54:07Z',
    tags: ['mock', 'dogs'],
    context: {}
  },
  {
    name: 'June Portrait',
    url: 'https://res.cloudinary.com/demo/image/upload/v1/brightside-goldens/june.jpg',
    thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/c_fill,w_320,h_220/v1/brightside-goldens/june.jpg',
    public_id: 'brightside-goldens/june',
    width: 320,
    height: 220,
    format: 'jpg',
    bytes: 193101,
    created_at: '2026-01-21T12:17:54Z',
    tags: ['mock', 'dogs'],
    context: {}
  }
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    }
  })
);
app.use(express.json());

async function ensureSiteDataFile() {
  await fs.mkdir(dataDirectoryPath, { recursive: true });

  try {
    await fs.access(dataFilePath);
  } catch {
    const seedContents = await fs.readFile(bundledSeedDataFilePath, 'utf-8');
    await fs.writeFile(dataFilePath, seedContents);
  }
}

async function readSiteData() {
  await ensureSiteDataFile();
  const fileContents = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(fileContents);
}

async function writeSiteData(data) {
  await ensureSiteDataFile();
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

function parseCloudinaryMaxResults(value) {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    return defaultCloudinaryMaxResults;
  }

  return Math.min(parsedValue, maxCloudinaryMaxResults);
}

async function readCloudinaryAssets(
  prefix = defaultCloudinaryPrefix,
  maxResults = defaultCloudinaryMaxResults
) {
  if (!cloudinaryConfig.cloudName || !cloudinaryConfig.apiKey || !cloudinaryConfig.apiSecret) {
    return {
      source: 'fallback',
      cloudinaryConfigured: false,
      assets: mockCloudinaryAssets
    };
  }

  const authToken = Buffer.from(
    `${cloudinaryConfig.apiKey}:${cloudinaryConfig.apiSecret}`
  ).toString('base64');
  const params = new URLSearchParams({
    max_results: String(parseCloudinaryMaxResults(String(maxResults)))
  });

  if (prefix.trim()) {
    params.set('prefix', prefix.trim());
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/resources/image/upload?${params.toString()}`;

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Basic ${authToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Cloudinary request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const assets = (payload.resources ?? []).map((resource) => ({
    name: resource.display_name || resource.public_id,
    url: resource.secure_url,
    thumbnailUrl: resource.secure_url,
    public_id: resource.public_id,
    width: resource.width,
    height: resource.height,
    format: resource.format,
    bytes: resource.bytes,
    created_at: resource.created_at,
    tags: resource.tags ?? [],
    context: resource.context ?? {}
  }));

  return {
    source: 'live',
    cloudinaryConfigured: true,
    assets
  };
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

app.get('/api/cloudinary/assets', async (request, response) => {
  try {
    const prefix = typeof request.query.prefix === 'string' ? request.query.prefix : defaultCloudinaryPrefix;
    const maxResults = typeof request.query.maxResults === 'string'
      ? request.query.maxResults
      : String(defaultCloudinaryMaxResults);
    const result = await readCloudinaryAssets(prefix, maxResults);
    response.json(result);
  } catch (error) {
    response.json({
      source: 'fallback',
      cloudinaryConfigured: true,
      message: 'Unable to load Cloudinary assets.',
      assets: mockCloudinaryAssets
    });
  }
});

app.use(express.static(browserBuildPath));

app.get('{*any}', async (_request, response, next) => {
  try {
    await fs.access(path.join(browserBuildPath, 'index.html'));
    response.sendFile(path.join(browserBuildPath, 'index.html'));
  } catch (error) {
    next();
  }
});

ensureSiteDataFile()
  .then(() => {
    app.listen(port, () => {
      console.log(`Brightside Goldens API listening on port ${port}`);
      console.log(`Site data file: ${dataFilePath}`);
    });
  })
  .catch((error) => {
    console.error('Unable to initialize site data file.', error);
    process.exit(1);
  });
