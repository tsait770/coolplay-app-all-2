import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Alert,
  Switch,
} from 'react-native';
import { Trash2, Edit2, Plus, X } from 'lucide-react-native';
import { useCustomCommands, CustomCommand } from '@/providers/CustomCommandProvider';
import { useTranslation } from '@/hooks/useTranslation';

interface CommandFormData {
  text: string;
  intent: string;
  action: string;
}

const AVAILABLE_INTENTS = [
  { value: 'playback_control', label: 'Playback Control', actions: ['play', 'pause', 'stop', 'next', 'previous', 'restart'] },
  { value: 'seek_control', label: 'Seek Control', actions: ['forward', 'rewind'] },
  { value: 'volume_control', label: 'Volume Control', actions: ['up', 'down', 'max', 'mute', 'unmute'] },
  { value: 'fullscreen_control', label: 'Fullscreen Control', actions: ['enter', 'exit'] },
  { value: 'speed_control', label: 'Speed Control', actions: ['set'] },
];

export const CustomCommandManager: React.FC = () => {
  const { t } = useTranslation();
  const { commands, addCommand, updateCommand, deleteCommand, toggleCommand, isLoading } = useCustomCommands();
  
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingCommand, setEditingCommand] = useState<CustomCommand | null>(null);
  const [formData, setFormData] = useState<CommandFormData>({
    text: '',
    intent: 'playback_control',
    action: 'play',
  });

  const handleOpenModal = (command?: CustomCommand) => {
    if (command) {
      setEditingCommand(command);
      setFormData({
        text: command.text,
        intent: command.intent,
        action: command.action || '',
      });
    } else {
      setEditingCommand(null);
      setFormData({
        text: '',
        intent: 'playback_control',
        action: 'play',
      });
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingCommand(null);
    setFormData({
      text: '',
      intent: 'playback_control',
      action: 'play',
    });
  };

  const handleSave = async () => {
    if (!formData.text.trim()) {
      Alert.alert(t('error'), t('custom_command_text_required'));
      return;
    }

    try {
      if (editingCommand) {
        await updateCommand(editingCommand.id, {
          text: formData.text.trim(),
          intent: formData.intent,
          action: formData.action || undefined,
        });
      } else {
        await addCommand(
          formData.text.trim(),
          formData.intent,
          formData.action || undefined
        );
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save custom command:', error);
      Alert.alert(t('error'), t('failed_to_save_command'));
    }
  };

  const handleDelete = (command: CustomCommand) => {
    Alert.alert(
      t('confirm_delete'),
      t('confirm_delete_custom_command'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => deleteCommand(command.id),
        },
      ]
    );
  };

  const selectedIntent = AVAILABLE_INTENTS.find(i => i.value === formData.intent);

  const renderCommandItem = ({ item }: { item: CustomCommand }) => (
    <View style={styles.commandItem}>
      <View style={styles.commandInfo}>
        <Text style={styles.commandText}>{item.text}</Text>
        <Text style={styles.commandMeta}>
          {AVAILABLE_INTENTS.find(i => i.value === item.intent)?.label || item.intent}
          {item.action ? ` - ${item.action}` : ''}
        </Text>
      </View>
      <View style={styles.commandActions}>
        <Switch
          value={item.enabled}
          onValueChange={() => toggleCommand(item.id)}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={item.enabled ? '#007AFF' : '#f4f3f4'}
        />
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleOpenModal(item)}
        >
          <Edit2 size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item)}
        >
          <Trash2 size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('custom_voice_commands')}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleOpenModal()}
        >
          <Plus size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Text style={styles.loadingText}>{t('loading')}</Text>
      ) : commands.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{t('no_custom_commands')}</Text>
          <Text style={styles.emptySubtext}>{t('tap_plus_to_add_command')}</Text>
        </View>
      ) : (
        <FlatList
          data={commands}
          renderItem={renderCommandItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCommand ? t('edit_custom_command') : t('add_custom_command')}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('command_text')}</Text>
              <TextInput
                style={styles.input}
                value={formData.text}
                onChangeText={(text) => setFormData(prev => ({ ...prev, text }))}
                placeholder={t('command_text_placeholder')}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.hint}>{t('command_text_hint')}</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('intent')}</Text>
              <View style={styles.intentGrid}>
                {AVAILABLE_INTENTS.map(intent => (
                  <TouchableOpacity
                    key={intent.value}
                    style={[
                      styles.intentButton,
                      formData.intent === intent.value && styles.intentButtonActive,
                    ]}
                    onPress={() => setFormData(prev => ({ 
                      ...prev, 
                      intent: intent.value,
                      action: intent.actions[0],
                    }))}
                  >
                    <Text
                      style={[
                        styles.intentButtonText,
                        formData.intent === intent.value && styles.intentButtonTextActive,
                      ]}
                    >
                      {intent.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {selectedIntent && selectedIntent.actions.length > 0 && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('action')}</Text>
                <View style={styles.actionGrid}>
                  {selectedIntent.actions.map(action => (
                    <TouchableOpacity
                      key={action}
                      style={[
                        styles.actionChip,
                        formData.action === action && styles.actionChipActive,
                      ]}
                      onPress={() => setFormData(prev => ({ ...prev, action }))}
                    >
                      <Text
                        style={[
                          styles.actionChipText,
                          formData.action === action && styles.actionChipTextActive,
                        ]}
                      >
                        {action}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={handleCloseModal}
              >
                <Text style={styles.buttonSecondaryText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleSave}
              >
                <Text style={styles.buttonPrimaryText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#000',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  commandItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  commandInfo: {
    flex: 1,
  },
  commandText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#000',
    marginBottom: 4,
  },
  commandMeta: {
    fontSize: 12,
    color: '#666',
  },
  commandActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#000',
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  intentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intentButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  intentButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  intentButtonText: {
    fontSize: 14,
    color: '#000',
  },
  intentButtonTextActive: {
    color: '#FFF',
    fontWeight: '600' as const,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  actionChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  actionChipText: {
    fontSize: 12,
    color: '#666',
  },
  actionChipTextActive: {
    color: '#FFF',
    fontWeight: '600' as const,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonSecondary: {
    backgroundColor: '#F0F0F0',
  },
  buttonPrimaryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  buttonSecondaryText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
