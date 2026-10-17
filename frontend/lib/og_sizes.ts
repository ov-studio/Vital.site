/** Shared Open Graph / Studio design sizes. Safe for client and server. */

export const OG_SCALE = 2;

/** Design-space width (1×). Studio canvas & exports use these. */
export const OG_BASE_W = 1000;
/** Design-space height (1×). Keep in sync with brand OG layout. */
export const OG_BASE_H = 375;


/** Rendered OG image size (scaled for sharp social previews). */
export const OG_W = OG_BASE_W * OG_SCALE;
export const OG_H = OG_BASE_H * OG_SCALE;

export const OG_LOGO_H = 88 * OG_SCALE;
export const OG_GAP = 35 * OG_SCALE;
export const OG_TAG_SIZE = 15.2 * OG_SCALE;
export const OG_BLUE = '#5CADFF';
export const OG_WHITE = '#F7F7F7';
