// ==========================================
// 11 11 LUXURY DESIGN TOKENS
// ==========================================

export const tokens = {
  colors: {
    // Primary Luxury Palette
    noir: '#111111',          // Primary brand black / deep onyx
    noirElevated: '#1a1a1a',  // Elevated dark surfaces
    ivoire: '#FBF9F5',        // Warm off-white background
    ivoireMuted: '#F4EFE6',   // Subtle secondary background
    blanc: '#FFFFFF',

    // Accent Tones
    orChampagne: '#D4AF37',   // Champagne metallic gold accent
    orLight: '#E5C978',
    orDark: '#9E8024',
    taupe: '#9C9286',         // Muted editorial secondary text
    borderMuted: '#E8E3DA',   // Clean thin editorial border line
    borderDark: '#2C2B29',

    // Functional
    success: '#2E7D32',
    warning: '#ED6C02',
    error: '#C62828',
    info: '#0288D1',
  },
  typography: {
    fontSerif: '"Playfair Display", "Cinzel", "Cormorant Garamond", Georgia, serif',
    fontSans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    letterSpacing: {
      tight: '-0.02em',
      normal: '0em',
      wide: '0.08em',
      editorial: '0.18em',
      ultra: '0.28em',
    },
  },
  shadows: {
    subtle: '0 4px 20px -2px rgba(17, 17, 17, 0.05)',
    card: '0 10px 30px -5px rgba(17, 17, 17, 0.08)',
    drawer: '-10px 0 40px rgba(0, 0, 0, 0.15)',
    modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  transitions: {
    smooth: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    fast: 'all 0.15s ease-out',
  },
} as const;
