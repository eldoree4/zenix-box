const DEFAULT_MODE = 'mock';

async function processImage({ toolId, intensity = 75, source }) {
  const provider = process.env.AI_PROVIDER || DEFAULT_MODE;
  const isConfigured = Boolean(process.env.AI_PROVIDER && process.env.AI_API_KEY);

  if (!isConfigured) {
    return {
      mode: 'mock',
      provider,
      status: 'queued',
      message: 'Mock processing complete. Set AI_PROVIDER and AI_API_KEY to enable a real provider.',
      artifact: {
        toolId,
        mediaType: 'image',
        intensity,
        source: source || 'gallery',
        outputName: `output-${Date.now()}.jpg`,
      },
    };
  }

  return {
    mode: 'real',
    provider,
    status: 'queued',
    message: `Processing via ${provider} for image tool ${toolId}`,
    artifact: {
      toolId,
      mediaType: 'image',
      intensity,
      source: source || 'gallery',
      outputName: `output-${Date.now()}.jpg`,
    },
  };
}

async function processVideo({ toolId, intensity = 75, source }) {
  const provider = process.env.AI_PROVIDER || DEFAULT_MODE;
  const isConfigured = Boolean(process.env.AI_PROVIDER && process.env.AI_API_KEY);

  if (!isConfigured) {
    return {
      mode: 'mock',
      provider,
      status: 'queued',
      message: 'Mock processing complete. Set AI_PROVIDER and AI_API_KEY to enable a real provider.',
      artifact: {
        toolId,
        mediaType: 'video',
        intensity,
        source: source || 'gallery',
        outputName: `output-${Date.now()}.mp4`,
      },
    };
  }

  return {
    mode: 'real',
    provider,
    status: 'queued',
    message: `Processing via ${provider} for video tool ${toolId}`,
    artifact: {
      toolId,
      mediaType: 'video',
      intensity,
      source: source || 'gallery',
      outputName: `output-${Date.now()}.mp4`,
    },
  };
}

module.exports = {
  processImage,
  processVideo,
};
