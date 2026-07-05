import React from 'react';
import {hasSharedElementNative} from '../utils/nativeCapabilities';

type SharedElementComponent = React.ComponentType<{
  id: string;
  children: React.ReactNode;
}>;

let SharedElementImpl: SharedElementComponent = ({children}) => <>{children}</>;

if (hasSharedElementNative()) {
  try {
    const mod = require('react-navigation-shared-element') as {
      SharedElement: SharedElementComponent;
    };
    SharedElementImpl = mod.SharedElement;
  } catch {
    // Keep passthrough when the native module is unavailable.
  }
}

export function MusicSharedElement({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return <SharedElementImpl id={id}>{children}</SharedElementImpl>;
}
