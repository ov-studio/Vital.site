'use client';
import * as lucide                    from 'lucide-react';
import * as fumadocs_component_button from 'fumadocs-ui/components/ui/button';

const Badges = {
  shared: {
    styles: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    icon: <lucide.Globe className="w-3 h-3" />
  },

  client: {
    styles: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    icon: <lucide.Code className="w-3 h-3" />
  },

  server: {
    styles: 'bg-green-500/20 text-green-400 border-green-500/50',
    icon: <lucide.ServerCog className="w-3 h-3" />
  },

  deprecated: {
    styles: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
    icon: <lucide.Ban className="w-3 h-3" />
  }
};

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function Badge({ type }: { type: string }) {
  const key = type.toLowerCase() as keyof typeof Badges;
  const config = Badges[key];
  if (!config) return null;

  return (
    <span className={`${fumadocs_component_button.buttonVariants({ variant: 'outline', size: 'sm' })} inline-flex items-center gap-2 text-xs font-medium pointer-events-none ${config.styles}`}>
      {capitalize(key)}
      {config.icon}
    </span>
  );
}