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
export type ExportFormat = "png" | "svg" | "jpeg" | "webp";

/**
 * QR code shape options
 */
export type QRShape = "square" | "circle";

/**
 * Dot style options for QR code pattern
 */
export type DotStyle =
	| "square"
	| "rounded"
	| "dots"
	| "classy"
	| "classy-rounded"
	| "extra-rounded";

/**
 * Corner square style options
 */
export type CornerSquareStyle =
	| "dot"
	| "square"
	| "extra-rounded"
	| "rounded"
	| "dots"
	| "classy"
	| "classy-rounded";

/**
 * Corner dot style options
 */
export type CornerDotStyle =
	| "dot"
	| "square"
	| "rounded"
	| "dots"
	| "classy"
	| "classy-rounded"
	| "extra-rounded";

/**
 * Gradient type options
 */
export type GradientType = "linear" | "radial";

/**
 * Color stop for gradients
 */
export interface ColorStop {
	offset: number; // 0-1
	color: string;
}

/**
 * Gradient configuration
 */
export interface GradientConfig {
	type: GradientType;
	rotation: number; // in radians
	colorStops: ColorStop[];
}

/**
 * Color or gradient option
 */
export type ColorOption = string | GradientConfig;

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

	// Basic style configuration
	foregroundColor: ColorOption;
	backgroundColor: ColorOption;
	size: number;
	margin: number;
	errorCorrectionLevel: ErrorCorrectionLevel;
	shape: QRShape;

	// Advanced dot styling
	dotStyle: DotStyle;
	cornerSquareStyle: CornerSquareStyle;
	cornerSquareColor: ColorOption;
	cornerDotStyle: CornerDotStyle;
	cornerDotColor: ColorOption;

	// Branding
	logo: File | null;
	logoDataUrl: string | null;
	logoSize: number;
	logoMargin: number;
	hideBackgroundDots: boolean;

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
	foregroundColor: ColorOption;
	backgroundColor: ColorOption;
	size: number;
	margin: number;
	errorCorrectionLevel: ErrorCorrectionLevel;
	shape: QRShape;
	dotStyle: DotStyle;
	cornerSquareStyle: CornerSquareStyle;
	cornerSquareColor: ColorOption;
	cornerDotStyle: CornerDotStyle;
	cornerDotColor: ColorOption;
}

/**
 * Branding options for logo overlay
 */
export interface QRBrandingOptions {
	logo: File | null;
	logoDataUrl: string | null;
	logoSize: number;
	logoMargin: number;
	hideBackgroundDots: boolean;
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
	foregroundColor: ColorOption;
	backgroundColor: ColorOption;
	size: number;
	margin: number;
	errorCorrectionLevel: ErrorCorrectionLevel;
	shape: QRShape;
	dotStyle: DotStyle;
	cornerSquareStyle: CornerSquareStyle;
	cornerSquareColor: ColorOption;
	cornerDotStyle: CornerDotStyle;
	cornerDotColor: ColorOption;
	hasLogo?: boolean;
	onChange: (updates: Partial<QRState>) => void;
}

export interface BrandingPanelProps {
	logo: File | null;
	logoDataUrl: string | null;
	logoSize: number;
	logoMargin: number;
	hideBackgroundDots: boolean;
	errorCorrectionLevel: ErrorCorrectionLevel;
	onLogoUpload: (file: File) => void;
	onLogoRemove: () => void;
	onLogoSizeChange: (size: number) => void;
	onLogoMarginChange: (margin: number) => void;
	onHideBackgroundDotsChange: (hide: boolean) => void;
	onErrorCorrectionChange: (level: "H") => void;
}

export interface QRPreviewCanvasProps {
	state: QRState;
	onGenerationComplete: () => void;
	onGenerationError: (error: string) => void;
}

export interface QRCodeRendererProps {
	content: string;
	foregroundColor: ColorOption;
	backgroundColor: ColorOption;
	size: number;
	margin: number;
	errorCorrectionLevel: ErrorCorrectionLevel;
	shape: QRShape;
	dotStyle: DotStyle;
	cornerSquareStyle: CornerSquareStyle;
	cornerSquareColor: ColorOption;
	cornerDotStyle: CornerDotStyle;
	cornerDotColor: ColorOption;
	logoDataUrl: string | null;
	logoSize: number;
	logoMargin: number;
	hideBackgroundDots: boolean;
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
