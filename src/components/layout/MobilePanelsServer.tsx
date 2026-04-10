import { auth } from '@/lib/auth';

import { MobilePanels } from './MobilePanels';

export async function MobilePanelsServer() {
  const session = await auth();
  return <MobilePanels hasWatchlist={!!session?.user} user={session?.user ?? null} />;
}
