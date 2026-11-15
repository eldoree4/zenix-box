import React, { useState } from 'react';
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
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

type Tool = { title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap; color: string; category: string };

const tools: Tool[] = [
  { title: 'AI 4K', subtitle: 'Tingkatkan resolusi', icon: 'scan-outline', color: '#A78BFA', category: 'TOOLS AI' },
  { title: 'AI Retouch', subtitle: 'Kulit tampak halus', icon: 'sparkles-outline', color: '#FF8DA1', category: 'TOOLS AI' },
  { title: 'Face Enhancer', subtitle: 'Pulihkan detail wajah', icon: 'happy-outline', color: '#65D6C1', category: 'TOOLS AI' },
  { title: 'AI Removal', subtitle: 'Hapus objek', icon: 'cut-outline', color: '#FFC36E', category: 'TOOLS AI' },
  { title: 'Color Enhancer', subtitle: 'Warna lebih hidup', icon: 'color-palette-outline', color: '#FF8DA1', category: 'TOOLS AI' },
  { title: 'AI Image Extender', subtitle: 'Perluas gambar', icon: 'expand-outline', color: '#68B8FF', category: 'TOOLS AI' },
  { title: 'AI Styles', subtitle: 'Anime, cosplay, avatar', icon: 'brush-outline', color: '#B69AFF', category: 'TOOLS AI' },
  { title: 'AI Live', subtitle: 'Hidupkan foto', icon: 'play-circle-outline', color: '#5DDBCF', category: 'TOOLS AI' },
  { title: 'Video Collage', subtitle: 'Kolase video kreatif', icon: 'grid-outline', color: '#FFC36E', category: 'VIDEO' },
  { title: 'AI Stabilizer', subtitle: 'Video lebih stabil', icon: 'videocam-outline', color: '#68B8FF', category: 'VIDEO' },
  { title: 'Video Makeup', subtitle: 'Makeup natural', icon: 'color-wand-outline', color: '#FF8DA1', category: 'VIDEO' },
  { title: 'Video Editor', subtitle: 'Filter & color grading', icon: 'film-outline', color: '#A78BFA', category: 'VIDEO' },
];

const categories = ['Semua', 'Foto AI', 'Restorasi', 'Video'];

export default function App() {
  const [tab, setTab] = useState('Beranda');
  const [category, setCategory] = useState('Semua');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);

  const filteredTools = tools.filter((tool) => {
    if (category === 'Foto AI') return tool.category === 'TOOLS AI';
    if (category === 'Video') return tool.category === 'VIDEO';
    if (category === 'Restorasi') return ['AI 4K', 'Face Enhancer', 'AI Stabilizer'].includes(tool.title);
    return true;
  });

  async function pickImage(tool?: Tool) {
    if (tool) setSelectedTool(tool);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Izin diperlukan', 'Izinkan akses galeri untuk memilih foto atau video yang ingin diedit.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      setComplete(false);
      setSelectedTool(tool ?? tools[0]);
    }
  }

  function openTool(tool: Tool) {
    if (selectedImage) {
      setSelectedTool(tool);
      setComplete(false);
    } else {
      void pickImage(tool);
    }
  }

  function runDemo() {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setComplete(true);
    }, 1400);
  }

  const navItems: { label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { label: 'Beranda', icon: 'home' },
    { label: 'Jelajahi', icon: 'compass-outline' },
    { label: 'Proyek', icon: 'albums-outline' },
    { label: 'Saya', icon: 'person-outline' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#090B12" />
      <View style={styles.page}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <LinearGradient colors={['#9D75FF', '#6655F5']} style={styles.brandMark}>
                <Ionicons name="sparkles" size={19} color="#fff" />
              </LinearGradient>
              <Text style={styles.brand}>zenix<Text style={styles.brandAccent}>box</Text></Text>
            </View>
            <Pressable style={styles.proButton} onPress={() => Alert.alert('Zenix Pro', 'Paket Pro akan segera hadir.') }>
              <Ionicons name="diamond" size={14} color="#FFD279" />
              <Text style={styles.proText}>PRO</Text>
            </Pressable>
          </View>

          {tab === 'Beranda' || tab === 'Jelajahi' ? (
            <>
              <LinearGradient colors={['#252044', '#171829', '#12141E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
                <View style={styles.heroGlow} />
                <View style={styles.heroCopy}>
                  <View style={styles.eyebrow}><View style={styles.liveDot} /><Text style={styles.eyebrowText}>AI PHOTO STUDIO</Text></View>
                  <Text style={styles.heroTitle}>Jadikan{ '\n' }momenmu <Text style={styles.purple}>luar biasa.</Text></Text>
                  <Text style={styles.heroDescription}>Retouch, pulihkan, dan ciptakan visual baru dengan AI.</Text>
                  <Pressable style={styles.primaryButton} onPress={() => void pickImage()}>
                    <Ionicons name="add" size={19} color="#fff" />
                    <Text style={styles.primaryButtonText}>Mulai mengedit</Text>
                    <Ionicons name="arrow-forward" size={15} color="#fff" />
                  </Pressable>
                </View>
                <View style={styles.heroArtwork}>
                  <LinearGradient colors={['#DC9BFF', '#756BFF', '#4649A8']} style={styles.artOrb}>
                    <Ionicons name="person" size={76} color="#F8E7FF" />
                  </LinearGradient>
                  <View style={styles.artSparkle}><Ionicons name="sparkles" size={18} color="#FFD984" /></View>
                  <View style={styles.artLabel}><Text style={styles.artLabelText}>AI MAGIC</Text></View>
                </View>
              </LinearGradient>

              <View style={styles.sectionHeading}>
                <View><Text style={styles.sectionTitle}>Temukan keajaiban AI</Text><Text style={styles.sectionSub}>Alat kreatif untuk setiap momen</Text></View>
                <Pressable onPress={() => setTab('Jelajahi')}><Text style={styles.seeAll}>Lihat semua</Text></Pressable>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                {categories.map((item) => (
                  <Pressable key={item} onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.chipActive]}>
                    <Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              <View style={styles.toolGrid}>
                {filteredTools.map((tool) => (
                  <Pressable key={tool.title} style={styles.toolCard} onPress={() => openTool(tool)}>
                    <View style={[styles.toolIcon, { backgroundColor: `${tool.color}18` }]}>
                      <Ionicons name={tool.icon} size={22} color={tool.color} />
                    </View>
                    <Text style={styles.toolTitle}>{tool.title}</Text>
                    <Text style={styles.toolSubtitle}>{tool.subtitle}</Text>
                    <View style={styles.toolArrow}><Ionicons name="arrow-up" size={13} color="#8E91A3" /></View>
                  </Pressable>
                ))}
              </View>

              <LinearGradient colors={['#242037', '#191A27']} style={styles.promoCard}>
                <View style={styles.promoIcon}><Ionicons name="color-wand" size={20} color="#C5A8FF" /></View>
                <View style={styles.promoCopy}><Text style={styles.promoTitle}>Dari foto biasa jadi karya</Text><Text style={styles.promoSub}>Coba gaya anime dan avatar AI</Text></View>
                <Ionicons name="chevron-forward" size={18} color="#9B91BD" />
              </LinearGradient>
            </>
          ) : tab === 'Proyek' ? (
            <View style={styles.emptyState}><View style={styles.emptyIcon}><Ionicons name="images-outline" size={30} color="#A98CFF" /></View><Text style={styles.emptyTitle}>Proyekmu menanti</Text><Text style={styles.emptyText}>Foto dan video yang kamu edit akan tampil di sini.</Text><Pressable style={styles.primaryButton} onPress={() => void pickImage()}><Ionicons name="add" size={18} color="#fff"/><Text style={styles.primaryButtonText}>Pilih media</Text></Pressable></View>
          ) : (
            <View style={styles.emptyState}><View style={styles.emptyIcon}><Ionicons name="person-circle-outline" size={34} color="#A98CFF" /></View><Text style={styles.emptyTitle}>Ruang kreatifmu</Text><Text style={styles.emptyText}>Masuk dan simpan semua kreasi favoritmu di satu tempat.</Text><Pressable style={styles.primaryButton} onPress={() => Alert.alert('Segera hadir', 'Fitur akun Zenix sedang disiapkan.')}><Text style={styles.primaryButtonText}>Segera hadir</Text></Pressable></View>
          )}
          <Text style={styles.disclaimer}>Fitur AI ditampilkan sebagai pratinjau. Pemrosesan AI nyata memerlukan layanan backend.</Text>
        </ScrollView>

        <View style={styles.tabBar}>
          {navItems.map((item) => {
            const active = tab === item.label;
            return <Pressable key={item.label} style={styles.tabItem} onPress={() => setTab(item.label)}><Ionicons name={active && item.label === 'Beranda' ? 'home' : item.icon} size={21} color={active ? '#B19AFF' : '#747789'} /><Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{item.label}</Text></Pressable>;
          })}
        </View>
      </View>

      <Modal visible={!!selectedImage && !!selectedTool} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelectedTool(null)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}><Pressable onPress={() => setSelectedTool(null)} style={styles.backButton}><Ionicons name="chevron-down" size={22} color="#fff" /></Pressable><Text style={styles.modalTitle}>Studio AI</Text><Pressable onPress={() => void pickImage(selectedTool ?? undefined)}><Text style={styles.changeText}>Ganti foto</Text></Pressable></View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {selectedImage ? <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="cover" /> : null}
            <View style={styles.previewTag}><Ionicons name={selectedTool?.icon ?? 'sparkles'} size={15} color="#C3A6FF" /><Text style={styles.previewTagText}>{selectedTool?.title ?? 'AI Edit'}</Text></View>
            <Text style={styles.editTitle}>{complete ? 'Siap untuk bersinar ✨' : 'Sempurnakan fotomu'}</Text>
            <Text style={styles.editDescription}>{complete ? 'Pratinjau demo selesai. Hubungkan layanan AI untuk menghasilkan hasil edit sesungguhnya.' : `Atur ${selectedTool?.title ?? 'efek AI'} dan lihat pratinjau editanmu.`}</Text>
            <View style={styles.adjustCard}><View style={styles.adjustHeading}><Text style={styles.adjustTitle}>Intensitas</Text><Text style={styles.adjustValue}>75%</Text></View><View style={styles.sliderTrack}><View style={styles.sliderFill} /><View style={styles.sliderKnob} /></View><View style={styles.adjustFoot}><Text style={styles.adjustHint}>Natural</Text><Text style={styles.adjustHint}>Ekstra</Text></View></View>
            <Pressable style={styles.applyButton} onPress={runDemo} disabled={processing}><LinearGradient colors={['#9B76FF', '#6E62F5']} style={styles.applyGradient}><Ionicons name={processing ? 'sync' : complete ? 'checkmark-circle' : 'sparkles'} size={19} color="#fff" /><Text style={styles.applyText}>{processing ? 'Memproses pratinjau…' : complete ? 'Pratinjau selesai' : 'Coba pratinjau demo'}</Text></LinearGradient></Pressable>
            <Text style={styles.demoNote}>Demo antarmuka saja — hasil AI belum diproses atau disimpan.</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#090B12' }, page: { flex: 1, backgroundColor: '#090B12' }, scrollContent: { paddingHorizontal: 20, paddingBottom: 28 },
  header: { height: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 }, brandMark: { height: 32, width: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, brand: { color: '#F6F4FC', fontSize: 21, fontWeight: '800', letterSpacing: -0.8 }, brandAccent: { color: '#A78BFA' }, proButton: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#252137', borderWidth: 1, borderColor: '#403552' }, proText: { color: '#FFD279', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  hero: { minHeight: 258, borderRadius: 24, overflow: 'hidden', padding: 21, flexDirection: 'row', marginTop: 8 }, heroGlow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: '#6651D4', opacity: 0.12, right: -30, top: -50 }, heroCopy: { flex: 1.15, zIndex: 2, justifyContent: 'center' }, eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 13 }, liveDot: { height: 6, width: 6, borderRadius: 3, backgroundColor: '#A88AFF' }, eyebrowText: { color: '#C4B4F7', fontSize: 9, fontWeight: '800', letterSpacing: 1.5 }, heroTitle: { color: '#FBF9FF', fontSize: 25, lineHeight: 31, fontWeight: '800', letterSpacing: -0.7 }, purple: { color: '#B9A1FF' }, heroDescription: { color: '#B2B0C2', fontSize: 11, lineHeight: 16, marginTop: 9, maxWidth: 190 }, primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingHorizontal: 12, height: 39, borderRadius: 13, backgroundColor: '#8065F6', alignSelf: 'flex-start', marginTop: 17 }, primaryButtonText: { color: '#fff', fontSize: 11, fontWeight: '700' }, heroArtwork: { flex: 0.8, alignItems: 'center', justifyContent: 'center', minWidth: 112 }, artOrb: { height: 125, width: 104, borderRadius: 55, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-7deg' }], borderWidth: 1, borderColor: '#D5B3FF' }, artSparkle: { position: 'absolute', right: 4, top: 39, backgroundColor: '#292543', borderRadius: 12, padding: 6 }, artLabel: { position: 'absolute', bottom: 30, left: 3, backgroundColor: '#222139', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 9, borderWidth: 1, borderColor: '#484166' }, artLabelText: { color: '#C5B3FF', fontSize: 8, fontWeight: '800', letterSpacing: 0.7 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 27, marginBottom: 14 }, sectionTitle: { color: '#F4F2FA', fontWeight: '700', fontSize: 16 }, sectionSub: { color: '#818496', fontSize: 11, marginTop: 4 }, seeAll: { color: '#B39BFF', fontSize: 11, fontWeight: '600' }, chipRow: { gap: 8, paddingBottom: 15 }, chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: '#151722', borderWidth: 1, borderColor: '#222532' }, chipActive: { backgroundColor: '#30274A', borderColor: '#65529E' }, chipText: { color: '#9295A5', fontSize: 11, fontWeight: '600' }, chipTextActive: { color: '#D5C6FF' },
  toolGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 }, toolCard: { width: '48.3%', minHeight: 127, borderRadius: 17, backgroundColor: '#13151F', borderWidth: 1, borderColor: '#222532', padding: 13, position: 'relative' }, toolIcon: { width: 37, height: 37, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 11 }, toolTitle: { color: '#F0EEF7', fontSize: 12, fontWeight: '700' }, toolSubtitle: { color: '#858898', fontSize: 10, marginTop: 4 }, toolArrow: { position: 'absolute', top: 15, right: 13, height: 23, width: 23, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1C1F2A', transform: [{ rotate: '45deg' }] },
  promoCard: { borderRadius: 17, marginTop: 17, padding: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#302A42' }, promoIcon: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#332A4B' }, promoCopy: { flex: 1, marginLeft: 12 }, promoTitle: { color: '#F0EDF8', fontWeight: '700', fontSize: 12 }, promoSub: { color: '#9292A2', fontSize: 10, marginTop: 4 }, disclaimer: { color: '#565A6A', fontSize: 9, lineHeight: 14, textAlign: 'center', marginTop: 20, paddingHorizontal: 12 },
  tabBar: { height: 63, backgroundColor: '#0E1018', borderTopWidth: 1, borderTopColor: '#1C1F2A', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingBottom: 4 }, tabItem: { alignItems: 'center', justifyContent: 'center', gap: 4, minWidth: 60 }, tabLabel: { color: '#747789', fontSize: 9 }, tabLabelActive: { color: '#B19AFF', fontWeight: '700' },
  emptyState: { minHeight: 430, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 }, emptyIcon: { width: 72, height: 72, borderRadius: 24, backgroundColor: '#211D33', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }, emptyTitle: { color: '#F4F2FA', fontWeight: '800', fontSize: 20 }, emptyText: { color: '#9294A3', fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: 9, maxWidth: 280 },
  modalSafe: { flex: 1, backgroundColor: '#0B0D14' }, modalHeader: { height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }, backButton: { height: 35, width: 35, borderRadius: 12, backgroundColor: '#1B1E29', alignItems: 'center', justifyContent: 'center' }, modalTitle: { color: '#F4F2FA', fontWeight: '700', fontSize: 15 }, changeText: { color: '#B39BFF', fontSize: 12, fontWeight: '600' }, modalContent: { padding: 20, alignItems: 'stretch' }, previewImage: { width: '100%', height: 310, borderRadius: 22, backgroundColor: '#191C27' }, previewTag: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 20, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 12, backgroundColor: '#211C31' }, previewTagText: { color: '#D4C5FF', fontSize: 11, fontWeight: '700' }, editTitle: { color: '#F8F6FC', fontSize: 22, fontWeight: '800', marginTop: 16 }, editDescription: { color: '#9598A8', fontSize: 12, lineHeight: 19, marginTop: 7 }, adjustCard: { marginTop: 23, backgroundColor: '#151822', borderWidth: 1, borderColor: '#252936', borderRadius: 17, padding: 16 }, adjustHeading: { flexDirection: 'row', justifyContent: 'space-between' }, adjustTitle: { color: '#E8E6EF', fontSize: 12, fontWeight: '700' }, adjustValue: { color: '#B9A2FF', fontSize: 11, fontWeight: '700' }, sliderTrack: { height: 5, backgroundColor: '#323544', borderRadius: 5, marginTop: 17 }, sliderFill: { height: 5, width: '75%', backgroundColor: '#9477F7', borderRadius: 5 }, sliderKnob: { position: 'absolute', left: '73%', top: -5, width: 15, height: 15, borderRadius: 8, backgroundColor: '#F3EDFF', borderWidth: 3, borderColor: '#9477F7' }, adjustFoot: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 9 }, adjustHint: { color: '#767A8A', fontSize: 10 }, applyButton: { marginTop: 19, borderRadius: 15, overflow: 'hidden' }, applyGradient: { height: 51, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }, applyText: { color: '#fff', fontSize: 13, fontWeight: '700' }, demoNote: { textAlign: 'center', color: '#656979', fontSize: 10, marginTop: 11 },
});
