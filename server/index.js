const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { processImage, processVideo } = require('./aiService');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const tools = [
  { id: 'ai-4k', name: 'AI 4K', category: 'Restorasi', description: 'Perbesar resolusi melalui model upscale.', premium: false },
  { id: 'ai-retouch', name: 'AI Retouch', category: 'Foto AI', description: 'Retouch wajah dan kulit secara natural.', premium: true },
  { id: 'face-enhancer', name: 'Face Enhancer', category: 'Restorasi', description: 'Memperbaiki pencahayaan dan detail wajah.', premium: false },
  { id: 'ai-removal', name: 'AI Removal', category: 'Foto AI', description: 'Hapus objek yang tidak diinginkan secara instan.', premium: true },
  { id: 'video-stabilizer', name: 'AI Stabilizer', category: 'Video', description: 'Stabilkan video agar hasilnya mulus.', premium: false },
  { id: 'video-collage', name: 'Video Collage', category: 'Video', description: 'Gabungkan beberapa klip menjadi kolase.', premium: true },
];

const plans = [
  { id: 'free', name: 'Free', price: 0, features: ['AI 4K trial', '3 project/day'] },
  { id: 'pro', name: 'Pro', price: 49, features: ['Semua AI tools', 'Export penuh', 'Priority queue'] },
  { id: 'studio', name: 'Studio', price: 99, features: ['Team workspace', 'Batch process', 'Priority support'] },
];

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    app: 'Zenix Box API',
    timestamp: new Date().toISOString(),
    provider: process.env.AI_PROVIDER || 'not-configured',
    aiConfigured: Boolean(process.env.AI_PROVIDER && process.env.AI_API_KEY),
  });
});

app.get('/api/tools', (_req, res) => {
  res.json({ success: true, tools });
});

app.get('/api/plans', (_req, res) => {
  res.json({ success: true, plans });
});

app.post('/api/ai/process', async (req, res) => {
  const { toolId, mediaType = 'image', intensity = 75, source } = req.body || {};

  if (!toolId) {
    return res.status(400).json({ success: false, message: 'toolId wajib diisi.' });
  }

  const tool = tools.find((entry) => entry.id === toolId) || tools[0];

  try {
    const result = mediaType === 'video'
      ? await processVideo({ toolId, intensity, source })
      : await processImage({ toolId, intensity, source });

    return res.json({
      success: true,
      jobId: `zenix-${Date.now()}`,
      status: 'queued',
      tool,
      result,
      provider: process.env.AI_PROVIDER || 'mock-provider',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'AI processing failed',
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Zenix Box API running on http://localhost:${PORT}`);
  console.log('AI provider is not active until AI_PROVIDER, AI_API_KEY, and backend config are added.');
});
