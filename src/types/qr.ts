/**
 * Type definitions for QR Code Generator
 */

import type React from "react";

/**
 * Supported QR code data types
 */
export type QRDataType =
	| "text"
	| "url"
	| "email"
	| "phone"
	| "wifi"
	| "vcard"
	| "calendar"
	| "geolocation";

/**
 * Error correction levels for QR codes
 * L: Low (7% error correction)
 * M: Medium (15% error correction)
 * Q: Quartile (25% error correction)
 * H: High (30% error correction)
 */
export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

/**
 * Export format options
 */
export type ExportFormat = "png" | "svg";

/**
 * WiFi encryption types
 */
export type WiFiEncryption = "WPA" | "WEP" | "nopass";

/**
 * Main state interface for QR code configuration
 */
export interface QRState {
	// Data configuration
	dataType: QRDataType;
	content: string;

	// Style configuration
	foregroundColor: string;
	backgroundColor: string;
	size: number;
	margin: number;
	errorCorrectionLevel: ErrorCorrectionLevel;

	// Branding
	logo: File | null;
	logoDataUrl: string | null;
	logoSize: number;

	// Export
	exportFormat: ExportFormat;

	// UI state
	isGenerating: boolean;
	error: string | null;
}

/**
 * Style options for QR code appearance
 */
export interface QRStyleOptions {
	foregroundColor: string;
	backgroundColor: string;
	size: number;
	margin: number;
	errorCorrectionLevel: ErrorCorrectionLevel;
}

/**
 * Branding options for logo overlay
 */
export interface QRBrandingOptions {
	logo: File | null;
	logoDataUrl: string | null;
	logoSize: number;
}

/**
 * Export options for downloading QR codes
 */
export interface QRExportOptions {
	format: ExportFormat;
	filename: string;
}

/**
 * WiFi credentials structure
 */
export interface WiFiCredentials {
	ssid: string;
	password: string;
	encryption: WiFiEncryption;
}

/**
 * Email data structure
 */
export interface EmailData {
	email: string;
	subject?: string;
	body?: string;
}

/**
 * SMS data structure
 */
export interface SMSData {
	phone: string;
	message?: string;
}

/**
 * vCard contact data structure
 */
export interface VCardData {
	firstName: string;
	lastName: string;
	organization?: string;
	title?: string;
	phone?: string;
	email?: string;
	url?: string;
	address?: string;
	note?: string;
}

/**
 * Calendar event data structure
 */
export interface CalendarEventData {
	title: string;
	location?: string;
	description?: string;
	startDate: string;
	endDate: string;
	allDay?: boolean;
}

/**
 * Geolocation data structure
 */
export interface GeolocationData {
	latitude: number;
	longitude: number;
	altitude?: number;
}

/**
 * Component Props Interfaces
 */

export interface QRInputPanelProps {
	state: QRState;
	onStateChange: (updates: Partial<QRState>) => void;
}

export interface DataInputFormProps {
	dataType: QRDataType;
	content: string;
	onChange: (content: string) => void;
}

export interface StyleConfiguratorProps {
	foregroundColor: string;
	backgroundColor: string;
	size: number;
	margin: number;
	errorCorrectionLevel: ErrorCorrectionLevel;
	hasLogo?: boolean;
	onChange: (updates: Partial<QRState>) => void;
}

export interface BrandingPanelProps {
	logo: File | null;
	logoDataUrl: string | null;
	logoSize: number;
	errorCorrectionLevel: ErrorCorrectionLevel;
	onLogoUpload: (file: File) => void;
	onLogoRemove: () => void;
	onLogoSizeChange: (size: number) => void;
	onErrorCorrectionChange: (level: "H") => void;
}

export interface QRPreviewCanvasProps {
	state: QRState;
	onGenerationComplete: () => void;
	onGenerationError: (error: string) => void;
}

export interface QRCodeRendererProps {
	content: string;
	foregroundColor: string;
	backgroundColor: string;
	size: number;
	margin: number;
	errorCorrectionLevel: ErrorCorrectionLevel;
	logoDataUrl: string | null;
	logoSize: number;
	onRenderComplete?: () => void;
	onRenderError?: (error: string) => void;
}

export interface ExportControlsProps {
	state: QRState;
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
	isValid: boolean;
	error?: string;
}
