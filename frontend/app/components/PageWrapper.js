'use client';

import { StaticPage } from './StaticPage';

export default function PageWrapper({ children }) {
  return <StaticPage>{children}</StaticPage>;
}
