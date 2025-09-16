// server.js
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const fetch = require('node-fetch'); // npm install node-fetch@2

const app = express();
app.use(cors());
app.use(express.json());

// ===== MongoDB =====
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/crosspromo_assets';
const dbName = mongoUrl.split('/').pop();

let dbClient, db;
async function connectDB() {
  try {
    dbClient = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017');
    await dbClient.connect();
    db = dbClient.db(dbName);
    console.log('✅ Connected to MongoDB:', dbName);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
}
connectDB();

// ===== Helpers =====
function fileSizeMB(bytes) {
  return +(bytes / 1024 / 1024).toFixed(2);
}

// ===== Assets route =====
async function getGroupedAssets(storeCode, platform, appId) {
  const coll = db.collection('appDynamicData');
  const query = {};
  if (storeCode) query['Cluster.StoreCode'] = storeCode;
  if (platform) query['Cluster.Platform'] = platform;
  if (appId) query['Cluster.AppId'] = appId;

  const docs = await coll.find(query).toArray();
  const groups = [];

  for (const d of docs) {
    const loc = d.Cluster?.LocalizationCode || 'unknown';
    const plat = d.Cluster?.Platform || 'unknown';
    const adWaterfall = d.AppDynamicData?.AdWaterfall || {};
    ['Banner', 'Interstitial', 'Rewarded'].forEach((type) => {
      const arr = adWaterfall[type] || [];
      arr.forEach((entry) => {
        const cp = entry.CrosspromoData;
        if (cp && cp.CrosspromoFiles) {
          cp.CrosspromoFiles.forEach((f) => {
            groups.push({
              Localization: loc,
              Platform: plat,
              AdType: type,
              FileName: f.Url.split('/').pop(),
              Url: f.Url,
              FileSizeBytes: f.FileSize || 0,
              FileSizeMB: fileSizeMB(f.FileSize || 0),
              Title: cp.TextData?.Title || '',
              StoreUrl: cp.Url || '',
            });
          });
        }
      });
    });
  }

  return groups;
}

app.get('/api/assets', async (req, res) => {
  try {
    const { storeCode, platform, appId } = req.query;
    const data = await getGroupedAssets(storeCode, platform, appId);
    res.json({ ok: true, data });
  } catch (err) {
    console.error('❌ /api/assets error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ===== File size proxy =====
app.get('/api/file-size', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ ok: false, error: 'Missing url parameter' });

  try {
    let size = null;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 секунд

    // Попытка HEAD
    const headResp = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeout);

    const cl = headResp.headers.get('content-length');
    if (cl) {
      size = parseInt(cl);
    } else {
      // fallback — скачать файл
      const getResp = await fetch(url);
      const buffer = await getResp.arrayBuffer();
      size = buffer.byteLength;
    }

    res.json({ ok: true, size });
  } catch (err) {
    console.error('❌ /api/file-size error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ===== Start server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
