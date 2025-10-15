import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { Folder as FolderIcon, Plus, Trash2 } from 'lucide-react-native';
import { useFolders, Folder } from '@/providers/FolderProvider';
import { useTranslation } from '@/hooks/useTranslation';

export function FolderList() {
  const { folders, addFolder, deleteFolder, isLoading } = useFolders();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) {
      Alert.alert(t('error'), t('folder_name_required'));
      return;
    }

    try {
      setIsCreating(true);
      await addFolder(newFolderName);
      setNewFolderName('');
      setModalVisible(false);
      Alert.alert(t('success'), t('folder_created_successfully'));
    } catch (error) {
      console.error('Error creating folder:', error);
      Alert.alert(t('error'), t('folder_creation_failed'));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteFolder = (id: string, name: string) => {
    Alert.alert(
      t('confirm_delete'),
      `${t('confirm_delete_folder')}: ${name}?`,
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFolder(id);
              Alert.alert(t('success'), t('folder_deleted_successfully'));
            } catch (error) {
              console.error('Error deleting folder:', error);
              Alert.alert(t('error'), t('folder_deletion_failed'));
            }
          },
        },
      ]
    );
  };

  const totalBookmarks = folders.reduce((sum: number, folder: Folder) => sum + (folder.count || 0), 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('folders')}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
          testID="add-folder-button"
        >
          <Plus size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {t('total_folders')}: {folders.length}
        </Text>
        <Text style={styles.statsText}>
          {t('total_bookmarks')}: {totalBookmarks}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('loading')}</Text>
        </View>
      ) : folders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FolderIcon size={48} color="#999" />
          <Text style={styles.emptyText}>{t('no_folders_yet')}</Text>
          <Text style={styles.emptySubtext}>{t('tap_plus_to_create_folder')}</Text>
        </View>
      ) : (
        <ScrollView style={styles.folderList}>
          {folders.map((folder: Folder) => (
            <View key={folder.id} style={styles.folderItem}>
              <View style={styles.folderInfo}>
                <FolderIcon size={24} color="#007AFF" />
                <View style={styles.folderDetails}>
                  <Text style={styles.folderName}>{folder.name}</Text>
                  <Text style={styles.folderCount}>
                    {folder.count} {t('bookmarks')}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteFolder(folder.id, folder.name)}
                testID={`delete-folder-${folder.id}`}
              >
                <Trash2 size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('create_new_folder')}</Text>
            
            <TextInput
              style={styles.input}
              placeholder={t('enter_folder_name')}
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus
              testID="folder-name-input"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewFolderName('');
                }}
                disabled={isCreating}
              >
                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleAddFolder}
                disabled={isCreating || !newFolderName.trim()}
                testID="create-folder-button"
              >
                <Text style={styles.createButtonText}>
                  {isCreating ? t('creating') : t('create')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#000000',
  },
  addButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600' as const,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#999999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#666666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
  folderList: {
    flex: 1,
  },
  folderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 1,
  },
  folderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  folderDetails: {
    marginLeft: 12,
    flex: 1,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#000000',
    marginBottom: 4,
  },
  folderCount: {
    fontSize: 14,
    color: '#666666',
  },
  deleteButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#666666',
  },
  createButton: {
    backgroundColor: '#007AFF',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
