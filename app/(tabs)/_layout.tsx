import { Redirect, Tabs } from 'expo-router';
import { StyleSheet, Platform, TouchableOpacity, View, Text } from 'react-native';
import { Camera, Image, ScanLine, Home, FileText, LogOut } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '@/stores/authStore';

export default function TabLayout() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const facilityName = useAuthStore(state => state.facilityName);
  const logout = useAuthStore(state => state.logout);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIconStyle: styles.tabBarIcon,
        headerShown: true,
        header: () => (
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerFacility}>{facilityName}</Text>
              <Text style={styles.headerSubtitle}>MalariaScan System</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <LogOut size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ),
        tabBarHideOnKeyboard: true,
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView
              style={StyleSheet.absoluteFill}
              intensity={95}
              tint="systemMaterialLight"
            />
          ) : null
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Home 
              size={focused ? 26 : 24} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
          tabBarLabelStyle: [
            styles.tabBarLabel,
            { fontWeight: 'bold' }
          ],
        }}
      />
      
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color, size, focused }) => (
            <Image 
              size={focused ? 26 : 24} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="camera"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size, focused }) => (
            <Camera 
              size={focused ? 32 : 28} 
              color={focused ? '#ffffff' : '#3b82f6'}
              strokeWidth={2.5}
              style={[
                styles.centerIcon,
                { 
                  backgroundColor: focused ? '#3b82f6' : 'rgba(59, 130, 246, 0.1)',
                  borderColor: focused ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)',
                }
              ]}
            />
          ),
          tabBarLabelStyle: [
            styles.tabBarLabel,
            styles.centerLabel,
          ],
          tabBarItemStyle: styles.centerTabItem,
        }}
      />

      <Tabs.Screen
        name="results"
        options={{
          title: 'Results',
          tabBarIcon: ({ color, size, focused }) => (
            <ScanLine 
              size={focused ? 26 : 24} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="resources"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size, focused }) => (
            <FileText 
              size={focused ? 26 : 24} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor:
      Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.9)' : '#ffffff',
    borderTopWidth: Platform.OS === 'ios' ? 0 : 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    height: Platform.OS === 'ios' ? 88 : 70,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 16,
    borderRadius: Platform.OS === 'android' ? 20 : 0,
    marginHorizontal: Platform.OS === 'android' ? 16 : 0,
    marginBottom: Platform.OS === 'android' ? 16 : 0,
    position: 'absolute',
  },

  tabBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 0.3,
  },

  tabBarItem: {
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 2,
  },

  tabBarIcon: {
    marginBottom: 2,
  },

  // Center tab (Camera) special styling
  centerTabItem: {
    paddingVertical: 4,
    borderRadius: 16,
    marginHorizontal: 2,
    marginTop: -8, // Elevate the center tab
  },

  centerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  centerLabel: {
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 6,
    color: '#3b82f6',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerFacility: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1f2937',
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6b7280',
  },
  logoutButton: {
    padding: 8,
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'ios' ? 40 : 10,
  },
});