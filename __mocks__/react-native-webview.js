const React = require('react');
const {View} = require('react-native');

const MockWebView = React.forwardRef((props, ref) =>
  React.createElement(View, {...props, ref, testID: 'mock-webview'}),
);
MockWebView.displayName = 'MockWebView';

module.exports = {
  __esModule: true,
  default: MockWebView,
};
