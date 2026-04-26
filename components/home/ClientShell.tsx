'use client';

import { Effect } from '@/components/effect';

export function ClientShell({ children }: { children: React.ReactNode }) {
    Effect();
    return <>{children}</>;
}