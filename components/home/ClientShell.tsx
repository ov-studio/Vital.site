'use client';

import { usePageEffects } from '@/components/home/usePageEffects';

export function ClientShell({ children }: { children: React.ReactNode }) {
    usePageEffects();
    return <>{children}</>;
}