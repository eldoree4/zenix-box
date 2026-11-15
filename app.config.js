module.exports = ({ config }) => {
  const projectId = process.env.EAS_PROJECT_ID?.trim();
  const androidPackage = process.env.ANDROID_PACKAGE?.trim() || 'com.zenixbox.app';
  const iosBundleIdentifier = process.env.IOS_BUNDLE_IDENTIFIER?.trim() || 'com.zenixbox.app';

  return {
    ...config,
    name: 'Zenix Box',
    slug: 'zenix-box',
    scheme: 'zenixbox',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'dark',
    ios: {
      ...config.ios,
      bundleIdentifier: iosBundleIdentifier,
      buildNumber: process.env.IOS_BUILD_NUMBER || '1',
      supportsTablet: true,
      infoPlist: {
        ...config.ios?.infoPlist,
        NSPhotoLibraryUsageDescription: 'Zenix Box membutuhkan akses ke foto yang kamu pilih untuk menampilkan pratinjau edit.',
      },
    },
    android: {
      ...config.android,
      package: androidPackage,
      versionCode: Number(process.env.ANDROID_VERSION_CODE || 1),
      permissions: [],
      blockedPermissions: [
        'android.permission.READ_MEDIA_IMAGES',
        'android.permission.READ_MEDIA_VIDEO',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.CAMERA',
        'android.permission.RECORD_AUDIO',
      ],
      adaptiveIcon: {
        ...config.android?.adaptiveIcon,
        backgroundColor: '#090B12',
      },
    },
    plugins: [
      ...(config.plugins || []).filter((plugin) => !Array.isArray(plugin) || plugin[0] !== 'expo-image-picker'),
      ['expo-image-picker', {
        photosPermission: 'Izinkan Zenix Box mengakses foto yang kamu pilih untuk diedit.',
        cameraPermission: false,
        microphonePermission: false,
      }],
    ],
    extra: {
      ...config.extra,
      ...(projectId ? { eas: { ...config.extra?.eas, projectId } } : {}),
    },
  };
};
