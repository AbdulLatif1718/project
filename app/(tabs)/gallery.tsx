import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView, Alert, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Upload, X, Camera, CheckCircle, AlertCircle, Image as ImageIcon, Zap } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useImageStore } from '@/stores/imageStore';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function GalleryScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageAnalyzing, setImageAnalyzing] = useState(false);
  const { image, setImage, clearImage } = useImageStore();

  const pickImage = async () => {
    try {
      setIsLoading(true);
      
      // Request permissions first
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (image) {
      setImageAnalyzing(true);
      // Simulate analysis time
      setTimeout(() => {
        setImageAnalyzing(false);
        router.push('/results');
      }, 1500);
    }
  };

  const takePhoto = () => {
    router.push('/camera');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <LinearGradient
          colors={['#f8fafc', '#e2e8f0']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <ImageIcon size={24} color="#3b82f6" />
            </View>
            <Text style={styles.title}>Select Image</Text>
            <Text style={styles.subtitle}>
              Choose a blood smear image from your gallery for AI analysis
            </Text>
          </View>
        </LinearGradient>

        {/* Image Upload Area */}
        <View style={styles.imageSection}>
          {image ? (
            <View style={styles.selectedImageContainer}>
              <Image
                source={{ uri: image }}
                style={styles.selectedImage}
                resizeMode="contain"
              />
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={clearImage}
                activeOpacity={0.8}
              >
                <X size={18} color="#ffffff" />
              </TouchableOpacity>
              
              {/* Image Quality Indicator */}
              <View style={styles.qualityIndicator}>
                <CheckCircle size={16} color="#10b981" />
                <Text style={styles.qualityText}>Good Quality</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.uploadArea} 
              onPress={pickImage}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <View style={styles.uploadContent}>
                {isLoading ? (
                  <>
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text style={styles.loadingText}>Loading...</Text>
                  </>
                ) : (
                  <>
                    <View style={styles.uploadIconContainer}>
                      <Upload size={40} color="#3b82f6" />
                    </View>
                    <Text style={styles.uploadTitle}>Tap to Select Image</Text>
                    <Text style={styles.uploadSubtext}>
                      Choose from your photo library
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {!image ? (
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={styles.primaryButton} 
                onPress={pickImage}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#3b82f6', '#2563eb']}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <ImageIcon size={20} color="#ffffff" />
                      <Text style={styles.primaryButtonText}>Browse Gallery</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={takePhoto}
                activeOpacity={0.8}
              >
                <Camera size={18} color="#3b82f6" />
                <Text style={styles.secondaryButtonText}>Take Photo Instead</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={styles.analyzeButton} 
                onPress={handleAnalyze}
                disabled={imageAnalyzing}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.buttonGradient}
                >
                  {imageAnalyzing ? (
                    <>
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text style={styles.analyzeButtonText}>Analyzing...</Text>
                    </>
                  ) : (
                    <>
                      <Zap size={20} color="#ffffff" />
                      <Text style={styles.analyzeButtonText}>Analyze Image</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={pickImage}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <ImageIcon size={18} color="#3b82f6" />
                <Text style={styles.secondaryButtonText}>Select Different Image</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Requirements Section */}
        <View style={styles.requirementsSection}>
          <View style={styles.requirementsHeader}>
            <AlertCircle size={20} color="#f59e0b" />
            <Text style={styles.requirementsTitle}>Image Quality Guidelines</Text>
          </View>
          
          <View style={styles.requirementsList}>
            {[
              { text: 'Clear, well-focused blood smear image', icon: '📸' },
              { text: 'Proper lighting without shadows', icon: '💡' },
              { text: 'Correctly stained blood sample', icon: '🔬' },
              { text: 'Minimal background artifacts', icon: '✨' },
              { text: 'High resolution (recommended)', icon: '🎯' }
            ].map((requirement, index) => (
              <View key={index} style={styles.requirementItem}>
                <Text style={styles.requirementIcon}>{requirement.icon}</Text>
                <Text style={styles.requirementText}>{requirement.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipTitle}>💡 Pro Tip</Text>
            </View>
            <Text style={styles.tipText}>
              For best results, use images taken with proper microscopy equipment under controlled lighting conditions.
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
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 26,
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  // Image Section
  imageSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  selectedImageContainer: {
    aspectRatio: 4/3,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  clearButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qualityIndicator: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  qualityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#10b981',
  },

  // Upload Area
  uploadArea: {
    aspectRatio: 4/3,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1f2937',
    marginBottom: 8,
  },
  uploadSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#3b82f6',
    marginTop: 12,
  },

  // Action Section
  actionSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  buttonGroup: {
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  analyzeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  primaryButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#ffffff',
  },
  analyzeButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#3b82f6',
  },

  // Requirements Section
  requirementsSection: {
    paddingHorizontal: 20,
  },
  requirementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  requirementsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1f2937',
  },
  requirementsList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  requirementIcon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  requirementText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    marginBottom: 32,
  },
  tipHeader: {
    marginBottom: 8,
  },
  tipTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#92400e',
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#78350f',
    lineHeight: 18,
  },
});