import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-native-ohos/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

type RootStackParamList = {
  Home: undefined;
  Detail: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function HomeScreen({navigation}: {navigation: {navigate: (screen: 'Detail') => void}}) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>MyRnProject</Text>
      <Text style={styles.subtitle}>三端 React Native 项目</Text>
      <Button
        title="前往详情页"
        onPress={() => navigation.navigate('Detail')}
      />
    </View>
  );
}

function DetailScreen({navigation}: {navigation: {goBack: () => void}}) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>详情页</Text>
      <Text style={styles.subtitle}>Stack Navigator 运行正常</Text>
      <Button title="返回首页" onPress={() => navigation.goBack()} />
    </View>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{title: '首页'}}
            />
            <Stack.Screen
              name="Detail"
              component={DetailScreen}
              options={{title: '详情'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default App;
