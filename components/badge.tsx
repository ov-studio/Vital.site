'use client';
import { Globe, Code, ServerCog, Ban } from 'lucide-react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';

type BadgeType = 'Shared' | 'Client' | 'Server' | 'Deprecated';

const Badges = {
  Shared: {
    styles: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    icon: <Globe className="w-3 h-3" />
  },
  Client: {
    styles: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    icon: <Code className="w-3 h-3" />
  },
  Server: {
    styles: 'bg-green-500/20 text-green-400 border-green-500/50',
    icon: <ServerCog className="w-3 h-3" />
  },
  Deprecated: {
    styles: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
    icon: <Ban className="w-3 h-3" />
  },
};

export function Badge({ type }: { type: BadgeType }) {
  const config = Badges[type];
  if (!config) return null;
  return (
    <span className={`${buttonVariants({ variant: 'outline', size: 'sm' })} inline-flex items-center gap-2 text-xs font-medium pointer-events-none ${config.styles}`}>
      {type}
      {config.icon}
    </span>
  );
}