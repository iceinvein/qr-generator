/**
 * Color contrast utilities for QR code generation
 * Based on WCAG 2.1 guidelines
 */

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: Number.parseInt(result[1], 16),
				g: Number.parseInt(result[2], 16),
				b: Number.parseInt(result[3], 16),
			}
		: null;
}

/**
 * Calculate relative luminance of a color
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function getLuminance(hex: string): number {
	const rgb = hexToRgb(hex);
	if (!rgb) return 0;

	const { r, g, b } = rgb;

	// Convert to sRGB
	const rsRGB = r / 255;
	const gsRGB = g / 255;
	const bsRGB = b / 255;

	// Calculate luminance components
	const rLum =
		rsRGB <= 0.03928 ? rsRGB / 12.92 : ((rsRGB + 0.055) / 1.055) ** 2.4;
	const gLum =
		gsRGB <= 0.03928 ? gsRGB / 12.92 : ((gsRGB + 0.055) / 1.055) ** 2.4;
	const bLum =
		bsRGB <= 0.03928 ? bsRGB / 12.92 : ((bsRGB + 0.055) / 1.055) ** 2.4;

	return 0.2126 * rLum + 0.7152 * gLum + 0.0722 * bLum;
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
	const lum1 = getLuminance(color1);
	const lum2 = getLuminance(color2);

	const lighter = Math.max(lum1, lum2);
	const darker = Math.min(lum1, lum2);

	return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast is sufficient for QR codes
 * QR codes need high contrast to be reliably scannable
 * We recommend at least 4.5:1 (WCAG AA) but ideally 7:1 (WCAG AAA)
 */
export function checkContrastLevel(
	foreground: string,
	background: string,
): {
	ratio: number;
	level: "excellent" | "good" | "fair" | "poor";
	isScannable: boolean;
	warning?: string;
} {
	const ratio = getContrastRatio(foreground, background);

	if (ratio >= 7) {
		return {
			ratio,
			level: "excellent",
			isScannable: true,
		};
	}

	if (ratio >= 4.5) {
		return {
			ratio,
			level: "good",
			isScannable: true,
		};
	}

	if (ratio >= 3) {
		return {
			ratio,
			level: "fair",
			isScannable: true,
			warning:
				"Contrast is low. QR code may be difficult to scan in poor lighting.",
		};
	}

	return {
		ratio,
		level: "poor",
		isScannable: false,
		warning:
			"Contrast is too low! QR code may not scan reliably. Choose more contrasting colors.",
	};
}

/**
 * Generate a random color with good luminance for contrast
 */
function generateRandomColorWithLuminance(
	targetLuminance: "light" | "dark",
): string {
	const letters = "0123456789ABCDEF";
	let color: string;
	let luminance: number;

	do {
		color = "#";
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		luminance = getLuminance(color);
	} while (
		(targetLuminance === "light" && luminance < 0.5) ||
		(targetLuminance === "dark" && luminance > 0.5)
	);

	return color;
}

/**
 * Generate two random colors with guaranteed good contrast
 * Useful for randomization features
 */
export function generateContrastingColors(): {
	foreground: string;
	background: string;
} {
	// Randomly decide which should be light and which should be dark
	const foregroundLight = Math.random() > 0.5;

	let foreground: string;
	let background: string;
	let ratio: number;

	// Keep trying until we get a good contrast ratio
	do {
		if (foregroundLight) {
			background = generateRandomColorWithLuminance("dark");
			foreground = generateRandomColorWithLuminance("light");
		} else {
			background = generateRandomColorWithLuminance("light");
			foreground = generateRandomColorWithLuminance("dark");
		}
		ratio = getContrastRatio(foreground, background);
	} while (ratio < 7); // Ensure excellent contrast

	return { foreground, background };
}

/**
 * Adjust a color to ensure minimum contrast with another color
 * Returns adjusted color or original if already sufficient
 */
export function ensureMinimumContrast(
	colorToAdjust: string,
	referenceColor: string,
	minRatio = 4.5,
): string {
	const currentRatio = getContrastRatio(colorToAdjust, referenceColor);

	if (currentRatio >= minRatio) {
		return colorToAdjust;
	}

	const rgb = hexToRgb(colorToAdjust);
	if (!rgb) return colorToAdjust;

	// Determine if we need to lighten or darken
	const refLuminance = getLuminance(referenceColor);
	const shouldLighten = refLuminance < 0.5;

	// Adjust the color
	let adjustedColor = colorToAdjust;
	let attempts = 0;
	const maxAttempts = 100;

	while (
		getContrastRatio(adjustedColor, referenceColor) < minRatio &&
		attempts < maxAttempts
	) {
		const currentRgb = hexToRgb(adjustedColor);
		if (!currentRgb) break;

		const step = 10;
		const { r, g, b } = currentRgb;

		if (shouldLighten) {
			adjustedColor = `#${Math.min(255, r + step).toString(16).padStart(2, "0")}${Math.min(255, g + step).toString(16).padStart(2, "0")}${Math.min(255, b + step).toString(16).padStart(2, "0")}`;
		} else {
			adjustedColor = `#${Math.max(0, r - step).toString(16).padStart(2, "0")}${Math.max(0, g - step).toString(16).padStart(2, "0")}${Math.max(0, b - step).toString(16).padStart(2, "0")}`;
		}

		attempts++;
	}

	return adjustedColor;
}

