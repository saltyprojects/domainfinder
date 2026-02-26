'use client';

import { useState } from 'react';
import { AppShell } from './components/AppShell';
import { SearchDomains } from './components/SearchDomains';

export default function Home() {
  const [searchActive, setSearchActive] = useState(false);

  return (
    <AppShell hideFooter={searchActive}>
      <SearchDomains onActiveChange={setSearchActive} />
    </AppShell>
  );
}
