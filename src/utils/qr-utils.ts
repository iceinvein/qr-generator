import { useEffect, useRef, useState } from "react";

/**
 * General utility functions for QR code generator
 */

/**
 * Generates a filename with timestamp format
 * Format: qr-code-YYYYMMDD-HHMMSS.{extension}
 *
 * @param extension - File extension (e.g., 'png', 'svg')
 * @returns Generated filename with timestamp
 */
export function generateFilename(extension: string): string {
	const now = new Date();

	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const seconds = String(now.getSeconds()).padStart(2, "0");

	const timestamp = `${year}${month}${day}-${hours}${minutes}${seconds}`;

	return `qr-code-${timestamp}.${extension}`;
}

/**
 * Custom hook for debouncing a value
 * Updates the debounced value after the specified delay
 *
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay = 300): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		// Set up the timeout
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Clean up the timeout if value changes before delay
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

/**
 * Custom hook for debouncing a callback function
 * Returns a debounced version of the callback
 *
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced callback function
 */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
	callback: T,
	delay = 300,
): (...args: Parameters<T>) => void {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		// Clean up on unmount
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (...args: Parameters<T>) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			callback(...args);
		}, delay);
	};
}

/**
 * Calculates logo size in pixels based on percentage of QR code size
 * Ensures logo size is within the recommended range (10-30% of QR size)
 *
 * @param qrSize - QR code size in pixels
 * @param logoPercentage - Logo size as percentage (10-30)
 * @returns Logo size in pixels
 */
export function calculateLogoSize(
	qrSize: number,
	logoPercentage: number,
): number {
	// Clamp percentage to valid range
	const clampedPercentage = Math.max(10, Math.min(30, logoPercentage));

	// Calculate logo size
	const logoSize = Math.round((qrSize * clampedPercentage) / 100);

	return logoSize;
}

/**
 * Converts a File object to a data URL
 *
 * @param file - File object to convert
 * @returns Promise that resolves to data URL string
 */
export function fileToDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			if (typeof reader.result === "string") {
				resolve(reader.result);
			} else {
				reject(new Error("Failed to convert file to data URL"));
			}
		};

		reader.onerror = () => {
			reject(new Error("Failed to read file"));
		};

		reader.readAsDataURL(file);
	});
}
