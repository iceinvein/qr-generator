/**
 * Validation utilities for QR code generator
 */

/**
 * Validates a URL string
 *
 * @param url - URL string to validate
 * @returns true if valid URL, false otherwise
 */
export function isValidUrl(url: string): boolean {
	if (!url || url.trim() === "") {
		return false;
	}

	try {
		const urlObj = new URL(url);
		// Check for valid protocols
		return urlObj.protocol === "http:" || urlObj.protocol === "https:";
	} catch {
		return false;
	}
}

/**
 * Validates an email address
 *
 * @param email - Email address to validate
 * @returns true if valid email, false otherwise
 */
export function isValidEmail(email: string): boolean {
	if (!email || email.trim() === "") {
		return false;
	}

	// RFC 5322 compliant email regex (simplified)
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Validates a phone number
 * Accepts international format with optional + prefix
 *
 * @param phone - Phone number to validate
 * @returns true if valid phone number, false otherwise
 */
export function isValidPhone(phone: string): boolean {
	if (!phone || phone.trim() === "") {
		return false;
	}

	// Remove all non-digit characters except +
	const cleaned = phone.replace(/[^\d+]/g, "");

	// Must have at least 7 digits (minimum valid phone number)
	// Can optionally start with +
	const phoneRegex = /^\+?\d{7,}$/;
	return phoneRegex.test(cleaned);
}

/**
 * Supported logo file types
 */
const SUPPORTED_LOGO_TYPES = [
	"image/png",
	"image/jpeg",
	"image/jpg",
	"image/svg+xml",
];

/**
 * Validates logo file type
 * Accepts PNG, JPG, JPEG, and SVG files
 *
 * @param file - File object to validate
 * @returns true if valid file type, false otherwise
 */
export function isValidLogoType(file: File): boolean {
	return SUPPORTED_LOGO_TYPES.includes(file.type);
}

/**
 * Maximum logo file size in bytes (2MB)
 */
const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Validates logo file size
 * Maximum allowed size is 2MB
 *
 * @param file - File object to validate
 * @returns true if file size is within limit, false otherwise
 */
export function isValidLogoSize(file: File): boolean {
	return file.size <= MAX_LOGO_SIZE;
}

/**
 * Validates latitude coordinate
 *
 * @param lat - Latitude value
 * @returns true if valid latitude (-90 to 90), false otherwise
 */
export function isValidLatitude(lat: number): boolean {
	return !Number.isNaN(lat) && lat >= -90 && lat <= 90;
}

/**
 * Validates longitude coordinate
 *
 * @param lng - Longitude value
 * @returns true if valid longitude (-180 to 180), false otherwise
 */
export function isValidLongitude(lng: number): boolean {
	return !Number.isNaN(lng) && lng >= -180 && lng <= 180;
}

/**
 * Validates a date string
 *
 * @param dateStr - Date string to validate
 * @returns true if valid date, false otherwise
 */
export function isValidDate(dateStr: string): boolean {
	if (!dateStr || dateStr.trim() === "") {
		return false;
	}

	const date = new Date(dateStr);
	return !Number.isNaN(date.getTime());
}

/**
 * Validation result interface
 */
export interface ValidationResult {
	isValid: boolean;
	error?: string;
}

/**
 * Validates logo file (both type and size)
 *
 * @param file - File object to validate
 * @returns Validation result with error message if invalid
 */
export function validateLogoFile(file: File): ValidationResult {
	if (!isValidLogoType(file)) {
		return {
			isValid: false,
			error: "Please upload a PNG, JPG, or SVG file",
		};
	}

	if (!isValidLogoSize(file)) {
		return {
			isValid: false,
			error: "Logo file must be less than 2MB",
		};
	}

	return { isValid: true };
}
