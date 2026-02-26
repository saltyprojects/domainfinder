'use client';

import { useState } from 'react';
import { AppShell } from './components/AppShell';
import { SearchDomains } from './components/SearchDomains';

export default function Home() {
  const [searchActive, setSearchActive] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  return (
    <AppShell hideFooter={searchActive} searchActive={searchActive} activeTab={activeTab} onTabChange={setActiveTab}>
      <SearchDomains onActiveChange={setSearchActive} activeTab={activeTab} onTabChange={setActiveTab} />
    </AppShell>
  );
}
