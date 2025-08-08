import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking, Platform } from 'react-native';

export const useGalleryPermissions = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const requestPermission = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status === 'granted') {
          setHasPermission(true);
          return true;
        }

        Alert.alert(
          'Permission Required',
          'This app needs access to your photo library to select images for analysis. Please enable it in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings',
              onPress: () => Linking.openSettings()
            }
          ]
        );
      }

      setHasPermission(false);
      return false;
    } catch (error) {
      console.error('Error requesting gallery permission:', error);
      setHasPermission(false);
      return false;
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  return {
    hasPermission,
    requestPermission,
  };
};
