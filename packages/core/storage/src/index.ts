const memoryStore = new Map<string, string>();

export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      const AsyncStorage =
        require('@react-native-async-storage/async-storage').default;
      return await AsyncStorage.getItem(key);
    } catch {
      return memoryStore.get(key) ?? null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      const AsyncStorage =
        require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem(key, value);
    } catch {
      memoryStore.set(key, value);
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      const AsyncStorage =
        require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem(key);
    } catch {
      memoryStore.delete(key);
    }
  },
};
