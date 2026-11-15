import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

type ToolCategory = 'Foto AI' | 'Restorasi' | 'Video';
type Tab = 'Beranda' | 'Jelajahi' | 'Proyek' | 'Saya';
type Tool = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: ToolCategory;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  pro?: boolean;
};
type Project = {
  id: string;
  name: string;
  uri: string;
  isVideo: boolean;
  date: string;
};

const COLORS = {
  background: '#090B12',
  surface: '#131621',
  surfaceRaised: '#191C28',
  border: '#262A38',
  text: '#F6F4FC',
  muted: '#9295A5',
  purple: '#A78BFA',
  purpleDark: '#7159DC',
  gold: '#FFD279',
};

const tools: Tool[] = [
  { id: 'ai-4k', name: 'AI 4K', subtitle: 'Tingkatkan resolusi', description: 'Tingkatkan resolusi gambar dan pulihkan detail yang kurang tajam.', category: 'Restorasi', icon: 'scan-outline', color: '#A78BFA' },
  { id: 'ai-retouch', name: 'AI Retouch', subtitle: 'Kulit tampak halus', description: 'Retouch potret dan kulit dengan tampilan yang tetap natural.', category: 'Foto AI', icon: 'sparkles-outline', color: '#FF8DA1', pro: true },
  { id: 'face-enhancer', name: 'Face Enhancer', subtitle: 'Pulihkan detail wajah', description: 'Tingkatkan cahaya dan detail pada potret.', category: 'Restorasi', icon: 'happy-outline', color: '#65D6C1' },
  { id: 'ai-removal', name: 'AI Removal', subtitle: 'Hapus objek', description: 'Hapus objek yang tidak diinginkan dari foto.', category: 'Foto AI', icon: 'cut-outline', color: '#FFC36E', pro: true },
  { id: 'color-enhancer', name: 'Color Enhancer', subtitle: 'Warna lebih hidup', description: 'Buat warna foto lebih cerah dan seimbang.', category: 'Foto AI', icon: 'color-palette-outline', color: '#FF8DA1' },
  { id: 'image-extender', name: 'AI Image Extender', subtitle: 'Perluas gambar', description: 'Perluas komposisi gambar untuk berbagai format.', category: 'Foto AI', icon: 'expand-outline', color: '#68B8FF', pro: true },
  { id: 'ai-styles', name: 'AI Styles', subtitle: 'Anime, cosplay, avatar', description: 'Jelajahi gaya anime, kartun, cosplay, dan avatar.', category: 'Foto AI', icon: 'brush-outline', color: '#B69AFF', pro: true },
  { id: 'ai-live', name: 'AI Live', subtitle: 'Hidupkan foto', description: 'Buat gerakan dari gambar diam.', category: 'Foto AI', icon: 'play-circle-outline', color: '#5DDBCF', pro: true },
  { id: 'video-collage', name: 'Video Collage', subtitle: 'Kolase video kreatif', description: 'Susun beberapa klip dalam layout kolase.', category: 'Video', icon: 'grid-outline', color: '#FFC36E', pro: true },
  { id: 'ai-stabilizer', name: 'AI Stabilizer', subtitle: 'Video lebih stabil', description: 'Buat video yang goyang terlihat lebih mulus.', category: 'Video', icon: 'videocam-outline', color: '#68B8FF' },
  { id: 'video-makeup', name: 'Video Makeup', subtitle: 'Makeup natural', description: 'Pratinjau retouch wajah dan makeup di video.', category: 'Video', icon: 'color-wand-outline', color: '#FF8DA1', pro: true },
  { id: 'video-editor', name: 'Video Editor', subtitle: 'Filter & color grading', description: 'Atur filter, crop, mirror, dan tampilan warna.', category: 'Video', icon: 'film-outline', color: '#A78BFA' },
];

const filters = ['Semua', 'Foto AI', 'Restorasi', 'Video'] as const;
const navigation: { name: Tab; icon: keyof typeof Ionicons.glyphMap }[] = [
  { name: 'Beranda', icon: 'home-outline' },
  { name: 'Jelajahi', icon: 'compass-outline' },
  { name: 'Proyek', icon: 'albums-outline' },
  { name: 'Saya', icon: 'person-outline' },
];

const onboardingPages = [
  { icon: 'sparkles-outline' as const, label: 'EDIT DENGAN AI', title: 'Foto terbaikmu,\nlebih mudah dibuat.', body: 'Retouch potret, pulihkan foto, dan jelajahi gaya baru dalam satu studio kreatif.' },
  { icon: 'scan-outline' as const, label: 'PULIHKAN DETAIL', title: 'Bawa kembali\nkejernihan gambar.', body: 'Temukan tools untuk meningkatkan detail, warna, dan tampilan foto maupun video.' },
  { icon: 'color-wand-outline' as const, label: 'MULAI BERKREASI', title: 'Ciptakan visual\ndengan gayamu.', body: 'Pilih media dari galeri dan jelajahi pengalaman editor Zenix Box.' },
];

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.brandRow}>
      <LinearGradient colors={['#A987FF', '#6753E8']} style={[styles.brandMark, compact && styles.brandMarkSmall]}>
        <Ionicons name="sparkles" size={compact ? 16 : 19} color="#fff" />
      </LinearGradient>
      <Text style={[styles.brandName, compact && styles.brandNameSmall]}>zenix<Text style={styles.brandAccent}>box</Text></Text>
    </View>
  );
}

function ToolCard({ tool, onPress }: { tool: Tool; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.toolCard, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={`${tool.name}: ${tool.subtitle}`}>
      <View style={[styles.toolIcon, { backgroundColor: `${tool.color}20` }]}><Ionicons name={tool.icon} size={22} color={tool.color} /></View>
      {tool.pro && <View style={styles.proBadge}><Text style={styles.proBadgeText}>PRO</Text></View>}
      <Text style={styles.toolName} numberOfLines={1}>{tool.name}</Text>
      <Text style={styles.toolSubtitle} numberOfLines={1}>{tool.subtitle}</Text>
      <View style={styles.cardArrow}><Ionicons name="arrow-up" size={12} color="#A1A3B1" /></View>
    </Pressable>
  );
}

export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('Beranda');
  const [activeFilter, setActiveFilter] = useState<string>('Semua');
  const [search, setSearch] = useState('');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaIsVideo, setMediaIsVideo] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [intensity, setIntensity] = useState(72);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const filteredTools = useMemo(() => tools.filter((tool) => {
    const matchesCategory = activeFilter === 'Semua' || tool.category === activeFilter;
    const searchable = `${tool.name} ${tool.subtitle} ${tool.description}`.toLowerCase();
    return matchesCategory && searchable.includes(search.trim().toLowerCase());
  }), [activeFilter, search]);

  async function chooseMedia(tool?: Tool) {
    const wantsVideo = tool?.category === 'Video';
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Izin galeri diperlukan', 'Izinkan akses foto dan video yang kamu pilih untuk membuka media di studio.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: wantsVideo ? ['videos'] : ['images'],
        allowsEditing: false,
        quality: 1,
      });
      if (result.canceled || !result.assets[0]) return;
      setMediaUri(result.assets[0].uri);
      setMediaIsVideo(wantsVideo);
      setSelectedTool(tool ?? (wantsVideo ? tools.find((item) => item.category === 'Video')! : tools[0]));
      setIsPreviewReady(false);
      setIntensity(72);
    } catch {
      Alert.alert('Tidak dapat membuka galeri', 'Coba lagi atau pilih media lain.');
    }
  }

  function selectTool(tool: Tool) {
    if (tool.pro) {
      setPaywallVisible(true);
      return;
    }
    if (mediaUri) {
      setSelectedTool(tool);
      setMediaIsVideo(tool.category === 'Video');
      setIsPreviewReady(false);
      return;
    }
    void chooseMedia(tool);
  }

  function makeDemoPreview() {
    if (!mediaUri || !selectedTool || isProcessing) return;
    setIsProcessing(true);
    setTimeout(() => {
      const project: Project = {
        id: `${Date.now()}`,
        name: selectedTool.name,
        uri: mediaUri,
        isVideo: mediaIsVideo,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      };
      setProjects((current) => [project, ...current]);
      setIsPreviewReady(true);
      setIsProcessing(false);
    }, 850);
  }

  function openProject(project: Project) {
    const tool = tools.find((item) => item.name === project.name) ?? tools[0];
    setMediaUri(project.uri);
    setMediaIsVideo(project.isVideo);
    setSelectedTool(tool);
    setIsPreviewReady(true);
  }

  function dismissEditor() {
    setSelectedTool(null);
    setIsProcessing(false);
  }

  function renderHeader() {
    return (
      <View style={styles.header}>
        <Pressable onPress={() => setActiveTab('Beranda')} accessibilityRole="button" accessibilityLabel="Ke beranda"><Brand /></Pressable>
        <Pressable style={styles.headerPro} onPress={() => setPaywallVisible(true)} accessibilityRole="button">
          <Ionicons name="diamond" size={14} color={COLORS.gold} /><Text style={styles.headerProText}>ZENIX PRO</Text>
        </Pressable>
      </View>
    );
  }

  function renderHome() {
    return (
      <>
        <LinearGradient colors={['#29234A', '#1A1B2A', '#141620']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroGlow} />
          <View style={styles.heroContent}>
            <View style={styles.eyebrow}><View style={styles.liveDot} /><Text style={styles.eyebrowText}>YOUR AI CREATIVE STUDIO</Text></View>
            <Text style={styles.heroTitle}>Jadikan{ '\n' }momenmu <Text style={styles.heroHighlight}>luar biasa.</Text></Text>
            <Text style={styles.heroBody}>Retouch, pulihkan, dan ciptakan visual baru dengan mudah.</Text>
            <Pressable style={styles.primaryButton} onPress={() => void chooseMedia()}>
              <Ionicons name="add" size={18} color="#fff" /><Text style={styles.primaryButtonText}>Mulai mengedit</Text><Ionicons name="arrow-forward" size={14} color="#fff" />
            </Pressable>
          </View>
          <View style={styles.heroArt}>
            <LinearGradient colors={['#E6B0FF', '#8A75FF', '#514CC0']} style={styles.artOrb}><Ionicons name="person" size={66} color="#FFF1FF" /></LinearGradient>
            <View style={styles.artSparkle}><Ionicons name="sparkles" size={16} color={COLORS.gold} /></View>
            <View style={styles.artPill}><Text style={styles.artPillText}>AI MAGIC</Text></View>
          </View>
        </LinearGradient>

        <View style={styles.quickActions}>
          <Pressable style={styles.quickAction} onPress={() => void chooseMedia()}><View style={[styles.quickIcon, { backgroundColor: '#302749' }]}><Ionicons name="image-outline" size={19} color="#C5ACFF" /></View><Text style={styles.quickLabel}>Edit foto</Text></Pressable>
          <Pressable style={styles.quickAction} onPress={() => void chooseMedia(tools.find((item) => item.category === 'Video'))}><View style={[styles.quickIcon, { backgroundColor: '#20343A' }]}><Ionicons name="videocam-outline" size={19} color="#75D8CF" /></View><Text style={styles.quickLabel}>Edit video</Text></Pressable>
          <Pressable style={styles.quickAction} onPress={() => { setActiveTab('Jelajahi'); setActiveFilter('Restorasi'); }}><View style={[styles.quickIcon, { backgroundColor: '#3A3022' }]}><Ionicons name="sparkles-outline" size={19} color="#FFD279" /></View><Text style={styles.quickLabel}>Restorasi</Text></Pressable>
        </View>

        <View style={styles.sectionHeading}>
          <View><Text style={styles.sectionTitle}>Tools populer</Text><Text style={styles.sectionCaption}>Pilih cara baru untuk berkreasi</Text></View>
          <Pressable onPress={() => setActiveTab('Jelajahi')}><Text style={styles.seeAll}>Jelajahi</Text></Pressable>
        </View>
        <View style={styles.toolGrid}>{tools.slice(0, 4).map((tool) => <ToolCard key={tool.id} tool={tool} onPress={() => selectTool(tool)} />)}</View>

        <Pressable style={styles.proBanner} onPress={() => setPaywallVisible(true)}>
          <LinearGradient colors={['#3A2D58', '#221D35']} style={styles.proBannerGradient}>
            <View style={styles.proBannerIcon}><Ionicons name="diamond" size={20} color={COLORS.gold} /></View>
            <View style={styles.proBannerCopy}><Text style={styles.proBannerTitle}>Buka kreativitas tanpa batas</Text><Text style={styles.proBannerCaption}>Temukan semua fitur Zenix Pro</Text></View>
            <Ionicons name="chevron-forward" size={18} color="#C2B2DF" />
          </LinearGradient>
        </Pressable>
      </>
    );
  }

  function renderExplore() {
    return (
      <>
        <View style={styles.pageTitleBlock}><Text style={styles.pageTitle}>Jelajahi tools</Text><Text style={styles.sectionCaption}>Pilih fitur untuk foto atau video</Text></View>
        <View style={styles.searchBox}><Ionicons name="search-outline" size={18} color="#8D91A3" /><TextInput value={search} onChangeText={setSearch} placeholder="Cari fitur AI..." placeholderTextColor="#737789" style={styles.searchInput} returnKeyType="search" /></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>{filters.map((filter) => <Pressable key={filter} onPress={() => setActiveFilter(filter)} style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}><Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text></Pressable>)}</ScrollView>
        {filteredTools.length > 0 ? <View style={styles.toolGrid}>{filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} onPress={() => selectTool(tool)} />)}</View> : <View style={styles.emptyState}><Ionicons name="search-outline" size={28} color={COLORS.purple} /><Text style={styles.emptyTitle}>Fitur tidak ditemukan</Text><Text style={styles.emptyBody}>Coba kata kunci atau kategori yang berbeda.</Text></View>}
      </>
    );
  }

  function renderProjects() {
    return (
      <>
        <View style={styles.pageTitleBlock}><Text style={styles.pageTitle}>Proyek saya</Text><Text style={styles.sectionCaption}>Pratinjau yang dibuat selama sesi ini</Text></View>
        {projects.length === 0 ? (
          <View style={styles.emptyState}><View style={styles.emptyIcon}><Ionicons name="images-outline" size={28} color={COLORS.purple} /></View><Text style={styles.emptyTitle}>Belum ada proyek</Text><Text style={styles.emptyBody}>Pilih foto atau video lalu buat pratinjau demo untuk melihatnya di sini.</Text><Pressable style={styles.primaryButton} onPress={() => void chooseMedia()}><Ionicons name="add" size={18} color="#fff" /><Text style={styles.primaryButtonText}>Pilih media</Text></Pressable></View>
        ) : <View style={styles.projectGrid}>{projects.map((project) => <Pressable key={project.id} style={styles.projectCard} onPress={() => openProject(project)}>{project.isVideo ? <View style={styles.projectVideo}><Ionicons name="play-circle" size={38} color="#fff" /></View> : <Image source={{ uri: project.uri }} style={styles.projectImage} />}<Text style={styles.projectName}>{project.name}</Text><Text style={styles.projectDate}>{project.date} · Demo</Text></Pressable>)}</View>}
        <Text style={styles.projectNote}>Proyek demo hanya tersimpan selama aplikasi terbuka. Belum ada hasil edit yang diekspor.</Text>
      </>
    );
  }

  function renderProfile() {
    return (
      <>
        <View style={styles.pageTitleBlock}><Text style={styles.pageTitle}>Profil</Text><Text style={styles.sectionCaption}>Kelola pengalaman Zenix Box kamu</Text></View>
        <LinearGradient colors={['#2B2542', '#191A25']} style={styles.profileCard}><View style={styles.profileAvatar}><Ionicons name="person" size={25} color="#D9CCFF" /></View><View style={styles.profileCopy}><Text style={styles.profileName}>Kreator Zenix</Text><Text style={styles.profileCaption}>Akun tamu · Mulai berkarya</Text></View><Ionicons name="chevron-forward" size={18} color="#9792A8" /></LinearGradient>
        <Text style={styles.groupLabel}>PREFERENSI</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}><View style={styles.settingIcon}><Ionicons name="notifications-outline" size={19} color="#C0A8FF" /></View><View style={styles.settingCopy}><Text style={styles.settingTitle}>Notifikasi</Text><Text style={styles.settingCaption}>Inspirasi dan informasi kreatif</Text></View><Pressable onPress={() => setNotificationsEnabled((value) => !value)} style={[styles.toggle, notificationsEnabled && styles.toggleOn]} accessibilityRole="switch" accessibilityState={{ checked: notificationsEnabled }}><View style={[styles.toggleKnob, notificationsEnabled && styles.toggleKnobOn]} /></Pressable></View>
          <View style={styles.divider} />
          <Pressable style={styles.settingRow} onPress={() => Alert.alert('Privasi', 'Aplikasi hanya membuka media yang kamu pilih. Kebijakan privasi perlu ditambahkan sebelum rilis.') }><View style={styles.settingIcon}><Ionicons name="shield-checkmark-outline" size={19} color="#65D6C1" /></View><View style={styles.settingCopy}><Text style={styles.settingTitle}>Privasi & keamanan</Text><Text style={styles.settingCaption}>Akses media dan informasi data</Text></View><Ionicons name="chevron-forward" size={18} color="#767A8A" /></Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.settingRow} onPress={() => Alert.alert('Bantuan', 'Tambahkan email dukungan resmi sebelum aplikasi dipublikasikan.') }><View style={styles.settingIcon}><Ionicons name="help-circle-outline" size={19} color="#FFC36E" /></View><View style={styles.settingCopy}><Text style={styles.settingTitle}>Pusat bantuan</Text><Text style={styles.settingCaption}>Panduan penggunaan aplikasi</Text></View><Ionicons name="chevron-forward" size={18} color="#767A8A" /></Pressable>
        </View>
        <Pressable style={styles.profilePro} onPress={() => setPaywallVisible(true)}><Ionicons name="diamond" size={18} color={COLORS.gold} /><Text style={styles.profileProText}>Lihat paket Zenix Pro</Text><Ionicons name="chevron-forward" size={18} color="#A59AB8" /></Pressable>
        <Text style={styles.version}>Zenix Box · Versi 1.0.0 · Pratinjau</Text>
      </>
    );
  }

  function renderTabContent() {
    if (activeTab === 'Beranda') return renderHome();
    if (activeTab === 'Jelajahi') return renderExplore();
    if (activeTab === 'Proyek') return renderProjects();
    return renderProfile();
  }

  const onboarding = onboardingPages[onboardingIndex];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.app}>
        {renderHeader()}
        <ScrollView key={activeTab} showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>
          {renderTabContent()}
          <Text style={styles.disclaimer}>Pratinjau UI. Pemrosesan AI nyata, ekspor, dan penyimpanan proyek belum tersedia.</Text>
        </ScrollView>
        <View style={styles.tabBar}>{navigation.map((item) => { const active = activeTab === item.name; return <Pressable key={item.name} style={styles.tabItem} onPress={() => setActiveTab(item.name)} accessibilityRole="tab" accessibilityState={{ selected: active }}><Ionicons name={active ? item.icon.replace('-outline', '') as keyof typeof Ionicons.glyphMap : item.icon} size={21} color={active ? COLORS.purple : '#747789'} /><Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{item.name}</Text></Pressable>; })}</View>
      </View>

      <Modal visible={!onboardingDone} animationType="fade" onRequestClose={() => setOnboardingDone(true)}>
        <SafeAreaView style={styles.onboardingSafe}>
          <View style={styles.onboardingTop}><Brand compact /><Pressable onPress={() => setOnboardingDone(true)}><Text style={styles.skipText}>Lewati</Text></Pressable></View>
          <View style={styles.onboardingMain}>
            <LinearGradient colors={['#332753', '#171824']} style={styles.onboardingArtwork}><View style={styles.onboardingOrb}><Ionicons name={onboarding.icon} size={62} color="#E6D9FF" /></View><View style={styles.onboardingSparkleOne}><Ionicons name="sparkles" size={18} color={COLORS.gold} /></View><View style={styles.onboardingSparkleTwo}><Ionicons name="star" size={14} color="#75D8CF" /></View></LinearGradient>
            <Text style={styles.onboardingEyebrow}>{onboarding.label}</Text><Text style={styles.onboardingTitle}>{onboarding.title}</Text><Text style={styles.onboardingBody}>{onboarding.body}</Text>
            <View style={styles.pagination}>{onboardingPages.map((_, index) => <View key={index} style={[styles.dot, index === onboardingIndex && styles.dotActive]} />)}</View>
          </View>
          <View style={styles.onboardingBottom}><Pressable style={styles.onboardingButton} onPress={() => { if (onboardingIndex < onboardingPages.length - 1) setOnboardingIndex((index) => index + 1); else setOnboardingDone(true); }}><LinearGradient colors={['#9B76FF', '#6E62F5']} style={styles.onboardingButtonGradient}><Text style={styles.onboardingButtonText}>{onboardingIndex === onboardingPages.length - 1 ? 'Mulai sekarang' : 'Lanjutkan'}</Text><Ionicons name="arrow-forward" size={17} color="#fff" /></LinearGradient></Pressable><Text style={styles.onboardingFootnote}>Dengan melanjutkan, kamu menyetujui ketentuan penggunaan.</Text></View>
        </SafeAreaView>
      </Modal>

      <Modal visible={!!selectedTool && !!mediaUri && onboardingDone} animationType="slide" presentationStyle="pageSheet" onRequestClose={dismissEditor}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}><Pressable onPress={dismissEditor} style={styles.backButton}><Ionicons name="chevron-down" size={21} color="#fff" /></Pressable><Text style={styles.modalTitle}>Studio AI</Text><Pressable onPress={() => void chooseMedia(selectedTool ?? undefined)}><Text style={styles.changeText}>Ganti media</Text></Pressable></View>
          <ScrollView contentContainerStyle={styles.editorContent}>
            {mediaUri && (mediaIsVideo ? <View style={styles.videoPreview}><Ionicons name="videocam" size={50} color="#C4B0FF" /><Text style={styles.videoPreviewText}>Pratinjau video</Text></View> : <Image source={{ uri: mediaUri }} style={styles.mediaPreview} resizeMode="cover" />)}
            <View style={styles.toolTag}><Ionicons name={selectedTool?.icon ?? 'sparkles'} size={15} color={COLORS.purple} /><Text style={styles.toolTagText}>{selectedTool?.name}</Text></View>
            <Text style={styles.editorTitle}>{isPreviewReady ? 'Draft pratinjau siap ✨' : 'Sempurnakan visualmu'}</Text>
            <Text style={styles.editorDescription}>{isPreviewReady ? 'Draft tercatat di tab Proyek selama sesi ini. Belum ada efek AI yang diterapkan.' : selectedTool?.description}</Text>
            <View style={styles.intensityCard}><View style={styles.intensityHeader}><Text style={styles.intensityTitle}>Intensitas</Text><Text style={styles.intensityNumber}>{intensity}%</Text></View><View style={styles.sliderTrack}><View style={[styles.sliderFill, { width: `${intensity}%` }]} /></View><View style={styles.intensityControls}><Pressable onPress={() => setIntensity((value) => Math.max(0, value - 10))} style={styles.adjustButton}><Text style={styles.adjustLabel}>− Kurangi</Text></Pressable><Pressable onPress={() => setIntensity((value) => Math.min(100, value + 10))} style={styles.adjustButton}><Text style={styles.adjustLabel}>Tambah +</Text></Pressable></View></View>
            <Pressable disabled={isProcessing} style={styles.applyButton} onPress={makeDemoPreview}><LinearGradient colors={['#9B76FF', '#6E62F5']} style={styles.applyGradient}><Ionicons name={isProcessing ? 'hourglass-outline' : 'sparkles'} size={18} color="#fff" /><Text style={styles.applyText}>{isProcessing ? 'Menyiapkan demo…' : isPreviewReady ? 'Buat demo lagi' : 'Buat pratinjau demo'}</Text></LinearGradient></Pressable>
            <Text style={styles.demoNote}>Simulasi antarmuka. Fitur ini tidak memproses atau mengekspor media.</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={paywallVisible && onboardingDone} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setPaywallVisible(false)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}><Pressable onPress={() => setPaywallVisible(false)} style={styles.backButton}><Ionicons name="close" size={20} color="#fff" /></Pressable><Text style={styles.modalTitle}>Zenix Pro</Text><View style={styles.headerSpacer} /></View>
          <ScrollView contentContainerStyle={styles.paywallContent}>
            <LinearGradient colors={['#382B58', '#1C1A29']} style={styles.paywallHero}><View style={styles.paywallDiamond}><Ionicons name="diamond" size={27} color={COLORS.gold} /></View><Text style={styles.paywallEyebrow}>ZENIX PRO</Text><Text style={styles.paywallTitle}>Lebih banyak ruang untuk berkreasi.</Text><Text style={styles.paywallBody}>Akses rangkaian tools kreatif dan wujudkan ide visual berikutnya.</Text></LinearGradient>
            {['Akses ke semua tools AI', 'Kualitas export hingga resolusi tinggi', 'Prioritas antrean pemrosesan', 'Pengalaman editor yang lebih lengkap'].map((feature) => <View key={feature} style={styles.featureRow}><View style={styles.featureCheck}><Ionicons name="checkmark" size={14} color="#C7B5FF" /></View><Text style={styles.featureText}>{feature}</Text></View>)}
            <Pressable style={styles.subscribeButton} onPress={() => Alert.alert('Belum tersedia', 'Pembelian belum aktif. Integrasikan StoreKit dan Google Play Billing sebelum menawarkan paket berbayar.') }><LinearGradient colors={['#A184FF', '#725BE7']} style={styles.subscribeGradient}><Text style={styles.subscribeText}>Lihat paket Pro</Text><Ionicons name="arrow-forward" size={17} color="#fff" /></LinearGradient></Pressable>
            <Text style={styles.billingNote}>Paket dan harga belum aktif. Tidak ada pembayaran yang akan dilakukan.</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  app: { flex: 1, backgroundColor: COLORS.background },
  header: { height: 62, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandMark: { width: 33, height: 33, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  brandMarkSmall: { width: 29, height: 29, borderRadius: 10 },
  brandName: { color: COLORS.text, fontSize: 21, fontWeight: '800', letterSpacing: -0.8 },
  brandNameSmall: { fontSize: 18 },
  brandAccent: { color: COLORS.purple },
  headerPro: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#282238', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: '#433750' },
  headerProText: { color: COLORS.gold, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  pageContent: { paddingHorizontal: 20, paddingBottom: 26 },
  hero: { minHeight: 254, padding: 20, borderRadius: 25, overflow: 'hidden', flexDirection: 'row', marginTop: 6 },
  heroGlow: { position: 'absolute', width: 190, height: 190, borderRadius: 100, backgroundColor: '#7D5BFF', opacity: 0.13, right: -45, top: -60 },
  heroContent: { flex: 1.2, justifyContent: 'center', zIndex: 2 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#B69AFF' },
  eyebrowText: { color: '#C9B6FF', fontSize: 8, letterSpacing: 1.1, fontWeight: '800' },
  heroTitle: { color: '#FBF9FF', fontSize: 24, lineHeight: 30, fontWeight: '800', letterSpacing: -0.6 },
  heroHighlight: { color: '#BEA6FF' },
  heroBody: { color: '#B1AEC0', fontSize: 10, lineHeight: 16, marginTop: 8, maxWidth: 190 },
  primaryButton: { height: 39, alignSelf: 'flex-start', marginTop: 15, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#8065F6', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  primaryButtonText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  heroArt: { flex: 0.8, minWidth: 108, alignItems: 'center', justifyContent: 'center' },
  artOrb: { width: 102, height: 125, borderRadius: 54, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D5B3FF', transform: [{ rotate: '-7deg' }] },
  artSparkle: { position: 'absolute', top: 34, right: 0, backgroundColor: '#292543', borderRadius: 12, padding: 6 },
  artPill: { position: 'absolute', bottom: 30, left: 0, backgroundColor: '#222139', borderRadius: 9, borderWidth: 1, borderColor: '#484166', paddingHorizontal: 8, paddingVertical: 5 },
  artPillText: { color: '#D4C5FF', fontSize: 8, fontWeight: '800', letterSpacing: 0.7 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 10 },
  quickAction: { flex: 1, minHeight: 76, alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 16, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  quickIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { color: '#D3D3DF', fontSize: 9, fontWeight: '600' },
  sectionHeading: { marginTop: 25, marginBottom: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  sectionCaption: { color: COLORS.muted, fontSize: 11, marginTop: 4, lineHeight: 17 },
  seeAll: { color: '#B7A1FF', fontSize: 11, fontWeight: '700' },
  toolGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  toolCard: { width: '48.3%', minHeight: 125, padding: 13, borderRadius: 17, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, position: 'relative' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.985 }] },
  toolIcon: { width: 37, height: 37, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  toolName: { color: '#F1EFF8', fontSize: 12, fontWeight: '700', paddingRight: 20 },
  toolSubtitle: { color: '#858999', fontSize: 9, marginTop: 4, paddingRight: 3 },
  proBadge: { position: 'absolute', right: 11, top: 12, zIndex: 1, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 7, backgroundColor: '#392E4A' },
  proBadgeText: { color: '#F2D38C', fontSize: 7, fontWeight: '900', letterSpacing: 0.5 },
  cardArrow: { position: 'absolute', right: 11, bottom: 12, width: 21, height: 21, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#202330', transform: [{ rotate: '45deg' }] },
  proBanner: { marginTop: 16, borderRadius: 17, overflow: 'hidden' },
  proBannerGradient: { minHeight: 70, padding: 13, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#433852', borderRadius: 17 },
  proBannerIcon: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#453755' },
  proBannerCopy: { flex: 1, marginLeft: 12 },
  proBannerTitle: { color: '#F3EFFA', fontSize: 11, fontWeight: '700' },
  proBannerCaption: { color: '#AAA1B9', fontSize: 9, marginTop: 4 },
  tabBar: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#0E1018', borderTopWidth: 1, borderTopColor: '#1C1F2A', paddingBottom: 3 },
  tabItem: { minWidth: 62, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabLabel: { color: '#747789', fontSize: 9 },
  tabLabelActive: { color: '#B19AFF', fontWeight: '700' },
  disclaimer: { color: '#686C7B', fontSize: 9, lineHeight: 14, textAlign: 'center', marginTop: 20, paddingHorizontal: 10 },
  pageTitleBlock: { marginTop: 18, marginBottom: 17 },
  pageTitle: { color: COLORS.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  searchBox: { minHeight: 45, borderRadius: 14, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 13, marginBottom: 14 },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 12, paddingVertical: 9 },
  filterRow: { gap: 8, paddingBottom: 15 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  filterChipActive: { backgroundColor: '#30274A', borderColor: '#65529E' },
  filterText: { color: '#9295A5', fontSize: 10, fontWeight: '600' },
  filterTextActive: { color: '#D5C6FF' },
  emptyState: { minHeight: 300, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 25 },
  emptyIcon: { width: 68, height: 68, borderRadius: 22, backgroundColor: '#211D33', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { color: COLORS.text, fontSize: 18, fontWeight: '800', marginTop: 12 },
  emptyBody: { color: COLORS.muted, fontSize: 12, lineHeight: 19, textAlign: 'center', marginTop: 7, maxWidth: 280 },
  projectGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  projectCard: { width: '48.3%', padding: 9, borderRadius: 16, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  projectImage: { width: '100%', height: 140, borderRadius: 11, backgroundColor: COLORS.surfaceRaised },
  projectVideo: { width: '100%', height: 140, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: '#292342' },
  projectName: { color: '#F0EEF7', fontSize: 11, fontWeight: '700', marginTop: 9 },
  projectDate: { color: '#858898', fontSize: 9, marginTop: 4 },
  projectNote: { color: '#777B8B', fontSize: 10, lineHeight: 16, textAlign: 'center', marginTop: 20, paddingHorizontal: 14 },
  profileCard: { minHeight: 82, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#3A314B' },
  profileAvatar: { width: 49, height: 49, borderRadius: 17, backgroundColor: '#44365F', alignItems: 'center', justifyContent: 'center' },
  profileCopy: { flex: 1, marginLeft: 12 },
  profileName: { color: '#F3EFFA', fontSize: 13, fontWeight: '700' },
  profileCaption: { color: '#A29CAD', fontSize: 10, marginTop: 4 },
  groupLabel: { color: '#858898', fontSize: 9, fontWeight: '800', letterSpacing: 1.4, marginTop: 25, marginBottom: 9 },
  settingsCard: { borderRadius: 17, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 13 },
  settingRow: { minHeight: 67, flexDirection: 'row', alignItems: 'center' },
  settingIcon: { width: 35, height: 35, borderRadius: 11, backgroundColor: '#222033', alignItems: 'center', justifyContent: 'center' },
  settingCopy: { flex: 1, marginLeft: 10 },
  settingTitle: { color: '#F0EEF7', fontSize: 11, fontWeight: '600' },
  settingCaption: { color: '#858898', fontSize: 9, marginTop: 4 },
  divider: { height: 1, backgroundColor: '#252835', marginLeft: 45 },
  toggle: { width: 38, height: 22, borderRadius: 12, backgroundColor: '#393C49', padding: 3, justifyContent: 'center' },
  toggleOn: { backgroundColor: '#765FCE' },
  toggleKnob: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#D0D1D8' },
  toggleKnobOn: { alignSelf: 'flex-end', backgroundColor: '#fff' },
  profilePro: { minHeight: 52, marginTop: 15, paddingHorizontal: 13, borderRadius: 15, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#211D2E', borderWidth: 1, borderColor: '#403552' },
  profileProText: { flex: 1, color: '#F1E9D8', fontSize: 11, fontWeight: '700' },
  version: { color: '#656979', fontSize: 9, textAlign: 'center', marginTop: 22, marginBottom: 15 },
  modalSafe: { flex: 1, backgroundColor: '#0B0D14' },
  modalHeader: { height: 58, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 35, height: 35, borderRadius: 12, backgroundColor: '#1B1E29', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
  changeText: { color: '#B39BFF', fontSize: 11, fontWeight: '600' },
  headerSpacer: { width: 35 },
  editorContent: { padding: 20, paddingBottom: 38 },
  mediaPreview: { width: '100%', height: 300, borderRadius: 22, backgroundColor: COLORS.surfaceRaised },
  videoPreview: { width: '100%', height: 250, borderRadius: 22, backgroundColor: '#201D31', alignItems: 'center', justifyContent: 'center' },
  videoPreviewText: { color: '#D5C6FF', fontSize: 11, marginTop: 9 },
  toolTag: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 18, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 11, backgroundColor: '#211C31' },
  toolTagText: { color: '#D4C5FF', fontSize: 10, fontWeight: '700' },
  editorTitle: { color: COLORS.text, fontSize: 21, fontWeight: '800', marginTop: 14 },
  editorDescription: { color: COLORS.muted, fontSize: 11, lineHeight: 18, marginTop: 7 },
  intensityCard: { marginTop: 22, padding: 15, borderRadius: 17, backgroundColor: '#151822', borderWidth: 1, borderColor: '#252936' },
  intensityHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  intensityTitle: { color: '#E8E6EF', fontSize: 11, fontWeight: '700' },
  intensityNumber: { color: '#B9A2FF', fontSize: 10, fontWeight: '700' },
  sliderTrack: { height: 5, borderRadius: 5, backgroundColor: '#323544', marginTop: 17, overflow: 'hidden' },
  sliderFill: { height: 5, borderRadius: 5, backgroundColor: '#9477F7' },
  intensityControls: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  adjustButton: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, backgroundColor: '#202330' },
  adjustLabel: { color: '#B9A2FF', fontSize: 9, fontWeight: '600' },
  applyButton: { marginTop: 17, borderRadius: 15, overflow: 'hidden' },
  applyGradient: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  applyText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  demoNote: { color: '#6E7180', textAlign: 'center', fontSize: 9, marginTop: 11 },
  onboardingSafe: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 24 },
  onboardingTop: { height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skipText: { color: '#AAA5B8', fontSize: 12, fontWeight: '600' },
  onboardingMain: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 15 },
  onboardingArtwork: { width: '100%', height: 300, borderRadius: 30, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#382E50' },
  onboardingOrb: { width: 150, height: 165, borderRadius: 78, backgroundColor: '#6F5EAB', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D4BDFF', transform: [{ rotate: '-8deg' }] },
  onboardingSparkleOne: { position: 'absolute', right: 44, top: 60, width: 36, height: 36, borderRadius: 13, backgroundColor: '#292543', alignItems: 'center', justifyContent: 'center' },
  onboardingSparkleTwo: { position: 'absolute', left: 45, bottom: 63, width: 30, height: 30, borderRadius: 11, backgroundColor: '#20343A', alignItems: 'center', justifyContent: 'center' },
  onboardingEyebrow: { color: '#BDAAFF', fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginTop: 27 },
  onboardingTitle: { color: COLORS.text, fontSize: 28, lineHeight: 35, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5, marginTop: 12 },
  onboardingBody: { color: '#A1A2B0', fontSize: 12, lineHeight: 20, textAlign: 'center', maxWidth: 300, marginTop: 11 },
  pagination: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 24 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#454753' },
  dotActive: { width: 20, backgroundColor: '#A78BFA' },
  onboardingBottom: { paddingBottom: 18 },
  onboardingButton: { borderRadius: 15, overflow: 'hidden' },
  onboardingButtonGradient: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  onboardingButtonText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  onboardingFootnote: { color: '#676A79', fontSize: 9, textAlign: 'center', marginTop: 12 },
  paywallContent: { paddingHorizontal: 22, paddingBottom: 34 },
  paywallHero: { borderRadius: 24, padding: 22, alignItems: 'center', borderWidth: 1, borderColor: '#4C3B61', marginTop: 8 },
  paywallDiamond: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#493955' },
  paywallEyebrow: { color: COLORS.gold, fontSize: 9, fontWeight: '900', letterSpacing: 1.7, marginTop: 16 },
  paywallTitle: { color: COLORS.text, fontSize: 23, lineHeight: 29, fontWeight: '800', textAlign: 'center', marginTop: 9 },
  paywallBody: { color: '#B4B0C1', fontSize: 11, lineHeight: 18, textAlign: 'center', marginTop: 9 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 18, paddingHorizontal: 5 },
  featureCheck: { width: 23, height: 23, borderRadius: 8, backgroundColor: '#302749', alignItems: 'center', justifyContent: 'center' },
  featureText: { color: '#E1DFE9', fontSize: 11, flex: 1 },
  subscribeButton: { marginTop: 25, borderRadius: 15, overflow: 'hidden' },
  subscribeGradient: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  subscribeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  billingNote: { color: '#777A89', textAlign: 'center', fontSize: 9, lineHeight: 14, marginTop: 12 },
});
