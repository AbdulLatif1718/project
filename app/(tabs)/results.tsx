import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Save, ArrowLeft, AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useImageStore } from '@/stores/imageStore';
import { analyzeImage } from '@/services/modelService';
import { Detection } from '@/types/detection';
import DetectionOverlay from '@/components/DetectionOverlay';
import { StatusBar } from 'expo-status-bar';

export default function ResultsScreen() {
  const { image } = useImageStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);
  
  useEffect(() => {
    const processImage = async () => {
      if (!image) {
        router.replace('/');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Process the image using our model service
        const results = await analyzeImage(image);
        setDetections(results);
        
        if (results.length > 0) {
          setSelectedDetection(results[0]);
        }
      } catch (err) {
        console.error('Error analyzing image:', err);
        setError('Failed to analyze the image. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    processImage();
  }, [image]);
  
  if (!image) {
    router.replace('/');
    return null;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Analysis Results</Text>
        <TouchableOpacity style={styles.saveButton}>
          <Save size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: image }} 
            style={styles.image} 
            resizeMode="contain" 
          />
          
          {!loading && !error && detections.length > 0 && (
            <DetectionOverlay 
              detections={detections} 
              selectedId={selectedDetection?.id} 
              onSelectDetection={setSelectedDetection}
            />
          )}
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Analyzing image...</Text>
            <Text style={styles.loadingSubtext}>
              This may take a few moments
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <AlertTriangle size={48} color={Colors.error} />
            <Text style={styles.errorTitle}>Analysis Failed</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : detections.length === 0 ? (
          <View style={styles.noDetectionsContainer}>
            <Text style={styles.noDetectionsTitle}>No Parasites Detected</Text>
            <Text style={styles.noDetectionsText}>
              No malaria parasites were detected in this image. However, this does not rule out infection.
              Always consult with a healthcare professional for proper diagnosis.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                Detected Parasites: {detections.length}
              </Text>
              <Text style={styles.resultsSubtitle}>
                Tap on a detection in the image to view details
              </Text>
            </View>
            
            {selectedDetection && (
              <View style={styles.detailCard}>
                <Text style={styles.detailTitle}>
                  Detection #{selectedDetection.id}
                </Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type:</Text>
                  <Text style={styles.detailValue}>
                    {selectedDetection.class}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Confidence:</Text>
                  <Text style={styles.detailValue}>
                    {Math.round(selectedDetection.confidence * 100)}%
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>
                    X: {Math.round(selectedDetection.bbox.x)}, 
                    Y: {Math.round(selectedDetection.bbox.y)}
                  </Text>
                </View>
              </View>
            )}
            
            <View style={styles.detectionsList}>
              <Text style={styles.detectionsListTitle}>All Detections</Text>
              {detections.map((detection) => (
                <TouchableOpacity
                  key={detection.id}
                  style={[
                    styles.detectionItem,
                    selectedDetection?.id === detection.id && styles.selectedDetectionItem
                  ]}
                  onPress={() => setSelectedDetection(detection)}
                >
                  <View style={[
                    styles.detectionColorIndicator,
                    { backgroundColor: detection.color }
                  ]} />
                  <View style={styles.detectionInfo}>
                    <Text style={styles.detectionClass}>
                      {detection.class}
                    </Text>
                    <Text style={styles.detectionConfidence}>
                      Confidence: {Math.round(detection.confidence * 100)}%
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerText}>
                Disclaimer: This analysis is for screening purposes only and should not replace 
                proper laboratory diagnosis by trained professionals.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text,
  },
  saveButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4/3,
    backgroundColor: Colors.black,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: Colors.text,
    marginTop: 16,
  },
  loadingSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.darkGray,
    marginTop: 8,
  },
  errorContainer: {
    padding: 32,
    alignItems: 'center',
  },
  errorTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.error,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.white,
  },
  noDetectionsContainer: {
    padding: 24,
    backgroundColor: Colors.lightBlue,
    margin: 16,
    borderRadius: 12,
  },
  noDetectionsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 12,
  },
  noDetectionsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  resultsHeader: {
    padding: 16,
  },
  resultsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.text,
  },
  resultsSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.darkGray,
    marginTop: 4,
  },
  detailCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: Colors.darkGray,
    width: 100,
  },
  detailValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.text,
    flex: 1,
  },
  detectionsList: {
    padding: 16,
  },
  detectionsListTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 12,
  },
  detectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDetectionItem: {
    borderColor: Colors.primary,
  },
  detectionColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  detectionInfo: {
    flex: 1,
  },
  detectionClass: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
  },
  detectionConfidence: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.darkGray,
  },
  disclaimer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  disclaimerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.darkGray,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});