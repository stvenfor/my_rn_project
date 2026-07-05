import {StyleSheet} from 'react-native';

export const shortVideoPageCellStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cover: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    backgroundColor: '#2A2A2A',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  webview: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    zIndex: 2,
  },
  gestureLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
  },
  pauseIconWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
  pauseIcon: {
    fontSize: 72,
    color: 'rgba(255,255,255,0.85)',
  },
  likeBurstWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  likeBurstIcon: {
    fontSize: 96,
    color: '#FF5252',
  },
  errorPanel: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  errorText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
});
