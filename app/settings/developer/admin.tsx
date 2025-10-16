import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import AdminPanel from '@/components/AdminPanel';

export default function AdminScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.primary.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('referral_code_management')}</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => setShowAdminPanel(true)}
        >
          <Text style={styles.openButtonText}>
            {t('open_referral_code_management')}
          </Text>
        </TouchableOpacity>

        <Text style={styles.description}>
          {t('referral_code_management_description')}
        </Text>
      </View>

      <AdminPanel
        visible={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card.border,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.primary.text,
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  openButton: {
    backgroundColor: Colors.primary.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  openButtonText: {
    color: Colors.primary.text,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  description: {
    fontSize: 14,
    color: Colors.primary.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
});
