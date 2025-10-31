/**
 * Data encoding utilities for QR code generation
 */

/**
 * WiFi encryption types supported by QR codes
 */
export type WiFiEncryption = "WPA" | "WEP" | "nopass";

/**
 * WiFi credentials interface
 */
export interface WiFiCredentials {
	ssid: string;
	password?: string;
	encryption: WiFiEncryption;
	hidden?: boolean;
}

/**
 * Email data interface
 */
export interface EmailData {
	email: string;
	subject?: string;
	body?: string;
}

/**
 * Encodes WiFi credentials to WiFi QR format
 * Format: WIFI:T:WPA;S:SSID;P:password;;
 * Standard: https://github.com/zxing/zxing/wiki/Barcode-Contents#wi-fi-network-config-android-ios-11
 *
 * @param credentials - WiFi credentials object
 * @returns Encoded WiFi string for QR code
 */
export function encodeWiFi(credentials: WiFiCredentials): string {
	const { ssid, password = "", encryption, hidden = false } = credentials;

	// Escape special characters in SSID and password
	const escapedSSID = escapeWiFiString(ssid);
	const escapedPassword = escapeWiFiString(password);

	// Build WiFi string according to ZXing standard
	let wifiString = `WIFI:T:${encryption};S:${escapedSSID};`;

	// Add password if encryption is not nopass
	if (encryption !== "nopass" && password) {
		wifiString += `P:${escapedPassword};`;
	}

	// Add hidden flag (optional, only if true)
	if (hidden) {
		wifiString += "H:true;";
	}

	// End with double semicolon
	wifiString += ";";

	return wifiString;
}

/**
 * Escapes special characters in WiFi strings
 * Special characters that need escaping: \ ; , : "
 * Note: Backslash must be escaped first to avoid double-escaping
 *
 * @param str - String to escape
 * @returns Escaped string
 */
function escapeWiFiString(str: string): string {
	// Escape backslash first, then other special characters
	return str
		.replace(/\\/g, "\\\\") // Escape backslashes
		.replace(/;/g, "\\;") // Escape semicolons
		.replace(/,/g, "\\,") // Escape commas
		.replace(/:/g, "\\:") // Escape colons
		.replace(/"/g, '\\"'); // Escape quotes
}

/**
 * Encodes email with subject and body to mailto URL
 * Format: mailto:email@example.com?subject=Subject&body=Body
 *
 * @param data - Email data object
 * @returns Encoded mailto URL
 */
export function encodeEmail(data: EmailData): string {
	const { email, subject, body } = data;

	let mailtoUrl = `mailto:${email}`;

	const params: string[] = [];

	if (subject) {
		params.push(`subject=${encodeURIComponent(subject)}`);
	}

	if (body) {
		params.push(`body=${encodeURIComponent(body)}`);
	}

	if (params.length > 0) {
		mailtoUrl += `?${params.join("&")}`;
	}

	return mailtoUrl;
}

/**
 * Encodes phone number to tel URL
 * Format: tel:+1234567890
 *
 * @param phoneNumber - Phone number string (can include +, spaces, dashes, parentheses)
 * @returns Encoded tel URL
 */
export function encodePhone(phoneNumber: string): string {
	// Remove all non-digit characters except the leading +
	const cleanedNumber = phoneNumber.replace(/[^\d+]/g, "");

	return `tel:${cleanedNumber}`;
}

/**
 * SMS data interface
 */
export interface SMSData {
	phone: string;
	message?: string;
}

/**
 * Encodes SMS with phone number and optional message
 * Format: smsto:+1234567890:Message text
 *
 * @param data - SMS data object
 * @returns Encoded SMS string
 */
export function encodeSMS(data: SMSData): string {
	const { phone, message } = data;
	const cleanedNumber = phone.replace(/[^\d+]/g, "");

	if (message) {
		return `smsto:${cleanedNumber}:${message}`;
	}

	return `smsto:${cleanedNumber}`;
}

/**
 * vCard contact data interface
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
 * Encodes contact information to vCard format (version 3.0)
 * Format: Multi-line vCard structure
 *
 * @param data - vCard data object
 * @returns Encoded vCard string
 */
export function encodeVCard(data: VCardData): string {
	const {
		firstName,
		lastName,
		organization,
		title,
		phone,
		email,
		url,
		address,
		note,
	} = data;

	let vcard = "BEGIN:VCARD\n";
	vcard += "VERSION:3.0\n";
	vcard += `N:${lastName};${firstName};;;\n`;
	vcard += `FN:${firstName} ${lastName}\n`;

	if (organization) {
		vcard += `ORG:${organization}\n`;
	}

	if (title) {
		vcard += `TITLE:${title}\n`;
	}

	if (phone) {
		const cleanedPhone = phone.replace(/[^\d+]/g, "");
		vcard += `TEL;TYPE=CELL:${cleanedPhone}\n`;
	}

	if (email) {
		vcard += `EMAIL:${email}\n`;
	}

	if (url) {
		vcard += `URL:${url}\n`;
	}

	if (address) {
		vcard += `ADR:;;${address};;;;\n`;
	}

	if (note) {
		vcard += `NOTE:${note}\n`;
	}

	vcard += "END:VCARD";

	return vcard;
}

/**
 * Calendar event data interface
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
 * Encodes calendar event to iCalendar format
 * Format: Multi-line iCal structure
 *
 * @param data - Calendar event data object
 * @returns Encoded iCalendar string
 */
export function encodeCalendarEvent(data: CalendarEventData): string {
	const { title, location, description, startDate, endDate, allDay } = data;

	// Convert ISO date strings to iCal format (YYYYMMDDTHHMMSS)
	const formatDate = (dateStr: string, isAllDay: boolean) => {
		const date = new Date(dateStr);
		if (isAllDay) {
			// All-day events use date only (YYYYMMDD)
			return date.toISOString().replace(/[-:]/g, "").split("T")[0];
		}
		// Regular events include time
		return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
	};

	let ical = "BEGIN:VCALENDAR\n";
	ical += "VERSION:2.0\n";
	ical += "BEGIN:VEVENT\n";
	ical += `SUMMARY:${title}\n`;

	if (allDay) {
		ical += `DTSTART;VALUE=DATE:${formatDate(startDate, true)}\n`;
		ical += `DTEND;VALUE=DATE:${formatDate(endDate, true)}\n`;
	} else {
		ical += `DTSTART:${formatDate(startDate, false)}\n`;
		ical += `DTEND:${formatDate(endDate, false)}\n`;
	}

	if (location) {
		ical += `LOCATION:${location}\n`;
	}

	if (description) {
		ical += `DESCRIPTION:${description}\n`;
	}

	ical += "END:VEVENT\n";
	ical += "END:VCALENDAR";

	return ical;
}

/**
 * Geolocation data interface
 */
export interface GeolocationData {
	latitude: number;
	longitude: number;
	altitude?: number;
}

/**
 * Encodes geolocation to geo URI format
 * Format: geo:latitude,longitude or geo:latitude,longitude,altitude
 *
 * @param data - Geolocation data object
 * @returns Encoded geo URI string
 */
export function encodeGeolocation(data: GeolocationData): string {
	const { latitude, longitude, altitude } = data;

	if (altitude !== undefined) {
		return `geo:${latitude},${longitude},${altitude}`;
	}

	return `geo:${latitude},${longitude}`;
}
