export const info = {
  heartbeat_interval_ms: 5 * 60 * 1000, // 5 minutes — servers should heartbeat at or below this
  ttl_ms:                11 * 60 * 1000, // ~2x interval — tolerates one missed heartbeat before delisting
  cache_s_maxage_ms:     15 * 1000, // edge cache freshness window for GET /masterlist
  cache_swr_multiplier:  4, // stale-while-revalidate = s_maxage * this
  max_tags:              5, // tags a server may list (extras are dropped)
  tags: [
    // Premade genre tags a server can choose from
    'action',
    'adventure',
    'arcade',
    'battle-royale',
    'building',
    'co-op',
    'competitive',
    'crafting',
    'creative',
    'deathmatch',
    'drifting',
    'economy',
    'fantasy',
    'fps',
    'freeroam',
    'hardcore',
    'horror',
    'minigames',
    'mmo',
    'parkour',
    'pve',
    'pvp',
    'racing',
    'roleplay',
    'sandbox',
    'sci-fi',
    'simulation',
    'social',
    'sports',
    'strategy',
    'survival',
    'zombies'
  ]
};
