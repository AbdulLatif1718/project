import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { Detection } from '@/types/detection';

interface DetectionOverlayProps {
  detections: Detection[];
  selectedId?: string;
  onSelectDetection: (detection: Detection) => void;
}

export default function DetectionOverlay({ 
  detections, 
  selectedId, 
  onSelectDetection 
}: DetectionOverlayProps) {
  return (
    <View style={styles.overlay}>
      <Svg width="100%" height="100%">
        {detections.map((detection) => {
          const { x, y, width, height } = detection.bbox;
          const isSelected = detection.id === selectedId;
          
          return (
            <Rect
              key={detection.id}
              x={x}
              y={y}
              width={width}
              height={height}
              strokeWidth={isSelected ? 3 : 2}
              stroke={detection.color}
              fill="transparent"
            />
          );
        })}
      </Svg>
      
      {detections.map((detection) => {
        const { x, y, width, height } = detection.bbox;
        
        // This creates a transparent touchable area for each detection
        return (
          <TouchableOpacity
            key={detection.id}
            style={[
              styles.touchArea,
              {
                left: x,
                top: y,
                width: width,
                height: height,
              },
            ]}
            onPress={() => onSelectDetection(detection)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  touchArea: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});