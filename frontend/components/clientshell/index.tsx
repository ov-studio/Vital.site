'use client';
import * as component_clientshell_effect from '@/components/clientshell/effect';

export function ClientShell({ children }: { children: React.ReactNode }) {
  component_clientshell_effect.Effect();
  return <>{children}</>;
}