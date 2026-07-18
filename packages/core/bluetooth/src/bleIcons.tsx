import React from 'react';
import {StyleSheet, View} from 'react-native';

interface IconProps {
  color?: string;
  size?: number;
}

/** Approximate Material `Icons.search` */
export function BleSearchIcon({color = '#FFFFFF', size = 18}: IconProps) {
  const scale = size / 18;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.searchRing,
          {
            width: 10 * scale,
            height: 10 * scale,
            borderRadius: 5 * scale,
            borderWidth: 1.8 * scale,
            borderColor: color,
            left: 1 * scale,
            top: 1 * scale,
          },
        ]}
      />
      <View
        style={[
          styles.searchHandle,
          {
            width: 6 * scale,
            height: 1.8 * scale,
            backgroundColor: color,
            borderRadius: scale,
            right: 1 * scale,
            bottom: 2 * scale,
          },
        ]}
      />
    </View>
  );
}

/** Approximate Material `Icons.bluetooth` */
export function BleBluetoothIcon({color = '#666666', size = 24}: IconProps) {
  const scale = size / 24;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={{
          width: 2 * scale,
          height: 16 * scale,
          backgroundColor: color,
          borderRadius: scale,
        }}
      />
      <View
        style={[
          styles.btArmTop,
          {
            width: 8 * scale,
            height: 8 * scale,
            borderTopWidth: 2 * scale,
            borderRightWidth: 2 * scale,
            borderColor: color,
            top: 3 * scale,
          },
        ]}
      />
      <View
        style={[
          styles.btArmBottom,
          {
            width: 8 * scale,
            height: 8 * scale,
            borderBottomWidth: 2 * scale,
            borderRightWidth: 2 * scale,
            borderColor: color,
            bottom: 3 * scale,
          },
        ]}
      />
    </View>
  );
}

/** Approximate Material `Icons.bluetooth_connected` */
export function BleBluetoothConnectedIcon({
  color = '#007AFF',
  size = 24,
}: IconProps) {
  return <BleBluetoothIcon color={color} size={size} />;
}

/** Approximate Material `Icons.check_circle` */
export function BleCheckCircleIcon({color = '#4CAF50', size = 22}: IconProps) {
  const scale = size / 22;
  const ring = 18 * scale;
  return (
    <View style={[styles.box, {width: size, height: size}]}>
      <View
        style={[
          styles.checkRing,
          {
            width: ring,
            height: ring,
            borderRadius: ring / 2,
            backgroundColor: color,
          },
        ]}>
        <View
          style={[
            styles.checkMark,
            {
              width: 8 * scale,
              height: 4 * scale,
              borderLeftWidth: 2 * scale,
              borderBottomWidth: 2 * scale,
              marginTop: -1 * scale,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRing: {
    position: 'absolute',
  },
  searchHandle: {
    position: 'absolute',
    transform: [{rotate: '45deg'}],
  },
  btArmTop: {
    position: 'absolute',
    transform: [{rotate: '45deg'}],
  },
  btArmBottom: {
    position: 'absolute',
    transform: [{rotate: '-45deg'}],
  },
  checkRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    borderColor: '#FFFFFF',
    transform: [{rotate: '-45deg'}],
  },
});
