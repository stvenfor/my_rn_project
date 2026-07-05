const React = require('react');
const {View} = require('react-native');

const MockVideo = React.forwardRef((props, ref) =>
  React.createElement(View, {...props, ref, testID: 'mock-video'}),
);
MockVideo.displayName = 'MockVideo';

module.exports = {
  __esModule: true,
  default: MockVideo,
  Video: MockVideo,
};
