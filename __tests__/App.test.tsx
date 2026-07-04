import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('@app/app/AppProviders', () => ({
  AppProviders: () => null,
}));

test('renders app shell', () => {
  ReactTestRenderer.create(<App />);
});
