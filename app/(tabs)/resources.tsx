import React, { useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Linking, 
  Animated,
  Dimensions,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ExternalLink, 
  ChevronRight, 
  Book, 
  FileText, 
  Globe,
  Search,
  Bookmark,
  Share2,
  Download,
  Star,
  Users,
  Clock
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';

const { width: screenWidth } = Dimensions.get('window');

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  duration?: string;
  rating?: number;
  downloads?: string;
  category?: string;
  isBookmarked?: boolean;
}

interface SectionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  items: ResourceItem[];
}

export default function ResourcesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const sections: SectionItem[] = [
    {
      id: 'guides',
      title: 'Guides & Tutorials',
      subtitle: 'Step-by-step learning materials',
      icon: <Book size={28} color="#FFFFFF" />,
      color: '#4F46E5',
      items: [
        {
          id: 'guide1',
          title: 'Understanding Blood Smear Analysis',
          description: 'Master the fundamentals of blood smear preparation and microscopic analysis techniques for accurate malaria diagnosis.',
          imageUrl: 'https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg',
          link: 'https://www.cdc.gov/dpdx/malaria/index.html',
          duration: '15 min read',
          rating: 4.8,
          downloads: '12.3k',
          category: 'Beginner',
        },
        {
          id: 'guide2',
          title: 'Malaria Parasite Identification',
          description: 'Comprehensive guide to identifying different Plasmodium species and their morphological characteristics in blood smears.',
          imageUrl: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg',
          link: 'https://www.who.int/malaria/areas/diagnosis/en/',
          duration: '22 min read',
          rating: 4.9,
          downloads: '8.7k',
          category: 'Intermediate',
        },
      ],
    },
    {
      id: 'articles',
      title: 'Research & Articles',
      subtitle: 'Latest scientific publications',
      icon: <FileText size={28} color="#FFFFFF" />,
      color: '#059669',
      items: [
        {
          id: 'article1',
          title: 'AI in Malaria Diagnosis: Current State & Future',
          description: 'Explore cutting-edge artificial intelligence applications in automated malaria detection and their clinical implications.',
          imageUrl: 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg',
          link: 'https://www.nature.com/articles/s41598-019-49724-7',
          duration: '30 min read',
          rating: 4.7,
          downloads: '15.2k',
          category: 'Advanced',
        },
        {
          id: 'article2',
          title: 'Mobile Microscopy Revolution',
          description: 'Revolutionary approaches using smartphone-based microscopy for point-of-care malaria diagnosis in resource-limited settings.',
          imageUrl: 'https://images.pexels.com/photos/3825529/pexels-photo-3825529.jpeg',
          link: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0178592',
          duration: '25 min read',
          rating: 4.6,
          downloads: '9.8k',
          category: 'Research',
        },
      ],
    },
    {
      id: 'websites',
      title: 'Trusted Resources',
      subtitle: 'Official health organizations',
      icon: <Globe size={28} color="#FFFFFF" />,
      color: '#DC2626',
      items: [
        {
          id: 'website1',
          title: 'WHO Malaria Programme',
          description: 'World Health Organization\'s comprehensive malaria resources including global guidelines, treatment protocols, and prevention strategies.',
          imageUrl: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg',
          link: 'https://www.who.int/health-topics/malaria',
          duration: 'Reference',
          rating: 5.0,
          downloads: '50k+',
          category: 'Official',
        },
        {
          id: 'website2',
          title: 'CDC Malaria Information Center',
          description: 'Centers for Disease Control and Prevention\'s authoritative source for malaria surveillance, diagnosis, and treatment information.',
          imageUrl: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg',
          link: 'https://www.cdc.gov/malaria/index.html',
          duration: 'Reference',
          rating: 5.0,
          downloads: '45k+',
          category: 'Official',
        },
      ],
    },
  ];

  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open this link');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while opening the link');
    }
  };

  const toggleBookmark = (itemId: string) => {
    setBookmarkedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const shareResource = (item: ResourceItem) => {
    // Share functionality would be implemented here
    Alert.alert('Share', `Sharing: ${item.title}`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        color={i < Math.floor(rating) ? '#FDE047' : '#E5E7EB'}
        fill={i < Math.floor(rating) ? '#FDE047' : 'transparent'}
      />
    ));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Beginner': '#10B981',
      'Intermediate': '#F59E0B',
      'Advanced': '#EF4444',
      'Research': '#8B5CF6',
      'Official': '#3B82F6',
    };
    return colors[category] || '#6B7280';
  };

  const renderResourceCard = (item: ResourceItem, sectionColor: string) => (
    <Animated.View
      key={item.id}
      style={[
        styles.resourceCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => handleOpenLink(item.link)}
        activeOpacity={0.95}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.resourceImage}
            resizeMode="cover"
          />
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category ?? '') }]}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={() => toggleBookmark(item.id)}
          >
            <Bookmark
              size={18}
              color={bookmarkedItems.includes(item.id) ? '#FDE047' : '#FFFFFF'}
              fill={bookmarkedItems.includes(item.id) ? '#FDE047' : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.resourceContent}>
          <Text style={styles.resourceTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(item.rating ?? 0)}
              </View>
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.metaText}>{item.duration}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Download size={14} color="#6B7280" />
              <Text style={styles.metaText}>{item.downloads}</Text>
            </View>
          </View>

          <Text style={styles.resourceDescription} numberOfLines={3}>
            {item.description}
          </Text>

          <View style={styles.actionContainer}>
            <View style={[styles.resourceLink, { backgroundColor: `${sectionColor}15` }]}>
              <ExternalLink size={16} color={sectionColor} />
              <Text style={[styles.resourceLinkText, { color: sectionColor }]}>
                Open Resource
              </Text>
              <ChevronRight size={16} color={sectionColor} />
            </View>
            
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => shareResource(item)}
            >
              <Share2 size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#1F2937" />
      
      {/* Enhanced Header */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Learning Resources</Text>
          <Text style={styles.subtitle}>
            Expand your knowledge in malaria diagnosis
          </Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Users size={20} color="#10B981" />
            <Text style={styles.statText}>12k+ Users</Text>
          </View>
          <View style={styles.statItem}>
            <Book size={20} color="#3B82F6" />
            <Text style={styles.statText}>50+ Resources</Text>
          </View>
        </View>
      </View>


        {sections.map((section, sectionIndex) => (
          <Animated.View
            key={section.id}
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ 
                  translateY: Animated.add(slideAnim, new Animated.Value(sectionIndex * 20))
                }],
              },
            ]}
          >
            {/* Enhanced Section Header */}
            <View style={[styles.sectionHeader, { backgroundColor: section.color }]}>
              <View style={styles.sectionIconContainer}>
                {section.icon}
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
              </View>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>{section.items.length}</Text>
              </View>
            </View>

            {/* Resource Cards */}
            <View style={styles.cardsContainer}>
              {section.items.map((item) => renderResourceCard(item, section.color))}
            </View>
          </Animated.View>
        ))}

        {/* Enhanced Info Section */}
        <Animated.View
          style={[
            styles.infoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.infoHeader}>
            <View style={styles.infoIconContainer}>
              <FileText size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.infoTitle}>About MalariaScan</Text>
          </View>
          
          <Text style={styles.infoText}>
            MalariaScan empowers healthcare workers in resource-limited settings with AI-powered 
            preliminary screening of blood smears for malaria parasites. Our advanced machine 
            learning algorithms provide rapid, accurate detection to support clinical decision-making.
          </Text>
          
          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimerTitle}>⚠️ Important Disclaimer</Text>
            <Text style={styles.disclaimerText}>
              This application is designed as a screening tool to assist healthcare professionals. 
              It should never replace proper laboratory diagnosis by qualified personnel. Always 
              consult with trained medical professionals for definitive diagnosis and treatment decisions.
            </Text>
          </View>

          <View style={styles.supportContainer}>
            <Text style={styles.supportText}>
              Need help? Contact our support team or explore our comprehensive FAQ section.
            </Text>
            <TouchableOpacity style={styles.supportButton}>
              <Text style={styles.supportButtonText}>Get Support</Text>
              <ChevronRight size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#9CA3AF',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionIconContainer: {
    marginRight: 16,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sectionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  sectionBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  cardsContainer: {
    gap: 16,
  },
  resourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardContent: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  resourceImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 20,
  },
  resourceContent: {
    padding: 20,
  },
  resourceTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 24,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#374151',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  resourceDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    marginRight: 12,
  },
  resourceLinkText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    marginHorizontal: 8,
  },
  shareButton: {
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  infoContainer: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    padding: 20,
  },
  infoIconContainer: {
    marginRight: 12,
  },
  infoTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    padding: 20,
    paddingBottom: 0,
  },
  disclaimerContainer: {
    backgroundColor: '#FEF2F2',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  disclaimerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#B91C1C',
    marginBottom: 8,
  },
  disclaimerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#7F1D1D',
    lineHeight: 18,
  },
  supportContainer: {
    padding: 20,
    paddingTop: 0,
  },
  supportText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 12,
  },
  supportButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
});