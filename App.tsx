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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

type Category = 'Foto AI' | 'Restorasi' | 'Video';
type Tab = 'Beranda' | 'Jelajahi' | 'Proyek' | 'Saya';
type Tool = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  category: Category;
  premium?: boolean;
};
type Project = { id: string; title: string; uri: string; isVideo: boolean; date: string };

const C = {
  bg: '#090B12', panel: '#131621', panel2: '#191C29', border: '#252938',
  text: '#F6F4FC', muted: '#9295A5', dim: '#686C7D', purple: '#A88AFF',
  purpleDark: '#7357E8', mint: '#65D6C1', gold: '#FFD279',
};

const TOOLS: Tool[] = [
  { id: 'ai-4k', title: 'AI 4K', subtitle: 'Foto lebih tajam', description: 'Tingkatkan resolusi dan pulihkan detail foto.', icon: 'scan-outline', color: '#A78BFA', category: 'Restorasi' },
  { id: 'retouch', title: 'AI Retouch', subtitle: 'Kulit tampak natural', description: 'Retouch kulit dan potret dengan tampilan natural.', icon: 'sparkles-outline', color: '#FF8DA1', category: 'Foto AI', premium: true },
  { id: 'face', title: 'Face Enhancer', subtitle: 'Pulihkan detail wajah', description: 'Tingkatkan cahaya dan detail pada potret.', icon: 'happy-outline', color: '#65D6C1', category: 'Restorasi' },
  { id: 'removal', title: 'AI Removal', subtitle: 'Hapus objek', description: 'Bersihkan objek yang mengganggu foto.', icon: 'cut-outline', color: '#FFC36E', category: 'Foto AI', premium: true },
  { id: 'color', title: 'Color Enhancer', subtitle: 'Warna lebih hidup', description: 'Buat warna foto terlihat lebih cerah dan seimbang.', icon: 'color-palette-outline', color: '#FF8DA1', category: 'Foto AI' },
  { id: 'extender', title: 'Image Extender', subtitle: 'Perluas komposisi', description: 'Perluas bidang gambar untuk komposisi baru.', icon: 'expand-outline', color: '#68B8FF', category: 'Foto AI', premium: true },
  { id: 'styles', title: 'AI Styles', subtitle: 'Anime, avatar, cosplay', description: 'Jelajahi transformasi gaya anime, kartun, dan avatar.', icon: 'brush-outline', color: '#B69AFF', category: 'Foto AI', premium: true },
  { id: 'live', title: 'AI Live', subtitle: 'Hidupkan foto', description: 'Buat foto terasa lebih dinamis dengan AI.', icon: 'play-circle-outline', color: '#5DDBCF', category: 'Foto AI', premium: true },
  { id: 'collage', title: 'Video Collage', subtitle: 'Gabungkan klip', description: 'Atur klip video menjadi kolase kreatif.', icon: 'grid-outline', color: '#FFC36E', category: 'Video', premium: true },
  { id: 'stabilizer', title: 'AI Stabilizer', subtitle: 'Video lebih stabil', description: 'Kurangi guncangan agar video terasa lebih mulus.', icon: 'videocam-outline', color: '#68B8FF', category: 'Video' },
  { id: 'makeup', title: 'Video Makeup', subtitle: 'Tampilan natural', description: 'Jelajahi tampilan makeup natural untuk video.', icon: 'color-wand-outline', color: '#FF8DA1', category: 'Video', premium: true },
  { id: 'editor', title: 'Video Editor', subtitle: 'Filter & grading', description: 'Atur crop, kecepatan, mirror, filter, dan warna.', icon: 'film-outline', color: '#A78BFA', category: 'Video' },
];

const TABS: { label: Tab; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Beranda', icon: 'home-outline' },
  { label: 'Jelajahi', icon: 'compass-outline' },
  { label: 'Proyek', icon: 'albums-outline' },
  { label: 'Saya', icon: 'person-outline' },
];
const FILTERS = ['Semua', 'Foto AI', 'Restorasi', 'Video'];

function Brand() {
  return (
    <View style={styles.brandRow}>
      <LinearGradient colors={['#B99AFF', '#7055EA']} style={styles.brandMark}>
        <Ionicons name="sparkles" size={17} color="#fff" />
      </LinearGradient>
      <Text style={styles.brand}>zenix<Text style={styles.brandAccent}>box</Text></Text>
    </View>
  );
}

function ToolCard({ tool, onPress }: { tool: Tool; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.toolCard} accessibilityRole="button" accessibilityLabel={`${tool.title}: ${tool.subtitle}`}>
      <View style={[styles.toolIcon, { backgroundColor: `${tool.color}20` }]}>
        <Ionicons name={tool.icon} size={21} color={tool.color} />
      </View>
      {tool.premium ? <View style={styles.proTag}><Ionicons name="diamond" size={9} color={C.gold} /><Text style={styles.proTagText}>PRO</Text></View> : null}
      <Text style={styles.toolTitle}>{tool.title}</Text>
      <Text style={styles.toolSubtitle}>{tool.subtitle}</Text>
      <View style={styles.toolArrow}><Ionicons name="arrow-up" size={12} color={C.muted} /></View>
    </Pressable>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('Beranda');
  const [filter, setFilter] = useState('Semua');
  const [query, setQuery] = useState('');
  const [onboardingVisible, setOnboardingVisible] = useState(true);
  const [proVisible, setProVisible] = useState(false);
  const [tool, setTool] = useState<Tool | null>(null);
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [intensity, setIntensity] = useState(70);
  const [processing, setProcessing] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const filteredTools = useMemo(() => TOOLS.filter((item) => {
    const categoryMatches = filter === 'Semua' || item.category === filter;
    const searchText = `${item.title} ${item.subtitle} ${item.description}`.toLowerCase();
    return categoryMatches && searchText.includes(query.trim().toLowerCase());
  }), [filter, query]);

  async function chooseMedia(forTool?: Tool) {
    try {
      const video = forTool?.category === 'Video';
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Izin galeri dibutuhkan', 'Izinkan akses foto agar kamu bisa memilih media untuk pratinjau.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: video ? ['videos'] : ['images'],
        allowsEditing: false,
        quality: 1,
      });
      if (result.canceled || !result.assets[0]) return;
      setMediaUri(result.assets[0].uri);
      setIsVideo(video);
      setTool(forTool ?? TOOLS[0]);
      setIntensity(70);
      setPreviewReady(false);
    } catch {
      Alert.alert('Galeri tidak tersedia', 'Coba kembali atau pilih media lain.');
    }
  }

  function selectTool(nextTool: Tool) {
    if (nextTool.premium) {
      setProVisible(true);
      return;
    }
    if (mediaUri) {
      setTool(nextTool);
      setIsVideo(nextTool.category === 'Video');
      setPreviewReady(false);
    } else {
      void chooseMedia(nextTool);
    }
  }

  function createPreview() {
    if (!mediaUri || !tool || processing) return;
    setProcessing(true);
    setTimeout(() => {
      const project: Project = {
        id: `${Date.now()}`,
        title: tool.title,
        uri: mediaUri,
        isVideo,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      };
      setProjects((current) => [project, ...current]);
      setProcessing(false);
      setPreviewReady(true);
    }, 850);
  }

  function openProject(project: Project) {
    const foundTool = TOOLS.find((item) => item.title === project.title) ?? TOOLS[0];
    setTool(foundTool);
    setMediaUri(project.uri);
    setIsVideo(project.isVideo);
    setPreviewReady(true);
  }

  function renderDiscovery() {
    return (
      <>
        <View style={styles.heroWrap}>
          <LinearGradient colors={['#30264C', '#1B1B2B', '#131620']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <View style={styles.heroGlow} />
            <View style={styles.heroCopy}>
              <View style={styles.eyebrow}><View style={styles.liveDot} /><Text style={styles.eyebrowText}>AI CREATIVE STUDIO</Text></View>
              <Text style={styles.heroTitle}>Momenmu,{ '\n' }versi <Text style={styles.heroAccent}>terbaik.</Text></Text>
              <Text style={styles.heroBody}>Retouch potret, pulihkan detail, dan ciptakan visual yang terasa istimewa.</Text>
              <Pressable style={styles.heroButton} onPress={() => void chooseMedia()}>
                <Ionicons name="sparkles" size={15} color="#fff" />
                <Text style={styles.heroButtonText}>Mulai berkarya</Text>
                <Ionicons name="arrow-forward" size={14} color="#fff" />
              </Pressable>
            </View>
            <View style={styles.artColumn}>
              <LinearGradient colors={['#E6B4FF', '#987AFF', '#5655C8']} style={styles.artOrb}>
                <Ionicons name="person" size={62} color="#FFF1FF" />
              </LinearGradient>
              <View style={styles.artSparkle}><Ionicons name="sparkles" size={16} color={C.gold} /></View>
              <View style={styles.artPill}><Text style={styles.artPillText}>AI MAGIC</Text></View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.trustRow}>
          <View style={styles.trustIcon}><Ionicons name="shield-checkmark-outline" size={15} color={C.mint} /></View>
          <Text style={styles.trustText}>Pilih media sendiri · Pratinjau demo di perangkat</Text>
        </View>

        <View style={styles.sectionHeader}>
          <View><Text style={styles.sectionTitle}>{tab === 'Jelajahi' ? 'Jelajahi tools' : 'Studio kreatif'}</Text><Text style={styles.sectionCaption}>12 alat untuk foto dan video</Text></View>
          {tab === 'Beranda' ? <Pressable onPress={() => setTab('Jelajahi')}><Text style={styles.linkText}>Lihat semua</Text></Pressable> : null}
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={C.muted} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Cari alat kreatif..." placeholderTextColor={C.dim} style={styles.searchInput} returnKeyType="search" />
          {query.length > 0 ? <Pressable onPress={() => setQuery('')}><Ionicons name="close-circle" size={17} color={C.dim} /></Pressable> : null}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map((item) => (
            <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filterChip, filter === item && styles.filterChipActive]}>
              <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {filteredTools.length > 0 ? (
          <View style={styles.toolGrid}>{filteredTools.map((item) => <ToolCard key={item.id} tool={item} onPress={() => selectTool(item)} />)}</View>
        ) : <Text style={styles.noResults}>Tidak ada alat yang cocok dengan pencarianmu.</Text>}

        {tab === 'Beranda' ? (
          <Pressable onPress={() => setProVisible(true)}>
            <LinearGradient colors={['#2B2542', '#1B1B2A']} style={styles.promoCard}>
              <View style={styles.promoIcon}><Ionicons name="diamond" size={18} color={C.gold} /></View>
              <View style={styles.promoCopy}><Text style={styles.promoTitle}>Buka kreativitas tanpa batas</Text><Text style={styles.promoSubtitle}>Kenali paket Zenix Pro</Text></View>
              <Ionicons name="chevron-forward" size={17} color="#A69BBC" />
            </LinearGradient>
          </Pressable>
        ) : null}
      </>
    );
  }

  function renderProjects() {
    return (
      <>
        <View style={styles.pageHeading}><Text style={styles.pageTitle}>Proyek</Text><Text style={styles.pageSubtitle}>Pratinjau yang dibuat selama sesi ini</Text></View>
        {projects.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}><Ionicons name="images-outline" size={28} color={C.purple} /></View>
            <Text style={styles.emptyTitle}>Galeri karyamu dimulai di sini</Text>
            <Text style={styles.emptyText}>Pilih media dan buat pratinjau demo. Proyek akan terlihat sampai aplikasi ditutup.</Text>
            <Pressable style={styles.heroButton} onPress={() => void chooseMedia()}><Ionicons name="add" size={17} color="#fff" /><Text style={styles.heroButtonText}>Pilih media</Text></Pressable>
          </View>
        ) : (
          <View style={styles.projectGrid}>{projects.map((project) => (
            <Pressable key={project.id} style={styles.projectCard} onPress={() => openProject(project)}>
              {project.isVideo ? <View style={styles.projectVideo}><Ionicons name="play-circle" size={36} color="#fff" /></View> : <Image source={{ uri: project.uri }} style={styles.projectImage} />}
              <Text style={styles.projectTitle}>{project.title}</Text><Text style={styles.projectDate}>{project.date} · Demo</Text>
            </Pressable>
          ))}</View>
        )}
      </>
    );
  }

  function renderProfile() {
    return (
      <>
        <View style={styles.pageHeading}><Text style={styles.pageTitle}>Profil</Text><Text style={styles.pageSubtitle}>Pengaturan dan informasi aplikasi</Text></View>
        <LinearGradient colors={['#302747', '#191A25']} style={styles.profileCard}>
          <View style={styles.avatar}><Ionicons name="person" size={25} color="#E5D9FF" /></View>
          <View style={styles.profileText}><Text style={styles.profileName}>Kreator Zenix</Text><Text style={styles.profileCaption}>Akun demo</Text></View>
          <Ionicons name="chevron-forward" size={17} color={C.muted} />
        </LinearGradient>
        <Text style={styles.groupTitle}>PREFERENSI</Text>
        <View style={styles.settingsCard}>
          <Pressable style={styles.settingRow} onPress={() => Alert.alert('Notifikasi', 'Pengaturan notifikasi perangkat dapat diubah dari pengaturan sistem.') }><View style={styles.settingIcon}><Ionicons name="notifications-outline" size={18} color={C.purple} /></View><View style={styles.settingCopy}><Text style={styles.settingTitle}>Notifikasi</Text><Text style={styles.settingCaption}>Kelola pengingat aplikasi</Text></View><Ionicons name="chevron-forward" size={17} color={C.dim} /></Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.settingRow} onPress={() => Alert.alert('Privasi', 'Pratinjau demo ini tidak mengunggah media. Tinjau kebijakan privasi produk sebelum menggunakan layanan AI online.') }><View style={styles.settingIcon}><Ionicons name="shield-checkmark-outline" size={18} color={C.mint} /></View><View style={styles.settingCopy}><Text style={styles.settingTitle}>Privasi & keamanan</Text><Text style={styles.settingCaption}>Tentang pengelolaan media</Text></View><Ionicons name="chevron-forward" size={17} color={C.dim} /></Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.settingRow} onPress={() => Alert.alert('Bantuan', 'Pusat bantuan akan tersedia pada rilis mendatang.') }><View style={styles.settingIcon}><Ionicons name="help-circle-outline" size={18} color={C.gold} /></View><View style={styles.settingCopy}><Text style={styles.settingTitle}>Pusat bantuan</Text><Text style={styles.settingCaption}>FAQ dan kontak dukungan</Text></View><Ionicons name="chevron-forward" size={17} color={C.dim} /></Pressable>
        </View>
        <Pressable style={styles.proProfile} onPress={() => setProVisible(true)}><Ionicons name="diamond" size={18} color={C.gold} /><Text style={styles.proProfileText}>Lihat Zenix Pro</Text><Ionicons name="chevron-forward" size={17} color="#A69BBC" /></Pressable>
        <Text style={styles.version}>ZENIX BOX · VERSI 1.0.0 · PREVIEW</Text>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={styles.app}>
        <View style={styles.topBar}>
          <Pressable onPress={() => setTab('Beranda')}><Brand /></Pressable>
          <Pressable style={styles.topProButton} onPress={() => setProVisible(true)}><Ionicons name="diamond" size={13} color={C.gold} /><Text style={styles.topProText}>PRO</Text></Pressable>
        </View>
        <ScrollView key={tab} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {tab === 'Beranda' || tab === 'Jelajahi' ? renderDiscovery() : tab === 'Proyek' ? renderProjects() : renderProfile()}
          <Text style={styles.disclaimer}>Fitur AI dan paket Pro pada versi ini adalah pratinjau. Pemrosesan dan pembayaran nyata belum diaktifkan.</Text>
        </ScrollView>
        <View style={styles.tabBar}>{TABS.map((item) => {
          const active = tab === item.label;
          return <Pressable key={item.label} style={styles.tabItem} onPress={() => setTab(item.label)} accessibilityRole="tab" accessibilityState={{ selected: active }}><Ionicons name={active ? item.icon.replace('-outline', '') as keyof typeof Ionicons.glyphMap : item.icon} size={21} color={active ? C.purple : '#777B8B'} /><Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{item.label}</Text></Pressable>;
        })}</View>
      </View>

      <Modal visible={onboardingVisible} animationType="fade" onRequestClose={() => setOnboardingVisible(false)}>
        <SafeAreaView style={styles.onboardingSafe}>
          <StatusBar barStyle="light-content" backgroundColor={C.bg} />
          <View style={styles.onboardingTop}><Brand /><Pressable onPress={() => setOnboardingVisible(false)}><Text style={styles.skipText}>Lewati</Text></Pressable></View>
          <View style={styles.onboardingBody}>
            <View style={styles.onboardingArtWrap}>
              <LinearGradient colors={['#34294D', '#1D1D30']} style={styles.onboardingArt}>
                <View style={styles.onboardingHalo} />
                <LinearGradient colors={['#E6B4FF', '#9A7BFF', '#5655C8']} style={styles.onboardingOrb}><Ionicons name="person" size={83} color="#FFF1FF" /></LinearGradient>
                <View style={styles.onboardSparkleOne}><Ionicons name="sparkles" size={20} color={C.gold} /></View>
                <View style={styles.onboardSparkleTwo}><Ionicons name="sparkles" size={14} color="#80E8DA" /></View>
                <View style={styles.onboardPhotoTag}><Ionicons name="image-outline" size={13} color="#D9C8FF" /><Text style={styles.onboardPhotoTagText}>POTRET · AI</Text></View>
              </LinearGradient>
            </View>
            <View style={styles.onboardDots}><View style={styles.onboardDotActive} /><View style={styles.onboardDot} /><View style={styles.onboardDot} /></View>
            <Text style={styles.onboardTitle}>Ceritakan kisahmu.{ '\n' }Kami bantu <Text style={styles.heroAccent}>menyinarinya.</Text></Text>
            <Text style={styles.onboardDescription}>Retouch potret, pulihkan foto, dan jelajahi gaya kreatif dalam satu studio.</Text>
            <View style={styles.onboardFeatures}>
              <View style={styles.onboardFeature}><Ionicons name="sparkles-outline" size={16} color={C.purple} /><Text style={styles.onboardFeatureText}>Tools kreatif AI</Text></View>
              <View style={styles.onboardFeature}><Ionicons name="images-outline" size={16} color={C.mint} /><Text style={styles.onboardFeatureText}>Foto dan video</Text></View>
            </View>
          </View>
          <View style={styles.onboardingFooter}>
            <Pressable style={styles.onboardContinue} onPress={() => setOnboardingVisible(false)}><LinearGradient colors={['#A987FF', '#7156E8']} style={styles.onboardContinueGradient}><Text style={styles.onboardContinueText}>Mulai jelajahi</Text><Ionicons name="arrow-forward" size={17} color="#fff" /></LinearGradient></Pressable>
            <Text style={styles.onboardDisclaimer}>Dengan melanjutkan, kamu bisa memilih media sendiri dari galeri.</Text>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal visible={proVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setProVisible(false)}>
        <SafeAreaView style={styles.sheetSafe}>
          <View style={styles.sheetHeader}><Pressable style={styles.closeButton} onPress={() => setProVisible(false)}><Ionicons name="close" size={19} color={C.text} /></Pressable><Text style={styles.sheetHeaderTitle}>ZENIX PRO</Text><View style={styles.closeButtonPlaceholder} /></View>
          <ScrollView contentContainerStyle={styles.proContent}>
            <LinearGradient colors={['#35284D', '#1A1A29']} style={styles.proHero}>
              <View style={styles.proHeroIcon}><Ionicons name="diamond" size={23} color={C.gold} /></View>
              <Text style={styles.proHeroTitle}>Lebih banyak ruang{ '\n' }untuk berkreasi.</Text>
              <Text style={styles.proHeroCaption}>Semua alat favoritmu dalam satu studio kreatif.</Text>
            </LinearGradient>
            <View style={styles.benefitList}>
              {['Akses ke seluruh AI tools', 'Kualitas export premium', 'Antrean proses prioritas', 'Kreasi tanpa watermark'].map((benefit) => <View key={benefit} style={styles.benefitRow}><Ionicons name="checkmark-circle" size={18} color={C.mint} /><Text style={styles.benefitText}>{benefit}</Text></View>)}
            </View>
            <View style={styles.planCard}><View style={styles.planTop}><View><Text style={styles.planName}>Paket Pro</Text><Text style={styles.planCaption}>Pilihan fleksibel untuk kreator</Text></View><View style={styles.comingSoon}><Text style={styles.comingSoonText}>SEGERA</Text></View></View><View style={styles.planDivider} /><Text style={styles.planPrice}>Harga dan periode berlangganan akan ditampilkan di sini.</Text></View>
            <Pressable style={styles.proDisabledButton} onPress={() => Alert.alert('Belum tersedia', 'Langganan akan diaktifkan setelah integrasi pembelian dalam aplikasi dan konfigurasi store selesai.')}><Text style={styles.proDisabledText}>Berlangganan segera hadir</Text></Pressable>
            <Text style={styles.proDisclaimer}>Tidak ada pembelian aktif pada versi pratinjau ini. Harga, syarat, dan restore purchase harus diintegrasikan sebelum rilis.</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={!!mediaUri && !!tool} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setTool(null)}>
        <SafeAreaView style={styles.sheetSafe}>
          <View style={styles.sheetHeader}><Pressable style={styles.closeButton} onPress={() => setTool(null)}><Ionicons name="chevron-down" size={20} color={C.text} /></Pressable><Text style={styles.sheetHeaderTitle}>STUDIO PREVIEW</Text><Pressable onPress={() => void chooseMedia(tool ?? undefined)}><Text style={styles.changeMedia}>Ganti media</Text></Pressable></View>
          <ScrollView contentContainerStyle={styles.editorContent}>
            {mediaUri ? (isVideo ? <View style={styles.videoPreview}><Ionicons name="videocam" size={48} color={C.purple} /><Text style={styles.videoPreviewText}>Pratinjau video</Text></View> : <Image source={{ uri: mediaUri }} style={styles.mediaPreview} resizeMode="cover" />) : null}
            <View style={styles.editorToolTag}><Ionicons name={tool?.icon ?? 'sparkles'} size={14} color={C.purple} /><Text style={styles.editorToolTagText}>{tool?.title}</Text></View>
            <Text style={styles.editorTitle}>{previewReady ? 'Draft pratinjau dibuat' : 'Sempurnakan visualmu'}</Text>
            <Text style={styles.editorDescription}>{previewReady ? 'Draft tersimpan sementara di tab Proyek. Tidak ada pemrosesan AI nyata pada versi ini.' : tool?.description}</Text>
            <View style={styles.intensityCard}><View style={styles.intensityHeader}><Text style={styles.intensityTitle}>Intensitas</Text><Text style={styles.intensityValue}>{intensity}%</Text></View><View style={styles.track}><View style={[styles.trackFill, { width: `${intensity}%` }]} /><View style={[styles.trackKnob, { left: `${Math.max(0, intensity - 2)}%` }]} /></View><View style={styles.intensityControls}><Pressable onPress={() => setIntensity((value) => Math.max(0, value - 10))} style={styles.intensityAction}><Text style={styles.intensityActionText}>− Kurangi</Text></Pressable><Pressable onPress={() => setIntensity((value) => Math.min(100, value + 10))} style={styles.intensityAction}><Text style={styles.intensityActionText}>Tambah +</Text></Pressable></View></View>
            <Pressable disabled={processing} onPress={createPreview} style={styles.createButton}><LinearGradient colors={['#A987FF', '#7156E8']} style={styles.createGradient}><Ionicons name={processing ? 'sync' : 'sparkles'} size={18} color="#fff" /><Text style={styles.createText}>{processing ? 'Menyiapkan demo…' : 'Buat pratinjau demo'}</Text></LinearGradient></Pressable>
            <Text style={styles.editorDisclaimer}>Simulasi antarmuka saja — file hasil AI belum dibuat atau diekspor.</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg }, app: { flex: 1, backgroundColor: C.bg },
  topBar: { height: 60, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 }, brandMark: { width: 31, height: 31, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, brand: { color: C.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.8 }, brandAccent: { color: C.purple },
  topProButton: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 11, paddingVertical: 7, borderRadius: 18, backgroundColor: '#252137', borderWidth: 1, borderColor: '#403552' }, topProText: { color: C.gold, fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  content: { paddingHorizontal: 20, paddingBottom: 26 }, heroWrap: { marginTop: 6, borderRadius: 23, shadowColor: '#8E65E8', shadowOpacity: 0.14, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  hero: { minHeight: 260, borderRadius: 23, overflow: 'hidden', padding: 20, flexDirection: 'row' }, heroGlow: { position: 'absolute', right: -48, top: -64, height: 190, width: 190, borderRadius: 95, backgroundColor: '#9B75FF', opacity: 0.12 }, heroCopy: { flex: 1.15, justifyContent: 'center', zIndex: 2 }, eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12 }, liveDot: { height: 6, width: 6, borderRadius: 3, backgroundColor: C.mint }, eyebrowText: { color: '#C4B4F7', fontSize: 9, fontWeight: '800', letterSpacing: 1.3 }, heroTitle: { color: '#FCFAFF', fontSize: 25, lineHeight: 31, fontWeight: '800', letterSpacing: -0.6 }, heroAccent: { color: '#C3A8FF' }, heroBody: { color: '#B4B1C2', fontSize: 11, lineHeight: 17, marginTop: 9, maxWidth: 190 }, heroButton: { height: 39, alignSelf: 'flex-start', marginTop: 17, paddingHorizontal: 13, borderRadius: 13, backgroundColor: '#8065F6', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, heroButtonText: { color: '#fff', fontSize: 11, fontWeight: '700' }, artColumn: { flex: 0.78, minWidth: 105, alignItems: 'center', justifyContent: 'center' }, artOrb: { width: 101, height: 124, borderRadius: 54, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#DFB9FF', transform: [{ rotate: '-6deg' }] }, artSparkle: { position: 'absolute', right: 2, top: 43, padding: 6, borderRadius: 12, backgroundColor: '#292543' }, artPill: { position: 'absolute', bottom: 30, left: 0, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 9, backgroundColor: '#242137', borderWidth: 1, borderColor: '#484166' }, artPillText: { color: '#D5C6FF', fontSize: 8, fontWeight: '800', letterSpacing: 0.6 },
  trustRow: { flexDirection: 'row', alignItems: 'center', marginTop: 13, gap: 8, paddingHorizontal: 2 }, trustIcon: { width: 25, height: 25, borderRadius: 9, backgroundColor: '#162B2A', alignItems: 'center', justifyContent: 'center' }, trustText: { color: C.muted, fontSize: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25, marginBottom: 13 }, sectionTitle: { color: C.text, fontWeight: '750', fontSize: 16 }, sectionCaption: { color: '#818496', fontSize: 10, marginTop: 4 }, linkText: { color: '#B9A2FF', fontSize: 11, fontWeight: '700' },
  searchBox: { minHeight: 44, borderRadius: 14, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 9 }, searchInput: { flex: 1, color: C.text, fontSize: 12, paddingVertical: 10 }, filterRow: { gap: 8, paddingVertical: 14 }, filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: '#141722', borderWidth: 1, borderColor: '#252938' }, filterChipActive: { backgroundColor: '#302747', borderColor: '#705B9C' }, filterText: { color: '#9699A8', fontSize: 10, fontWeight: '600' }, filterTextActive: { color: '#E1D5FF' },
  toolGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 }, toolCard: { width: '48.4%', minHeight: 126, padding: 12, borderRadius: 17, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, position: 'relative' }, toolIcon: { width: 37, height: 37, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }, toolTitle: { color: '#F1EFF7', fontSize: 12, fontWeight: '700' }, toolSubtitle: { color: '#858999', fontSize: 9, marginTop: 4, paddingRight: 7 }, toolArrow: { position: 'absolute', top: 13, right: 12, height: 22, width: 22, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#202330', transform: [{ rotate: '45deg' }] }, proTag: { position: 'absolute', right: 11, top: 43, flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 7, backgroundColor: '#2B2439' }, proTagText: { color: C.gold, fontSize: 7, fontWeight: '800' }, noResults: { color: C.muted, textAlign: 'center', fontSize: 12, paddingVertical: 32 },
  promoCard: { marginTop: 16, minHeight: 68, borderRadius: 17, padding: 13, borderWidth: 1, borderColor: '#3A304E', flexDirection: 'row', alignItems: 'center' }, promoIcon: { height: 38, width: 38, borderRadius: 12, backgroundColor: '#3B304A', alignItems: 'center', justifyContent: 'center' }, promoCopy: { flex: 1, marginLeft: 11 }, promoTitle: { color: C.text, fontSize: 11, fontWeight: '700' }, promoSubtitle: { color: C.muted, fontSize: 9, marginTop: 4 },
  disclaimer: { color: '#676B7B', fontSize: 9, lineHeight: 14, textAlign: 'center', marginTop: 19, paddingHorizontal: 8 }, tabBar: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#0E1018', borderTopWidth: 1, borderTopColor: '#1E212D', paddingBottom: 4 }, tabItem: { minWidth: 61, alignItems: 'center', justifyContent: 'center', gap: 4 }, tabLabel: { color: '#747789', fontSize: 9 }, tabLabelActive: { color: '#B9A2FF', fontWeight: '700' },
  pageHeading: { marginTop: 16, marginBottom: 20 }, pageTitle: { color: C.text, fontSize: 25, fontWeight: '800', letterSpacing: -0.6 }, pageSubtitle: { color: C.muted, fontSize: 11, marginTop: 5 }, emptyState: { minHeight: 390, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 25 }, emptyIcon: { height: 69, width: 69, borderRadius: 22, backgroundColor: '#221D34', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }, emptyTitle: { color: C.text, fontSize: 17, fontWeight: '750', textAlign: 'center' }, emptyText: { color: C.muted, fontSize: 11, lineHeight: 18, textAlign: 'center', marginTop: 8, maxWidth: 270 }, projectGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 }, projectCard: { width: '48.4%', borderRadius: 16, padding: 8, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border }, projectImage: { width: '100%', height: 145, borderRadius: 11, backgroundColor: C.panel2 }, projectVideo: { width: '100%', height: 145, borderRadius: 11, backgroundColor: '#292342', alignItems: 'center', justifyContent: 'center' }, projectTitle: { color: C.text, fontSize: 11, fontWeight: '700', marginTop: 9 }, projectDate: { color: C.muted, fontSize: 9, marginTop: 4 },
  profileCard: { minHeight: 82, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#393048', flexDirection: 'row', alignItems: 'center' }, avatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#43365E', alignItems: 'center', justifyContent: 'center' }, profileText: { flex: 1, marginLeft: 12 }, profileName: { color: C.text, fontWeight: '700', fontSize: 13 }, profileCaption: { color: C.muted, fontSize: 10, marginTop: 4 }, groupTitle: { color: '#7D8190', fontSize: 9, fontWeight: '800', letterSpacing: 1.3, marginTop: 25, marginBottom: 10 }, settingsCard: { borderRadius: 17, paddingHorizontal: 13, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border }, settingRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center' }, settingIcon: { width: 35, height: 35, borderRadius: 11, backgroundColor: '#242235', alignItems: 'center', justifyContent: 'center' }, settingCopy: { flex: 1, marginLeft: 11 }, settingTitle: { color: '#F0EEF7', fontSize: 11, fontWeight: '650' }, settingCaption: { color: '#858999', fontSize: 9, marginTop: 4 }, divider: { height: 1, backgroundColor: '#262936', marginLeft: 46 }, proProfile: { minHeight: 51, marginTop: 14, paddingHorizontal: 13, borderRadius: 14, backgroundColor: '#211D2E', borderWidth: 1, borderColor: '#403552', flexDirection: 'row', alignItems: 'center', gap: 10 }, proProfileText: { flex: 1, color: '#F1E9D8', fontSize: 11, fontWeight: '700' }, version: { color: '#626676', textAlign: 'center', fontSize: 9, marginTop: 25, marginBottom: 20 },
  onboardingSafe: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 22, justifyContent: 'space-between' }, onboardingTop: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, skipText: { color: '#A8AABA', fontSize: 11, fontWeight: '600' }, onboardingBody: { flex: 1, justifyContent: 'center', paddingBottom: 10 }, onboardingArtWrap: { marginBottom: 25 }, onboardingArt: { height: 290, borderRadius: 30, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#352D48' }, onboardingHalo: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: '#765BCE', opacity: 0.13 }, onboardingOrb: { width: 132, height: 168, borderRadius: 72, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E1BDFF', transform: [{ rotate: '-6deg' }] }, onboardSparkleOne: { position: 'absolute', top: 57, right: 55, padding: 8, borderRadius: 14, backgroundColor: '#28233B' }, onboardSparkleTwo: { position: 'absolute', bottom: 62, left: 54, padding: 7, borderRadius: 13, backgroundColor: '#1E2C31' }, onboardPhotoTag: { position: 'absolute', right: 35, bottom: 54, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 7, borderRadius: 10, backgroundColor: '#242137', borderWidth: 1, borderColor: '#484166' }, onboardPhotoTagText: { color: '#D9C8FF', fontSize: 8, fontWeight: '800', letterSpacing: 0.5 }, onboardDots: { flexDirection: 'row', gap: 6, marginBottom: 17 }, onboardDotActive: { width: 20, height: 5, borderRadius: 3, backgroundColor: C.purple }, onboardDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#414352' }, onboardTitle: { color: C.text, fontSize: 27, lineHeight: 34, fontWeight: '800', letterSpacing: -0.7 }, onboardDescription: { color: '#A0A2B0', fontSize: 12, lineHeight: 19, marginTop: 10, maxWidth: 330 }, onboardFeatures: { flexDirection: 'row', gap: 10, marginTop: 18 }, onboardFeature: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 11, backgroundColor: '#171A24', borderWidth: 1, borderColor: '#282B38' }, onboardFeatureText: { color: '#B9BBC7', fontSize: 9, fontWeight: '600' }, onboardingFooter: { paddingBottom: 17 }, onboardContinue: { borderRadius: 15, overflow: 'hidden' }, onboardContinueGradient: { height: 52, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }, onboardContinueText: { color: '#fff', fontSize: 13, fontWeight: '700' }, onboardDisclaimer: { color: '#686C7D', textAlign: 'center', fontSize: 9, marginTop: 11 },
  sheetSafe: { flex: 1, backgroundColor: '#0B0D14' }, sheetHeader: { height: 57, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, closeButton: { width: 34, height: 34, borderRadius: 11, backgroundColor: '#20232E', alignItems: 'center', justifyContent: 'center' }, closeButtonPlaceholder: { width: 34 }, sheetHeaderTitle: { color: '#B8B4C7', fontSize: 9, fontWeight: '800', letterSpacing: 1.5 }, proContent: { paddingHorizontal: 20, paddingBottom: 32 }, proHero: { borderRadius: 23, padding: 22, minHeight: 205, borderWidth: 1, borderColor: '#40344F' }, proHeroIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#3B304A', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }, proHeroTitle: { color: C.text, fontSize: 24, lineHeight: 29, fontWeight: '800', letterSpacing: -0.5 }, proHeroCaption: { color: '#ADA9BA', fontSize: 11, lineHeight: 17, marginTop: 8 }, benefitList: { gap: 13, paddingVertical: 22 }, benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 10 }, benefitText: { color: '#E3E0EB', fontSize: 11, fontWeight: '600' }, planCard: { padding: 16, borderRadius: 17, backgroundColor: C.panel, borderWidth: 1, borderColor: '#5F4F7F' }, planTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, planName: { color: C.text, fontSize: 14, fontWeight: '750' }, planCaption: { color: C.muted, fontSize: 10, marginTop: 4 }, comingSoon: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, backgroundColor: '#302747' }, comingSoonText: { color: '#D2C0FF', fontSize: 8, fontWeight: '800', letterSpacing: 0.5 }, planDivider: { height: 1, backgroundColor: C.border, marginVertical: 13 }, planPrice: { color: '#B2B4C1', fontSize: 10, lineHeight: 16 }, proDisabledButton: { height: 49, marginTop: 15, borderRadius: 14, backgroundColor: '#282333', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#403552' }, proDisabledText: { color: '#D2C6E8', fontSize: 11, fontWeight: '700' }, proDisclaimer: { color: '#707485', fontSize: 9, lineHeight: 14, textAlign: 'center', marginTop: 12, paddingHorizontal: 8 },
  editorContent: { padding: 19, paddingBottom: 36 }, changeMedia: { color: '#B9A2FF', fontSize: 10, fontWeight: '700' }, mediaPreview: { width: '100%', height: 300, borderRadius: 21, backgroundColor: C.panel2 }, videoPreview: { width: '100%', height: 250, borderRadius: 21, backgroundColor: '#211D32', alignItems: 'center', justifyContent: 'center' }, videoPreviewText: { color: '#D6C8F6', fontSize: 11, marginTop: 8 }, editorToolTag: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, backgroundColor: '#241E35', marginTop: 18 }, editorToolTagText: { color: '#D4C5FF', fontSize: 10, fontWeight: '700' }, editorTitle: { color: C.text, fontSize: 21, fontWeight: '800', marginTop: 14 }, editorDescription: { color: C.muted, fontSize: 11, lineHeight: 18, marginTop: 6 }, intensityCard: { marginTop: 21, padding: 15, borderRadius: 16, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border }, intensityHeader: { flexDirection: 'row', justifyContent: 'space-between' }, intensityTitle: { color: '#E6E3ED', fontSize: 11, fontWeight: '700' }, intensityValue: { color: '#C2A9FF', fontSize: 10, fontWeight: '700' }, track: { height: 5, backgroundColor: '#373A49', borderRadius: 4, marginTop: 17 }, trackFill: { height: 5, borderRadius: 4, backgroundColor: '#9678F4' }, trackKnob: { position: 'absolute', top: -5, width: 15, height: 15, borderRadius: 8, backgroundColor: '#F2EFFF', borderWidth: 3, borderColor: '#9678F4' }, intensityControls: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }, intensityAction: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 8, backgroundColor: '#222531' }, intensityActionText: { color: '#BCA7F6', fontSize: 9, fontWeight: '600' }, createButton: { overflow: 'hidden', borderRadius: 14, marginTop: 17 }, createGradient: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }, createText: { color: '#fff', fontSize: 12, fontWeight: '700' }, editorDisclaimer: { color: '#686C7D', fontSize: 9, textAlign: 'center', marginTop: 11 },
});
