const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

const tools = [
  {
    id: 'ai-4k',
    name: 'AI 4K',
    category: 'Restorasi',
    description: 'Tingkatkan resolusi dan restore detail foto.',
    isPremium: false,
  },
  {
    id: 'ai-retouch',
    name: 'AI Retouch',
    category: 'Foto AI',
    description: 'Retouch kulit dan wajah secara natural.',
    isPremium: true,
  },
  {
    id: 'face-enhancer',
    name: 'Face Enhancer',
    category: 'Restorasi',
    description: 'Pulihkan detail dan pencahayaan wajah.',
    isPremium: false,
  },
  {
    id: 'video-stabilizer',
    name: 'AI Stabilizer',
    category: 'Video',
    description: 'Stabilkan video agar lebih halus.',
    isPremium: true,
  },
  {
    id: 'video-collage',
    name: 'Video Collage',
    category: 'Video',
    description: 'Gabungkan klip menjadi kolase.',
    isPremium: true,
  },
];

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Zenix Box API',
    timestamp: new Date().toISOString(),
    env: {
      port: PORT,
      aiProvider: process.env.AI_PROVIDER || 'not-configured',
      apiKeyConfigured: !!process.env.AI_API_KEY,
    },
  });
});

app.get('/api/tools', (_req, res) => {
  res.json({
    success: true,
    tools,
  });
});

app.post('/api/ai/process', (req, res) => {
  const { toolId, mediaType, intensity = 75 } = req.body || {};

  if (!toolId) {
    return res.status(400).json({
      success: false,
      message: 'toolId wajib diisi',
    });
  }

  const selectedTool = tools.find((tool) => tool.id === toolId) || tools[0];

  return res.json({
    success: true,
    jobId: `zenix-${Date.now()}`,
    status: 'queued',
    mediaType: mediaType || 'image',
    intensity,
    tool: selectedTool,
    message: 'Mock AI processing queued. Koneksi ke provider AI nyata belum dikonfigurasi.',
    provider: process.env.AI_PROVIDER || 'not-configured',
    estimate: '3-8 detik',
  });
});

app.listen(PORT, () => {
  console.log(`Zenix Box API running on http://localhost:${PORT}`);
  console.log('Isi AI_PROVIDER / AI_API_KEY / backend keys di env untuk mengaktifkan provider AI asli.');
});
