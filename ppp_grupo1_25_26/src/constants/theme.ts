/**
 * Unified Design Token System - NumisPocket
 * Single source of truth for colors, typography, spacing, borders, and shadows
 * Light mode only (no dark mode support)
 */

import { Platform } from 'react-native';

// ============================================================================
// COLORS - Semantic color tokens for light mode
// ============================================================================

export const Colors = {
  light: {
    // Backgrounds
    background: '#FFFFFF',           // Main screen background
    backgroundSecondary: '#F9FAFB',  // Alternative background

    // Surfaces
    surface: '#F3F4F6',              // Cards, inputs, chips
    surfaceSecondary: '#E5E7EB',     // Hover/elevated surfaces
    surfaceTertiary: '#D1D5DB',      // Disabled/inactive surfaces

    // Text
    textPrimary: '#111827',          // Primary text
    textSecondary: '#6B7280',        // Secondary text
    textTertiary: '#9CA3AF',         // Tertiary/hint text
    textInverse: '#FFFFFF',          // Text on dark backgrounds

    // Borders
    border: '#E5E7EB',               // Low-emphasis borders
    borderStrong: '#D1D5DB',         // Medium-emphasis borders

    // Accents & States
    accent: '#2563EB',               // Primary accent (buttons, active states)
    accentLight: '#DBEAFE',          // Light accent (backgrounds, subtle highlights)
    accentDark: '#1E40AF',           // Dark accent (hover/pressed states)
    error: '#DC2626',                // Error/destructive actions
    errorLight: '#FEE2E2',           // Error background
    success: '#059669',              // Success state
    successLight: '#D1FAE5',         // Success background
    warning: '#D97706',              // Warning state
    warningLight: '#FEF3C7',         // Warning background

    // Component-specific
    tabIconDefault: '#9CA3AF',       // Inactive tab icon
    tabIconSelected: '#2563EB',      // Active tab icon
    icon: '#6B7280',                 // Default icon color

    // Palette for card backgrounds (4 rotating colors)
    cardPalette: ['#E8F0FF', '#EAF7E8', '#FFF4D9', '#F1E8FF'],

    // Palette for charts/stats (6 varied colors)
    chartPalette: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
  },
};

// ============================================================================
// TYPOGRAPHY - Type scale with sizes, weights, and line heights
// ============================================================================

export const Typography = {
  // Display
  display: {
    size: 32,
    weight: '700' as const,
    lineHeight: 40,
  },

  // Headings
  heading1: {
    size: 28,
    weight: '700' as const,
    lineHeight: 34,
  },
  heading2: {
    size: 24,
    weight: '700' as const,
    lineHeight: 30,
  },
  heading3: {
    size: 20,
    weight: '600' as const,
    lineHeight: 26,
  },
  heading4: {
    size: 18,
    weight: '600' as const,
    lineHeight: 24,
  },

  // Body text
  bodyLarge: {
    size: 16,
    weight: '400' as const,
    lineHeight: 24,
  },
  body: {
    size: 15,
    weight: '400' as const,
    lineHeight: 22,
  },
  bodySmall: {
    size: 14,
    weight: '400' as const,
    lineHeight: 20,
  },

  // Labels & UI text
  labelLarge: {
    size: 14,
    weight: '500' as const,
    lineHeight: 20,
  },
  label: {
    size: 13,
    weight: '500' as const,
    lineHeight: 18,
  },
  labelSmall: {
    size: 12,
    weight: '500' as const,
    lineHeight: 16,
  },

  // Caption & hint text
  caption: {
    size: 12,
    weight: '400' as const,
    lineHeight: 16,
  },
  captionSmall: {
    size: 11,
    weight: '400' as const,
    lineHeight: 14,
  },

  // Mono (for codes, timestamps, etc.)
  mono: {
    size: 12,
    weight: '400' as const,
    lineHeight: 16,
    fontFamily: Platform.select({
      ios: 'Courier New',
      android: 'monospace',
      web: 'monospace',
    }),
  },
};

// ============================================================================
// SPACING - Unitized scale (base 4px)
// ============================================================================

export const Spacing = {
  0: 0,
  2: 2,   // 0.5x
  4: 4,   // 1x (base unit)
  6: 6,
  8: 8,   // 2x
  12: 12, // 3x
  16: 16, // 4x (standard padding/margin)
  20: 20, // 5x
  24: 24, // 6x
  28: 28, // 7x
  32: 32, // 8x
  40: 40, // 10x
  48: 48, // 12x
  56: 56, // 14x
  64: 64, // 16x
};

// ============================================================================
// BORDERS - Radius and width tokens
// ============================================================================

export const Borders = {
  radius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999, // circular
  },
  width: {
    thin: 1,
    base: 1.5,
    thick: 2,
  },
};

// ============================================================================
// SHADOWS - Elevation levels
// ============================================================================

export const Shadows = {
  // iOS-style shadows (only relevant on some platforms)
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
};

// ============================================================================
// FONTS - Platform-specific font families
// ============================================================================

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
