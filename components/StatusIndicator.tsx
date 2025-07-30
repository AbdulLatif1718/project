import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type StatusType = 'success' | 'warning' | 'error';

interface StatusIndicatorProps {
  type: StatusType;
  message: string;
}

export default function StatusIndicator({ type, message }: StatusIndicatorProps) {
  const getStatusColor = () => {
    switch (type) {
      case 'success':
        return Colors.success;
      case 'warning':
        return Colors.warning;
      case 'error':
        return Colors.error;
      default:
        return Colors.gray;
    }
  };

  const getStatusIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={24} color={Colors.success} />;
      case 'warning':
        return <AlertTriangle size={24} color={Colors.warning} />;
      case 'error':
        return <AlertCircle size={24} color={Colors.error} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { borderColor: getStatusColor() }]}>
      <View style={styles.iconContainer}>
        {getStatusIcon()}
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.white,
    marginVertical: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
});