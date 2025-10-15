import AsyncStorage from '@react-native-async-storage/async-storage';

interface Folder {
  id: string;
  name: string;
  count: number | string | null | undefined;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = '@folders';

export async function fixFolderCounts(): Promise<void> {
  try {
    console.log('Starting folder count fix...');
    
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      console.log('No folders found in storage');
      return;
    }

    const folders: Folder[] = JSON.parse(stored);
    console.log(`Found ${folders.length} folders`);

    let fixedCount = 0;
    const fixedFolders = folders.map((folder) => {
      const originalCount = folder.count;
      let validCount = 0;

      if (typeof folder.count === 'number' && !isNaN(folder.count)) {
        validCount = folder.count;
      } else if (typeof folder.count === 'string') {
        const parsed = parseInt(folder.count, 10);
        validCount = isNaN(parsed) ? 0 : parsed;
      } else {
        validCount = 0;
      }

      if (originalCount !== validCount) {
        fixedCount++;
        console.log(`Fixed folder "${folder.name}": ${originalCount} → ${validCount}`);
      }

      return {
        ...folder,
        count: validCount,
        updatedAt: new Date().toISOString(),
      };
    });

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fixedFolders));
    
    console.log(`✅ Fixed ${fixedCount} folder(s) with invalid counts`);
    console.log('Folder count fix completed successfully');
  } catch (error) {
    console.error('Error fixing folder counts:', error);
    throw error;
  }
}

export async function validateFolderData(): Promise<{
  valid: boolean;
  issues: string[];
}> {
  const issues: string[] = [];
  
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      return { valid: true, issues: [] };
    }

    const folders: Folder[] = JSON.parse(stored);

    folders.forEach((folder, index) => {
      if (!folder.id) {
        issues.push(`Folder at index ${index} missing id`);
      }
      
      if (!folder.name || typeof folder.name !== 'string') {
        issues.push(`Folder ${folder.id || index} has invalid name`);
      }
      
      if (typeof folder.count !== 'number' || isNaN(folder.count)) {
        issues.push(`Folder "${folder.name}" (${folder.id}) has invalid count: ${folder.count}`);
      }
      
      if (typeof folder.count === 'number' && folder.count < 0) {
        issues.push(`Folder "${folder.name}" (${folder.id}) has negative count: ${folder.count}`);
      }
    });

    return {
      valid: issues.length === 0,
      issues,
    };
  } catch (error) {
    issues.push(`Error validating folder data: ${error}`);
    return { valid: false, issues };
  }
}

export async function resetAllFolderCounts(): Promise<void> {
  try {
    console.log('Resetting all folder counts to 0...');
    
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      console.log('No folders found in storage');
      return;
    }

    const folders: Folder[] = JSON.parse(stored);
    
    const resetFolders = folders.map((folder) => ({
      ...folder,
      count: 0,
      updatedAt: new Date().toISOString(),
    }));

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(resetFolders));
    
    console.log(`✅ Reset ${folders.length} folder count(s) to 0`);
  } catch (error) {
    console.error('Error resetting folder counts:', error);
    throw error;
  }
}

if (require.main === module) {
  (async () => {
    console.log('=== Folder Data Repair Tool ===\n');
    
    console.log('1. Validating folder data...');
    const validation = await validateFolderData();
    
    if (validation.valid) {
      console.log('✅ All folder data is valid\n');
    } else {
      console.log('❌ Found issues:');
      validation.issues.forEach((issue) => console.log(`  - ${issue}`));
      console.log('');
      
      console.log('2. Fixing folder counts...');
      await fixFolderCounts();
      
      console.log('\n3. Re-validating...');
      const revalidation = await validateFolderData();
      
      if (revalidation.valid) {
        console.log('✅ All issues fixed!\n');
      } else {
        console.log('⚠️  Some issues remain:');
        revalidation.issues.forEach((issue) => console.log(`  - ${issue}`));
      }
    }
    
    console.log('=== Repair Complete ===');
  })();
}
