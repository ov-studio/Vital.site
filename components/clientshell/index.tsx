'use client';
import { Effect } from '@/components/clientshell/effect';

export function ClientShell({ children }: { children: React.ReactNode }) {
    Effect();
    return <>{children}</>;
}