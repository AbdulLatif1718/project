import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Image as ImageIcon, Info, Zap, Shield, Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Gradient Background */}
        <LinearGradient
          colors={['#1e40af', '#3b82f6', '#60a5fa']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Shield size={28} color="#ffffff" />
              </View>
              <View>
                <Text style={styles.appName}>MalariaScan</Text>
                <Text style={styles.tagline}>AI-Powered Detection</Text>
              </View>
            </View>
            <Text style={styles.subTitle}>
              Rapid malaria parasite detection from blood smears
            </Text>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Zap size={20} color="#10b981" />
            <Text style={styles.statNumber}>30s</Text>
            <Text style={styles.statLabel}>Analysis Time</Text>
          </View>
          <View style={styles.statCard}>
            <Shield size={20} color="#3b82f6" />
            <Text style={styles.statNumber}>95%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={20} color="#f59e0b" />
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
        </View>

        {/* Main Action Cards */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>How would you like to start?</Text>
          
          <View style={styles.primaryActions}>
            <TouchableOpacity 
              style={[styles.primaryCard, styles.cameraCard]} 
              onPress={() => router.push('/camera')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.primaryCardContent}>
                  <Camera size={40} color="#ffffff" />
                  <Text style={styles.primaryCardTitle}>Capture New Image</Text>
                  <Text style={styles.primaryCardDescription}>
                    Take a fresh photo of blood smear
                  </Text>
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>RECOMMENDED</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.primaryCard, styles.galleryCard]} 
              onPress={() => router.push('/gallery')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#8b5cf6', '#7c3aed']}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.primaryCardContent}>
                  <ImageIcon size={40} color="#ffffff" />
                  <Text style={styles.primaryCardTitle}>Upload from Gallery</Text>
                  <Text style={styles.primaryCardDescription}>
                    Select existing blood smear image
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Secondary Action */}
          <TouchableOpacity 
            style={styles.secondaryCard} 
            onPress={() => router.push('/resources')}
            activeOpacity={0.9}
          >
            <View style={styles.secondaryIcon}>
              <Info size={24} color="#3b82f6" />
            </View>
            <View style={styles.secondaryContent}>
              <Text style={styles.secondaryTitle}>Learn About Malaria Detection</Text>
              <Text style={styles.secondaryDescription}>
                Resources, guides, and best practices
              </Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Enhanced Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>How It Works</Text>
          </View>
          
          <View style={styles.processSteps}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Capture or upload blood smear image</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>AI analyzes for malaria parasites</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Get instant results and recommendations</Text>
            </View>
          </View>

          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerTitle}>Important Notice</Text>
            <Text style={styles.disclaimer}>
              This app is a screening tool to assist healthcare professionals. 
              Always consult qualified medical personnel for final diagnosis and treatment decisions.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    paddingBottom: 30,
  },
  
  // Header Styles
  headerGradient: {
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 26,
    color: '#ffffff',
  },
  tagline: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },

  // Stats Section
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 30,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },

  // Actions Section
  actionsContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#1f2937',
    marginBottom: 20,
  },
  primaryActions: {
    gap: 16,
    marginBottom: 20,
  },
  primaryCard: {
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  cameraCard: {
    
  },
  galleryCard: {
    
  },
  cardGradient: {
    flex: 1,
  },
  primaryCardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  primaryCardTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  primaryCardDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recommendedText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#ffffff',
    letterSpacing: 0.5,
  },

  // Secondary Action
  secondaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  secondaryContent: {
    flex: 1,
  },
  secondaryTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 2,
  },
  secondaryDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  arrow: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#3b82f6',
  },

  // Info Section
  infoSection: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  infoHeader: {
    marginBottom: 24,
  },
  infoTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1f2937',
  },
  processSteps: {
    marginBottom: 24,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#ffffff',
  },
  stepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#374151',
    flex: 1,
    lineHeight: 22,
  },
  disclaimerCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    marginBottom: 32,
  },
  disclaimerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#92400e',
    marginBottom: 8,
  },
  disclaimer: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#78350f',
    lineHeight: 18,
  },
});