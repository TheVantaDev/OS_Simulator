/**
 * Color utility functions for manipulating hex colors
 */

/**
 * Lightens a hex color by a given percentage
 * @param hex - Hex color string (e.g., "#3b82f6")
 * @param percent - Percentage to lighten (0-100)
 * @returns Lightened hex color
 */
export function lightenColor(hex: string, percent: number): string {
    // Remove # if present
    const cleanHex = hex.replace('#', '');

    // Parse RGB values
    const num = parseInt(cleanHex, 16);
    const r = (num >> 16) & 0xFF;
    const g = (num >> 8) & 0xFF;
    const b = num & 0xFF;

    // Calculate lightened values
    const amount = Math.round(2.55 * percent);
    const newR = Math.min(255, r + amount);
    const newG = Math.min(255, g + amount);
    const newB = Math.min(255, b + amount);

    // Convert back to hex
    return '#' + ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1);
}

/**
 * Darkens a hex color by a given percentage
 * @param hex - Hex color string (e.g., "#3b82f6")
 * @param percent - Percentage to darken (0-100)
 * @returns Darkened hex color
 */
export function darkenColor(hex: string, percent: number): string {
    // Remove # if present
    const cleanHex = hex.replace('#', '');

    // Parse RGB values
    const num = parseInt(cleanHex, 16);
    const r = (num >> 16) & 0xFF;
    const g = (num >> 8) & 0xFF;
    const b = num & 0xFF;

    // Calculate darkened values
    const amount = Math.round(2.55 * percent);
    const newR = Math.max(0, r - amount);
    const newG = Math.max(0, g - amount);
    const newB = Math.max(0, b - amount);

    // Convert back to hex
    return '#' + ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1);
}

/**
 * Converts hex color to RGB object
 * @param hex - Hex color string (e.g., "#3b82f6")
 * @returns RGB object with r, g, b values (0-255)
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const cleanHex = hex.replace('#', '');
    const num = parseInt(cleanHex, 16);

    return {
        r: (num >> 16) & 0xFF,
        g: (num >> 8) & 0xFF,
        b: num & 0xFF,
    };
}

/**
 * Converts RGB values to hex color
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color string
 */
export function rgbToHex(r: number, g: number, b: number): string {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Converts RGB to HSL
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns HSL object with h (0-360), s (0-100), l (0-100)
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

/**
 * Converts HSL to RGB
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns RGB object with r, g, b values (0-255)
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    };
}

/**
 * Gets complementary color (opposite on color wheel)
 * @param hex - Hex color string
 * @returns Complementary hex color
 */
export function getComplementaryColor(hex: string): string {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    // Rotate hue by 180 degrees
    const complementaryHsl = {
        h: (hsl.h + 180) % 360,
        s: hsl.s,
        l: hsl.l,
    };

    const complementaryRgb = hslToRgb(complementaryHsl.h, complementaryHsl.s, complementaryHsl.l);
    return rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b);
}

/**
 * Gets color shades (for Shades theme mode)
 * @param hex - Hex color string
 * @returns Object with different shades of the color
 */
export function getColorShades(hex: string) {
    return {
        lightest: lightenColor(hex, 40),
        light: lightenColor(hex, 20),
        base: hex,
        dark: darkenColor(hex, 20),
        darkest: darkenColor(hex, 40),
    };
}

/**
 * Mixes two hex colors together
 * @param color1 - First hex color
 * @param color2 - Second hex color
 * @param weight - Weight of the second color (0-1)
 * @returns Mixed hex color
 */
export function mixColors(color1: string, color2: string, weight: number): string {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const r = Math.round(rgb1.r * (1 - weight) + rgb2.r * weight);
    const g = Math.round(rgb1.g * (1 - weight) + rgb2.g * weight);
    const b = Math.round(rgb1.b * (1 - weight) + rgb2.b * weight);

    return rgbToHex(r, g, b);
}
