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

type Tool = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  category: 'Foto AI' | 'Restorasi' | 'Video';
  description: string;
};
type Project = { id: string; title: string; uri: string; isVideo: boolean; date: string };
type Tab = 'Beranda' | 'Jelajahi' | 'Proyek' | 'Saya';

const tools: Tool[] = [
  { title: 'AI 4K', subtitle: 'Tingkatkan resolusi', icon: 'scan-outline', color: '#A78BFA', category: 'Restorasi', description: 'Perbesar resolusi dan pulihkan detail foto.' },
  { title: 'AI Retouch', subtitle: 'Kulit tampak halus', icon: 'sparkles-outline', color: '#FF8DA1', category: 'Foto AI', description: 'Retouch potret dengan hasil yang tetap natural.' },
  { title: 'Face Enhancer', subtitle: 'Pulihkan detail wajah', icon: 'happy-outline', color: '#65D6C1', category: 'Restorasi', description: 'Tingkatkan pencahayaan dan detail wajah.' },
  { title: 'AI Removal', subtitle: 'Hapus objek', icon: 'cut-outline', color: '#FFC36E', category: 'Foto AI', description: 'Tandai objek yang ingin dihapus dari foto.' },
  { title: 'Color Enhancer', subtitle: 'Warna lebih hidup', icon: 'color-palette-outline', color: '#FF8DA1', category: 'Foto AI', description: 'Buat warna foto tampak cerah dan seimbang.' },
  { title: 'AI Image Extender', subtitle: 'Perluas gambar', icon: 'expand-outline', color: '#68B8FF', category: 'Foto AI', description: 'Perluas kanvas foto untuk komposisi baru.' },
  { title: 'AI Styles', subtitle: 'Anime, cosplay, avatar', icon: 'brush-outline', color: '#B69AFF', category: 'Foto AI', description: 'Jelajahi gaya anime, kartun, dan avatar.' },
  { title: 'AI Live', subtitle: 'Hidupkan foto', icon: 'play-circle-outline', color: '#5DDBCF', category: 'Foto AI', description: 'Buat animasi singkat dari foto pilihanmu.' },
  { title: 'Video Collage', subtitle: 'Kolase video kreatif', icon: 'grid-outline', color: '#FFC36E', category: 'Video', description: 'Susun beberapa klip ke dalam layout kolase.' },
  { title: 'AI Stabilizer', subtitle: 'Video lebih stabil', icon: 'videocam-outline', color: '#68B8FF', category: 'Video', description: 'Kurangi guncangan dan buat video lebih mulus.' },
  { title: 'Video Makeup', subtitle: 'Makeup natural', icon: 'color-wand-outline', color: '#FF8DA1', category: 'Video', description: 'Coba tampilan makeup natural pada video.' },
  { title: 'Video Editor', subtitle: 'Filter & color grading', icon: 'film-outline', color: '#A78BFA', category: 'Video', description: 'Atur filter, crop, mirror, dan kecepatan klip.' },
];
const filters = ['Semua', 'Foto AI', 'Restorasi', 'Video'];
const navItems: { label: Tab; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Beranda', icon: 'home-outline' },
  { label: 'Jelajahi', icon: 'compass-outline' },
  { label: 'Proyek', icon: 'albums-outline' },
  { label: 'Saya', icon: 'person-outline' },
];

function ToolCard({ tool, onPress }: { tool: Tool; onPress: () => void }) {
  return (
    <Pressable style={styles.toolCard} onPress={onPress} accessibilityRole="button" accessibilityLabel={`${tool.title}, ${tool.subtitle}`}>
      <View style={[styles.toolIcon, { backgroundColor: `${tool.color}18` }]}>
        <Ionicons name={tool.icon} size={22} color={tool.color} />
      </View>
      <Text style={styles.toolTitle}>{tool.title}</Text>
      <Text style={styles.toolSubtitle}>{tool.subtitle}</Text>
      <View style={styles.toolArrow}><Ionicons name="arrow-up" size={13} color="#8E91A3" /></View>
    </Pressable>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('Beranda');
  const [category, setCategory] = useState('Semua');
  const [query, setQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedVideo, setSelectedVideo] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [intensity, setIntensity] = useState(75);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState(true);

  const filteredTools = useMemo(() => tools.filter((tool) => {
    const matchesCategory = category === 'Semua' || tool.category === category;
    const text = `${tool.title} ${tool.subtitle} ${tool.description}`.toLowerCase();
    return matchesCategory && text.includes(query.trim().toLowerCase());
  }), [category, query]);

  async function pickMedia(tool?: Tool) {
    const video = tool?.category === 'Video';
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Izin diperlukan', 'Izinkan akses galeri untuk memilih foto atau video yang ingin diedit.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: video ? ['videos'] : ['images'],
      allowsEditing: false,
      quality: 1,
    });
    if (result.canceled || !result.assets[0]) return;
    setSelectedImage(result.assets[0].uri);
    setSelectedVideo(video);
    setSelectedTool(tool ?? (video ? tools.find((item) => item.category === 'Video')! : tools[0]));
    setComplete(false);
    setIntensity(75);
  }

  function openTool(tool: Tool) {
    if (selectedImage) {
      setSelectedTool(tool);
      setSelectedVideo(tool.category === 'Video');
      setComplete(false);
    } else {
      void pickMedia(tool);
    }
  }

  function finishDemo() {
    if (processing || !selectedImage || !selectedTool) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setComplete(true);
      setProjects((current) => [{
        id: `${Date.now()}`,
        title: selectedTool.title,
        uri: selectedImage,
        isVideo: selectedVideo,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      }, ...current]);
    }, 900);
  }

  function openProject(project: Project) {
    const tool = tools.find((item) => item.title === project.title) ?? tools[0];
    setSelectedImage(project.uri);
    setSelectedVideo(project.isVideo);
    setSelectedTool(tool);
    setComplete(true);
  }

  function renderHome() {
    return (
      <>
        <LinearGradient colors={['#252044', '#171829', '#12141E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroGlow} />
          <View style={styles.heroCopy}>
            <View style={styles.eyebrow}><View style={styles.liveDot} /><Text style={styles.eyebrowText}>AI PHOTO STUDIO</Text></View>
            <Text style={styles.heroTitle}>Jadikan{ '\n' }momenmu <Text style={styles.purple}>luar biasa.</Text></Text>
            <Text style={styles.heroDescription}>Retouch, pulihkan, dan ciptakan visual baru dengan AI.</Text>
            <Pressable style={styles.primaryButton} onPress={() => void pickMedia()}>
              <Ionicons name="add" size={19} color="#fff" /><Text style={styles.primaryButtonText}>Mulai mengedit</Text><Ionicons name="arrow-forward" size={15} color="#fff" />
            </Pressable>
          </View>
          <View style={styles.heroArtwork}>
            <LinearGradient colors={['#DC9BFF', '#756BFF', '#4649A8']} style={styles.artOrb}><Ionicons name="person" size={76} color="#F8E7FF" /></LinearGradient>
            <View style={styles.artSparkle}><Ionicons name="sparkles" size={18} color="#FFD984" /></View>
            <View style={styles.artLabel}><Text style={styles.artLabelText}>AI MAGIC</Text></View>
          </View>
        </LinearGradient>

        <View style={styles.sectionHeading}>
          <View><Text style={styles.sectionTitle}>{tab === 'Jelajahi' ? 'Jelajahi semua tools' : 'Temukan keajaiban AI'}</Text><Text style={styles.sectionSub}>Alat kreatif untuk setiap momen</Text></View>
          {tab === 'Beranda' && <Pressable onPress={() => setTab('Jelajahi')}><Text style={styles.seeAll}>Lihat semua</Text></Pressable>}
        </View>
        {tab === 'Jelajahi' && <View style={styles.searchBox}><Ionicons name="search-outline" size={18} color="#858898" /><TextInput value={query} onChangeText={setQuery} placeholder="Cari fitur AI..." placeholderTextColor="#737687" style={styles.searchInput} returnKeyType="search" /></View>}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {filters.map((item) => <Pressable key={item} onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.chipActive]}><Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text></Pressable>)}
        </ScrollView>
        {filteredTools.length ? <View style={styles.toolGrid}>{filteredTools.map((tool) => <ToolCard key={tool.title} tool={tool} onPress={() => openTool(tool)} />)}</View> : <Text style={styles.noResults}>Tidak ada fitur yang cocok. Coba kata kunci lain.</Text>}
        {tab === 'Beranda' && <Pressable onPress={() => { setCategory('Foto AI'); setTab('Jelajahi'); }}><LinearGradient colors={['#242037', '#191A27']} style={styles.promoCard}><View style={styles.promoIcon}><Ionicons name="color-wand" size={20} color="#C5A8FF" /></View><View style={styles.promoCopy}><Text style={styles.promoTitle}>Dari foto biasa jadi karya</Text><Text style={styles.promoSub}>Coba gaya anime dan avatar AI</Text></View><Ionicons name="chevron-forward" size={18} color="#9B91BD" /></LinearGradient></Pressable>}
      </>
    );
  }

  function renderProjects() {
    return <>
      <View style={styles.pageTitleBlock}><Text style={styles.pageTitle}>Proyek saya</Text><Text style={styles.sectionSub}>Kreasi yang kamu buat di sesi ini</Text></View>
      {projects.length === 0 ? <View style={styles.emptyState}><View style={styles.emptyIcon}><Ionicons name="images-outline" size={30} color="#A98CFF" /></View><Text style={styles.emptyTitle}>Proyekmu menanti</Text><Text style={styles.emptyText}>Pilih foto atau video, lalu mulai berkreasi. Proyek demo akan muncul di sini.</Text><Pressable style={styles.primaryButton} onPress={() => void pickMedia()}><Ionicons name="add" size={18} color="#fff"/><Text style={styles.primaryButtonText}>Pilih media</Text></Pressable></View> : <View style={styles.projectGrid}>{projects.map((project) => <Pressable key={project.id} style={styles.projectCard} onPress={() => openProject(project)}>{project.isVideo ? <View style={styles.projectVideo}><Ionicons name="play-circle" size={34} color="#fff" /></View> : <Image source={{ uri: project.uri }} style={styles.projectImage} />}<Text style={styles.projectName}>{project.title}</Text><Text style={styles.projectDate}>{project.date} · Pratinjau demo</Text></Pressable>)}</View>}
      <Text style={styles.disclaimer}>Daftar ini hanya tersimpan selama aplikasi terbuka. Simpan ke galeri belum tersedia.</Text>
    </>;
  }

  function renderProfile() {
    return <>
      <View style={styles.pageTitleBlock}><Text style={styles.pageTitle}>Profil & pengaturan</Text><Text style={styles.sectionSub}>Atur pengalaman Zenix Box kamu</Text></View>
      <LinearGradient colors={['#292341', '#171923']} style={styles.profileCard}><View style={styles.profileAvatar}><Ionicons name="person" size={27} color="#D7C8FF" /></View><View style={styles.profileCopy}><Text style={styles.profileName}>Kreator Zenix</Text><Text style={styles.profileCaption}>Akun tamu · Mulai berkarya</Text></View><Ionicons name="chevron-forward" size={18} color="#A39BB8" /></LinearGradient>
      <Text style={styles.groupLabel}>PREFERENSI</Text>
      <View style={styles.settingsCard}><View style={styles.settingRow}><View style={styles.settingIcon}><Ionicons name="notifications-outline" size={19} color="#C0A8FF" /></View><View style={styles.settingText}><Text style={styles.settingTitle}>Notifikasi</Text><Text style={styles.settingSubtitle}>Info dan inspirasi kreatif</Text></View><Pressable onPress={() => setNotifications(!notifications)} style={[styles.switch, notifications && styles.switchOn]} accessibilityLabel="Toggle notifikasi"><View style={[styles.switchKnob, notifications && styles.switchKnobOn]} /></Pressable></View><View style={styles.settingDivider} /><Pressable style={styles.settingRow} onPress={() => Alert.alert('Privasi', 'Foto pilihan tetap berada di perangkat pada prototipe ini.') }><View style={styles.settingIcon}><Ionicons name="shield-checkmark-outline" size={19} color="#65D6C1" /></View><View style={styles.settingText}><Text style={styles.settingTitle}>Privasi & keamanan</Text><Text style={styles.settingSubtitle}>Pelajari cara media ditangani</Text></View><Ionicons name="chevron-forward" size={18} color="#727688" /></Pressable><View style={styles.settingDivider} /><Pressable style={styles.settingRow} onPress={() => Alert.alert('Bantuan', 'Hubungi tim Zenix Box untuk bantuan lebih lanjut.') }><View style={styles.settingIcon}><Ionicons name="help-circle-outline" size={19} color="#FFC36E" /></View><View style={styles.settingText}><Text style={styles.settingTitle}>Pusat bantuan</Text><Text style={styles.settingSubtitle}>Bantuan dan informasi aplikasi</Text></View><Ionicons name="chevron-forward" size={18} color="#727688" /></Pressable></View>
      <Pressable style={styles.proProfile} onPress={() => Alert.alert('Zenix Pro', 'Paket Pro akan tersedia setelah fitur berlangganan terintegrasi.')}><Ionicons name="diamond" size={19} color="#FFD279" /><Text style={styles.proProfileText}>Jelajahi Zenix Pro</Text><Ionicons name="chevron-forward" size={18} color="#9B91BD" /></Pressable>
      <Text style={styles.version}>Zenix Box · Versi 1.0.0 (Pratinjau)</Text>
    </>;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#090B12" />
      <View style={styles.page}>
        <View style={styles.header}>
          <Pressable style={styles.brandRow} onPress={() => setTab('Beranda')}><LinearGradient colors={['#9D75FF', '#6655F5']} style={styles.brandMark}><Ionicons name="sparkles" size={19} color="#fff" /></LinearGradient><Text style={styles.brand}>zenix<Text style={styles.brandAccent}>box</Text></Text></Pressable>
          <Pressable style={styles.proButton} onPress={() => Alert.alert('Zenix Pro', 'Paket Pro akan tersedia setelah fitur berlangganan terintegrasi.')}><Ionicons name="diamond" size={14} color="#FFD279" /><Text style={styles.proText}>PRO</Text></Pressable>
        </View>
        <ScrollView key={tab} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {tab === 'Beranda' || tab === 'Jelajahi' ? renderHome() : tab === 'Proyek' ? renderProjects() : renderProfile()}
          {(tab === 'Beranda' || tab === 'Jelajahi') && <Text style={styles.disclaimer}>Fitur AI ditampilkan sebagai pratinjau. Pemrosesan AI nyata memerlukan layanan backend.</Text>}
        </ScrollView>
        <View style={styles.tabBar}>{navItems.map((item) => { const active = tab === item.label; return <Pressable key={item.label} style={styles.tabItem} onPress={() => setTab(item.label)}><Ionicons name={active && item.label === 'Beranda' ? 'home' : item.icon} size={21} color={active ? '#B19AFF' : '#747789'} /><Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{item.label}</Text></Pressable>; })}</View>
      </View>

      <Modal visible={!!selectedImage && !!selectedTool} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelectedTool(null)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}><Pressable onPress={() => setSelectedTool(null)} style={styles.backButton}><Ionicons name="chevron-down" size={22} color="#fff" /></Pressable><Text style={styles.modalTitle}>Studio AI</Text><Pressable onPress={() => void pickMedia(selectedTool ?? undefined)}><Text style={styles.changeText}>Ganti media</Text></Pressable></View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {selectedImage && (selectedVideo ? <View style={styles.previewVideo}><Ionicons name="videocam" size={52} color="#C5B3FF" /><Text style={styles.videoLabel}>Pratinjau video</Text></View> : <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="cover" />)}
            <View style={styles.previewTag}><Ionicons name={selectedTool?.icon ?? 'sparkles'} size={15} color="#C3A6FF" /><Text style={styles.previewTagText}>{selectedTool?.title ?? 'AI Edit'}</Text></View>
            <Text style={styles.editTitle}>{complete ? 'Pratinjau tersimpan ✨' : 'Sempurnakan karyamu'}</Text>
            <Text style={styles.editDescription}>{complete ? 'Proyek demo ditambahkan ke tab Proyek. Untuk hasil AI sesungguhnya, hubungkan layanan backend.' : selectedTool?.description}</Text>
            <View style={styles.adjustCard}><View style={styles.adjustHeading}><Text style={styles.adjustTitle}>Intensitas</Text><Text style={styles.adjustValue}>{intensity}%</Text></View><View style={styles.sliderTrack}><View style={[styles.sliderFill, { width: `${intensity}%` }]} /><View style={[styles.sliderKnob, { left: `${Math.max(0, intensity - 2)}%` }]} /></View><View style={styles.intensityActions}><Pressable onPress={() => setIntensity(Math.max(0, intensity - 10))} style={styles.intensityButton}><Text style={styles.intensityText}>− Kurangi</Text></Pressable><Pressable onPress={() => setIntensity(Math.min(100, intensity + 10))} style={styles.intensityButton}><Text style={styles.intensityText}>Tambah +</Text></Pressable></View></View>
            <Pressable style={styles.applyButton} onPress={finishDemo} disabled={processing}><LinearGradient colors={['#9B76FF', '#6E62F5']} style={styles.applyGradient}><Ionicons name={processing ? 'sync' : complete ? 'checkmark-circle' : 'sparkles'} size={19} color="#fff" /><Text style={styles.applyText}>{processing ? 'Menyiapkan pratinjau…' : complete ? 'Buat pratinjau lagi' : 'Buat pratinjau demo'}</Text></LinearGradient></Pressable>
            <Text style={styles.demoNote}>Demo antarmuka saja — tidak ada hasil AI nyata yang diproses atau disimpan.</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#090B12' }, page: { flex: 1, backgroundColor: '#090B12' }, scrollContent: { paddingHorizontal: 20, paddingBottom: 28 },
  header: { height: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }, brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 }, brandMark: { height: 32, width: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, brand: { color: '#F6F4FC', fontSize: 21, fontWeight: '800', letterSpacing: -0.8 }, brandAccent: { color: '#A78BFA' }, proButton: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#252137', borderWidth: 1, borderColor: '#403552' }, proText: { color: '#FFD279', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  hero: { minHeight: 258, borderRadius: 24, overflow: 'hidden', padding: 21, flexDirection: 'row', marginTop: 8 }, heroGlow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: '#6651D4', opacity: 0.12, right: -30, top: -50 }, heroCopy: { flex: 1.15, zIndex: 2, justifyContent: 'center' }, eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 13 }, liveDot: { height: 6, width: 6, borderRadius: 3, backgroundColor: '#A88AFF' }, eyebrowText: { color: '#C4B4F7', fontSize: 9, fontWeight: '800', letterSpacing: 1.5 }, heroTitle: { color: '#FBF9FF', fontSize: 25, lineHeight: 31, fontWeight: '800', letterSpacing: -0.7 }, purple: { color: '#B9A1FF' }, heroDescription: { color: '#B2B0C2', fontSize: 11, lineHeight: 16, marginTop: 9, maxWidth: 190 }, primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingHorizontal: 12, height: 39, borderRadius: 13, backgroundColor: '#8065F6', alignSelf: 'flex-start', marginTop: 17 }, primaryButtonText: { color: '#fff', fontSize: 11, fontWeight: '700' }, heroArtwork: { flex: 0.8, alignItems: 'center', justifyContent: 'center', minWidth: 112 }, artOrb: { height: 125, width: 104, borderRadius: 55, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-7deg' }], borderWidth: 1, borderColor: '#D5B3FF' }, artSparkle: { position: 'absolute', right: 4, top: 39, backgroundColor: '#292543', borderRadius: 12, padding: 6 }, artLabel: { position: 'absolute', bottom: 30, left: 3, backgroundColor: '#222139', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 9, borderWidth: 1, borderColor: '#484166' }, artLabelText: { color: '#C5B3FF', fontSize: 8, fontWeight: '800', letterSpacing: 0.7 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 27, marginBottom: 14 }, sectionTitle: { color: '#F4F2FA', fontWeight: '700', fontSize: 16 }, sectionSub: { color: '#818496', fontSize: 11, marginTop: 4 }, seeAll: { color: '#B39BFF', fontSize: 11, fontWeight: '600' }, searchBox: { minHeight: 43, borderRadius: 13, backgroundColor: '#151722', borderWidth: 1, borderColor: '#292C39', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 9, marginBottom: 13 }, searchInput: { flex: 1, color: '#F4F2FA', fontSize: 12, paddingVertical: 9 }, chipRow: { gap: 8, paddingBottom: 15 }, chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: '#151722', borderWidth: 1, borderColor: '#222532' }, chipActive: { backgroundColor: '#30274A', borderColor: '#65529E' }, chipText: { color: '#9295A5', fontSize: 11, fontWeight: '600' }, chipTextActive: { color: '#D5C6FF' },
  toolGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 }, toolCard: { width: '48.3%', minHeight: 127, borderRadius: 17, backgroundColor: '#13151F', borderWidth: 1, borderColor: '#222532', padding: 13, position: 'relative' }, toolIcon: { width: 37, height: 37, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 11 }, toolTitle: { color: '#F0EEF7', fontSize: 12, fontWeight: '700' }, toolSubtitle: { color: '#858898', fontSize: 10, marginTop: 4 }, toolArrow: { position: 'absolute', top: 15, right: 13, height: 23, width: 23, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1C1F2A', transform: [{ rotate: '45deg' }] }, noResults: { color: '#999BAB', fontSize: 12, textAlign: 'center', paddingVertical: 35 },
  promoCard: { borderRadius: 17, marginTop: 17, padding: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#302A42' }, promoIcon: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#332A4B' }, promoCopy: { flex: 1, marginLeft: 12 }, promoTitle: { color: '#F0EDF8', fontWeight: '700', fontSize: 12 }, promoSub: { color: '#9292A2', fontSize: 10, marginTop: 4 }, disclaimer: { color: '#656979', fontSize: 9, lineHeight: 14, textAlign: 'center', marginTop: 20, paddingHorizontal: 12 },
  tabBar: { height: 63, backgroundColor: '#0E1018', borderTopWidth: 1, borderTopColor: '#1C1F2A', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingBottom: 4 }, tabItem: { alignItems: 'center', justifyContent: 'center', gap: 4, minWidth: 60 }, tabLabel: { color: '#747789', fontSize: 9 }, tabLabelActive: { color: '#B19AFF', fontWeight: '700' },
  pageTitleBlock: { marginTop: 18, marginBottom: 20 }, pageTitle: { color: '#F4F2FA', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }, emptyState: { minHeight: 370, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 }, emptyIcon: { width: 72, height: 72, borderRadius: 24, backgroundColor: '#211D33', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }, emptyTitle: { color: '#F4F2FA', fontWeight: '800', fontSize: 20 }, emptyText: { color: '#9294A3', fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: 9, maxWidth: 280 }, projectGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 }, projectCard: { width: '48.3%', backgroundColor: '#13151F', borderRadius: 16, padding: 9, borderWidth: 1, borderColor: '#222532' }, projectImage: { width: '100%', height: 145, borderRadius: 11, backgroundColor: '#202330' }, projectVideo: { width: '100%', height: 145, borderRadius: 11, backgroundColor: '#292342', alignItems: 'center', justifyContent: 'center' }, projectName: { color: '#F0EEF7', fontWeight: '700', fontSize: 12, marginTop: 10 }, projectDate: { color: '#858898', fontSize: 9, marginTop: 4 },
  profileCard: { borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#302A42' }, profileAvatar: { height: 52, width: 52, borderRadius: 18, backgroundColor: '#403360', alignItems: 'center', justifyContent: 'center' }, profileCopy: { flex: 1, marginLeft: 13 }, profileName: { color: '#F2EFF8', fontSize: 14, fontWeight: '700' }, profileCaption: { color: '#9292A2', fontSize: 10, marginTop: 5 }, groupLabel: { color: '#858898', fontSize: 10, fontWeight: '700', letterSpacing: 1.4, marginTop: 27, marginBottom: 10 }, settingsCard: { borderRadius: 17, paddingHorizontal: 14, backgroundColor: '#13151F', borderWidth: 1, borderColor: '#222532' }, settingRow: { minHeight: 69, flexDirection: 'row', alignItems: 'center' }, settingIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: '#222033', alignItems: 'center', justifyContent: 'center' }, settingText: { flex: 1, marginLeft: 11 }, settingTitle: { color: '#F0EEF7', fontSize: 12, fontWeight: '600' }, settingSubtitle: { color: '#858898', fontSize: 10, marginTop: 4 }, settingDivider: { height: 1, backgroundColor: '#252835', marginLeft: 47 }, switch: { width: 39, height: 23, borderRadius: 12, backgroundColor: '#383B49', padding: 3, justifyContent: 'center' }, switchOn: { backgroundColor: '#765FCE' }, switchKnob: { width: 17, height: 17, borderRadius: 9, backgroundColor: '#C9CBD5' }, switchKnobOn: { alignSelf: 'flex-end', backgroundColor: '#fff' }, proProfile: { marginTop: 17, minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 14, borderRadius: 15, backgroundColor: '#211D2E', borderWidth: 1, borderColor: '#403552' }, proProfileText: { flex: 1, color: '#F1E9D8', fontSize: 12, fontWeight: '700' }, version: { color: '#656979', fontSize: 10, textAlign: 'center', marginTop: 25, marginBottom: 20 },
  modalSafe: { flex: 1, backgroundColor: '#0B0D14' }, modalHeader: { height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }, backButton: { height: 35, width: 35, borderRadius: 12, backgroundColor: '#1B1E29', alignItems: 'center', justifyContent: 'center' }, modalTitle: { color: '#F4F2FA', fontWeight: '700', fontSize: 15 }, changeText: { color: '#B39BFF', fontSize: 12, fontWeight: '600' }, modalContent: { padding: 20, alignItems: 'stretch' }, previewImage: { width: '100%', height: 310, borderRadius: 22, backgroundColor: '#191C27' }, previewVideo: { width: '100%', height: 260, borderRadius: 22, backgroundColor: '#201D31', alignItems: 'center', justifyContent: 'center' }, videoLabel: { color: '#D5C6FF', fontSize: 12, marginTop: 10 }, previewTag: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 20, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 12, backgroundColor: '#211C31' }, previewTagText: { color: '#D4C5FF', fontSize: 11, fontWeight: '700' }, editTitle: { color: '#F8F6FC', fontSize: 22, fontWeight: '800', marginTop: 16 }, editDescription: { color: '#9598A8', fontSize: 12, lineHeight: 19, marginTop: 7 }, adjustCard: { marginTop: 23, backgroundColor: '#151822', borderWidth: 1, borderColor: '#252936', borderRadius: 17, padding: 16 }, adjustHeading: { flexDirection: 'row', justifyContent: 'space-between' }, adjustTitle: { color: '#E8E6EF', fontSize: 12, fontWeight: '700' }, adjustValue: { color: '#B9A2FF', fontSize: 11, fontWeight: '700' }, sliderTrack: { height: 5, backgroundColor: '#323544', borderRadius: 5, marginTop: 17 }, sliderFill: { height: 5, backgroundColor: '#9477F7', borderRadius: 5 }, sliderKnob: { position: 'absolute', top: -5, width: 15, height: 15, borderRadius: 8, backgroundColor: '#F3EDFF', borderWidth: 3, borderColor: '#9477F7' }, intensityActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 13 }, intensityButton: { paddingVertical: 5, paddingHorizontal: 8, borderRadius: 8, backgroundColor: '#202330' }, intensityText: { color: '#B9A2FF', fontSize: 10, fontWeight: '600' }, applyButton: { marginTop: 19, borderRadius: 15, overflow: 'hidden' }, applyGradient: { height: 51, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }, applyText: { color: '#fff', fontSize: 13, fontWeight: '700' }, demoNote: { textAlign: 'center', color: '#656979', fontSize: 10, marginTop: 11 },
});
