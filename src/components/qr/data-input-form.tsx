/**
 * DataInputForm component with all input types
 * Handles text, URL, email, phone, and WiFi inputs
 */

import { DatePicker } from "@heroui/date-picker";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Tooltip } from "@heroui/tooltip";
import type { DateValue } from "@internationalized/date";
import { useState } from "react";
import type { DataInputFormProps, WiFiEncryption } from "@/types/qr";
import {
	encodeCalendarEvent,
	encodeEmail,
	encodeGeolocation,
	encodePhone,
	encodeVCard,
	encodeWiFi,
} from "@/utils/qr-encoding";
import {
	isValidEmail,
	isValidLatitude,
	isValidLongitude,
	isValidPhone,
	isValidUrl,
} from "@/utils/qr-validation";

/**
 * TextInput sub-component for plain text input
 */
function TextInput({
	content,
	onChange,
}: {
	content: string;
	onChange: (value: string) => void;
}) {
	return (
		<div className="space-y-2">
			<Tooltip content="Enter any text to encode in the QR code">
				<Input
					label="Text Content"
					placeholder="Enter text to encode in QR code"
					value={content}
					onValueChange={onChange}
					description={`${content.length} characters`}
				/>
			</Tooltip>
		</div>
	);
}

/**
 * URLInput sub-component for URL input with validation
 */
function URLInput({
	content,
	onChange,
}: {
	content: string;
	onChange: (value: string) => void;
}) {
	const [error, setError] = useState<string>("");

	const handleChange = (value: string) => {
		onChange(value);
		if (value && !isValidUrl(value)) {
			setError("Please enter a valid URL");
		} else {
			setError("");
		}
	};

	return (
		<div className="space-y-2">
			<Tooltip content="Enter a valid URL starting with http:// or https://">
				<Input
					label="URL"
					placeholder="https://example.com"
					value={content}
					onValueChange={handleChange}
					isInvalid={!!error}
					errorMessage={error}
					type="url"
				/>
			</Tooltip>
		</div>
	);
}

/**
 * EmailInput sub-component for email address
 */
function EmailInput({
	content,
	onChange,
}: {
	content: string;
	onChange: (value: string) => void;
}) {
	// Parse existing content if it's a mailto URL
	const parseEmail = (mailto: string) => {
		if (mailto.startsWith("mailto:")) {
			return mailto.substring(7).split("?")[0]; // Remove mailto: and any query params
		}
		return mailto;
	};

	const [email, setEmail] = useState(parseEmail(content));
	const [error, setError] = useState<string>("");

	const handleChange = (value: string) => {
		setEmail(value);
		if (value && !isValidEmail(value)) {
			setError("Please enter a valid email address");
		} else {
			setError("");
		}

		// Encode as simple mailto URL
		const encoded = encodeEmail({
			email: value,
		});
		onChange(encoded);
	};

	return (
		<div className="space-y-2">
			<Tooltip content="Enter the recipient's email address">
				<Input
					label="Email Address"
					placeholder="email@example.com"
					value={email}
					onValueChange={handleChange}
					isInvalid={!!error}
					errorMessage={error}
					type="email"
					description="Scanning will open the default email app"
				/>
			</Tooltip>
		</div>
	);
}

/**
 * PhoneInput sub-component for phone number with validation
 */
function PhoneInput({
	content,
	onChange,
}: {
	content: string;
	onChange: (value: string) => void;
}) {
	// Parse existing content if it's a tel URL
	const parsePhone = (tel: string) => {
		if (tel.startsWith("tel:")) {
			return tel.substring(4);
		}
		return tel;
	};

	const [phone, setPhone] = useState(parsePhone(content));
	const [error, setError] = useState<string>("");

	const handleChange = (value: string) => {
		setPhone(value);
		if (value && !isValidPhone(value)) {
			setError("Please enter a valid phone number");
		} else {
			setError("");
		}
		onChange(encodePhone(value));
	};

	return (
		<div className="space-y-2">
			<Tooltip content="Enter phone number with country code (e.g., +1 for US)">
				<Input
					label="Phone Number"
					placeholder="+1 234 567 8900"
					value={phone}
					onValueChange={handleChange}
					isInvalid={!!error}
					errorMessage={error}
					type="tel"
					description="International format supported (e.g., +1 234 567 8900)"
				/>
			</Tooltip>
		</div>
	);
}

/**
 * WiFiInput sub-component for WiFi credentials
 */
function WiFiInput({
	content,
	onChange,
}: {
	content: string;
	onChange: (value: string) => void;
}) {
	// Parse existing WiFi string if present
	const parseWiFi = (wifiStr: string) => {
		if (!wifiStr.startsWith("WIFI:")) {
			return { ssid: "", password: "", encryption: "WPA" as WiFiEncryption };
		}

		const ssidMatch = wifiStr.match(/S:([^;]+);/);
		const passwordMatch = wifiStr.match(/P:([^;]+);/);
		const encryptionMatch = wifiStr.match(/T:([^;]+);/);

		return {
			ssid: ssidMatch ? ssidMatch[1] : "",
			password: passwordMatch ? passwordMatch[1] : "",
			encryption: (encryptionMatch?.[1] || "WPA") as WiFiEncryption,
		};
	};

	const parsed = parseWiFi(content);
	const [ssid, setSsid] = useState(parsed.ssid);
	const [password, setPassword] = useState(parsed.password);
	const [encryption, setEncryption] = useState<WiFiEncryption>(
		parsed.encryption,
	);
	const [error, setError] = useState<string>("");

	const updateContent = (
		newSsid: string,
		newPassword: string,
		newEncryption: WiFiEncryption,
	) => {
		if (!newSsid || newSsid.trim() === "") {
			setError("SSID is required");
		} else {
			setError("");
		}

		const encoded = encodeWiFi({
			ssid: newSsid,
			password: newPassword,
			encryption: newEncryption,
		});

		// Debug: Log the encoded WiFi string
		console.log("WiFi QR Code String:", encoded);

		onChange(encoded);
	};

	return (
		<div className="space-y-4">
			<Tooltip content="Enter your WiFi network name (SSID)">
				<Input
					label="Network Name (SSID)"
					placeholder="MyWiFiNetwork"
					value={ssid}
					onValueChange={(value) => {
						setSsid(value);
						updateContent(value, password, encryption);
					}}
					isInvalid={!!error}
					errorMessage={error}
					isRequired
				/>
			</Tooltip>
			<Tooltip content="Select your network's security type">
				<Select
					label="Encryption Type"
					selectedKeys={[encryption]}
					onSelectionChange={(keys) => {
						const newEncryption = Array.from(keys)[0] as WiFiEncryption;
						setEncryption(newEncryption);
						updateContent(ssid, password, newEncryption);
					}}
				>
					<SelectItem key="WPA">WPA/WPA2</SelectItem>
					<SelectItem key="WEP">WEP</SelectItem>
					<SelectItem key="nopass">None (Open Network)</SelectItem>
				</Select>
			</Tooltip>
			{encryption !== "nopass" && (
				<Tooltip content="Enter your WiFi password">
					<Input
						label="Password"
						placeholder="WiFi password"
						value={password}
						onValueChange={(value) => {
							setPassword(value);
							updateContent(ssid, value, encryption);
						}}
						type="password"
					/>
				</Tooltip>
			)}
		</div>
	);
}

/**
 * VCardInput sub-component for contact information
 */
function VCardInput({
	onChange,
}: {
	content: string;
	onChange: (value: string) => void;
}) {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [organization, setOrganization] = useState("");
	const [title, setTitle] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [url, setUrl] = useState("");
	const [address, setAddress] = useState("");
	const [note, setNote] = useState("");
	const [error, setError] = useState<string>("");

	const updateContent = () => {
		if (!firstName || !lastName) {
			setError("First name and last name are required");
		} else {
			setError("");
		}

		onChange(
			encodeVCard({
				firstName,
				lastName,
				organization: organization || undefined,
				title: title || undefined,
				phone: phone || undefined,
				email: email || undefined,
				url: url || undefined,
				address: address || undefined,
				note: note || undefined,
			}),
		);
	};

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<Tooltip content="Contact's first name">
					<Input
						label="First Name"
						placeholder="John"
						value={firstName}
						onValueChange={(value) => {
							setFirstName(value);
							updateContent();
						}}
						isRequired
						isInvalid={!!error && !firstName}
					/>
				</Tooltip>
				<Tooltip content="Contact's last name">
					<Input
						label="Last Name"
						placeholder="Doe"
						value={lastName}
						onValueChange={(value) => {
							setLastName(value);
							updateContent();
						}}
						isRequired
						isInvalid={!!error && !lastName}
					/>
				</Tooltip>
			</div>
			{error && <p className="text-danger text-sm">{error}</p>}
			<Tooltip content="Company or organization name (optional)">
				<Input
					label="Organization (Optional)"
					placeholder="Acme Corp"
					value={organization}
					onValueChange={(value) => {
						setOrganization(value);
						updateContent();
					}}
				/>
			</Tooltip>
			<Tooltip content="Job title or position (optional)">
				<Input
					label="Title (Optional)"
					placeholder="Software Engineer"
					value={title}
					onValueChange={(value) => {
						setTitle(value);
						updateContent();
					}}
				/>
			</Tooltip>
			<Tooltip content="Phone number (optional)">
				<Input
					label="Phone (Optional)"
					placeholder="+1 234 567 8900"
					value={phone}
					onValueChange={(value) => {
						setPhone(value);
						updateContent();
					}}
					type="tel"
				/>
			</Tooltip>
			<Tooltip content="Email address (optional)">
				<Input
					label="Email (Optional)"
					placeholder="john@example.com"
					value={email}
					onValueChange={(value) => {
						setEmail(value);
						updateContent();
					}}
					type="email"
				/>
			</Tooltip>
			<Tooltip content="Website URL (optional)">
				<Input
					label="Website (Optional)"
					placeholder="https://example.com"
					value={url}
					onValueChange={(value) => {
						setUrl(value);
						updateContent();
					}}
					type="url"
				/>
			</Tooltip>
			<Tooltip content="Physical address (optional)">
				<Input
					label="Address (Optional)"
					placeholder="123 Main St, City, State"
					value={address}
					onValueChange={(value) => {
						setAddress(value);
						updateContent();
					}}
				/>
			</Tooltip>
			<Tooltip content="Additional notes (optional)">
				<div>
					<label className="mb-1 block font-medium text-sm">
						Note (Optional)
					</label>
					<textarea
						className="w-full resize-none rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
						placeholder="Additional information"
						value={note}
						onChange={(e) => {
							setNote(e.target.value);
							updateContent();
						}}
						rows={3}
					/>
				</div>
			</Tooltip>
		</div>
	);
}

/**
 * CalendarInput sub-component for calendar events
 */
function CalendarInput({
	onChange,
}: {
	content: string;
	onChange: (value: string) => void;
}) {
	const [title, setTitle] = useState("");
	const [location, setLocation] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState<DateValue | null>(null);
	const [endDate, setEndDate] = useState<DateValue | null>(null);
	const [error, setError] = useState<string>("");

	const updateContent = (
		newTitle?: string,
		newLocation?: string,
		newDescription?: string,
		newStartDate?: DateValue | null,
		newEndDate?: DateValue | null,
	) => {
		const currentTitle = newTitle !== undefined ? newTitle : title;
		const currentLocation = newLocation !== undefined ? newLocation : location;
		const currentDescription =
			newDescription !== undefined ? newDescription : description;
		const currentStartDate =
			newStartDate !== undefined ? newStartDate : startDate;
		const currentEndDate = newEndDate !== undefined ? newEndDate : endDate;

		if (!currentTitle || !currentStartDate || !currentEndDate) {
			setError("Title, start date, and end date are required");
			return;
		}

		// Get user's timezone
		const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

		// Convert DateValue to ISO string using local timezone
		// toDate() converts to a native Date object in the specified timezone
		const startISO = currentStartDate.toDate(userTimezone).toISOString();
		const endISO = currentEndDate.toDate(userTimezone).toISOString();

		if (new Date(startISO) > new Date(endISO)) {
			setError("End date must be after start date");
		} else {
			setError("");
		}

		onChange(
			encodeCalendarEvent({
				title: currentTitle,
				location: currentLocation || undefined,
				description: currentDescription || undefined,
				startDate: startISO,
				endDate: endISO,
				allDay: false,
			}),
		);
	};

	// Get user's timezone for display
	const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	return (
		<div className="space-y-4">
			<Tooltip content="Event title or name">
				<Input
					label="Event Title"
					placeholder="Team Meeting"
					value={title}
					onValueChange={(value) => {
						setTitle(value);
						updateContent(value);
					}}
					isRequired
					isInvalid={!!error && !title}
				/>
			</Tooltip>
			{error && <p className="text-danger text-sm">{error}</p>}

			{/* Timezone info */}
			<div className="rounded-lg bg-default-100 p-2 dark:bg-default-50">
				<p className="text-default-600 text-xs">
					🌍 Timezone: <span className="font-medium">{userTimezone}</span>
				</p>
			</div>

		{/* Separate Date & Time Pickers */}
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			<DatePicker
				label="Start Date & Time"
				granularity="minute"
				value={startDate}
				onChange={(value) => {
					setStartDate(value);
					updateContent(undefined, undefined, undefined, value);
				}}
				isRequired
				hideTimeZone
				description="Event start"
			/>
			<DatePicker
				label="End Date & Time"
				granularity="minute"
				value={endDate}
				onChange={(value) => {
					setEndDate(value);
					updateContent(undefined, undefined, undefined, undefined, value);
				}}
				isRequired
				hideTimeZone
				description="Event end"
			/>
		</div>
			<Tooltip content="Event location or venue (optional)">
				<Input
					label="Location (Optional)"
					placeholder="Conference Room A"
					value={location}
					onValueChange={(value) => {
						setLocation(value);
						updateContent(undefined, value);
					}}
				/>
			</Tooltip>
			<Tooltip content="Event description or notes (optional)">
				<div>
					<label className="mb-1 block font-medium text-sm">
						Description (Optional)
					</label>
					<textarea
						className="w-full resize-none rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
						placeholder="Event details and agenda"
						value={description}
						onChange={(e) => {
							const newValue = e.target.value;
							setDescription(newValue);
							updateContent(undefined, undefined, newValue);
						}}
						rows={4}
					/>
				</div>
			</Tooltip>
		</div>
	);
}

/**
 * GeolocationInput sub-component for GPS coordinates
 */
function GeolocationInput({
	content,
	onChange,
}: {
	content: string;
	onChange: (value: string) => void;
}) {
	// Parse existing content if it's a geo URI
	const parseGeo = (geo: string) => {
		if (!geo.startsWith("geo:")) {
			return { latitude: "", longitude: "", altitude: "" };
		}

		const coords = geo.substring(4).split(",");
		return {
			latitude: coords[0] || "",
			longitude: coords[1] || "",
			altitude: coords[2] || "",
		};
	};

	const parsed = parseGeo(content);
	const [latitude, setLatitude] = useState(parsed.latitude);
	const [longitude, setLongitude] = useState(parsed.longitude);
	const [altitude, setAltitude] = useState(parsed.altitude);
	const [error, setError] = useState<string>("");

	const updateContent = (newLat: string, newLng: string, newAlt: string) => {
		const lat = Number.parseFloat(newLat);
		const lng = Number.parseFloat(newLng);
		const alt = newAlt ? Number.parseFloat(newAlt) : undefined;

		if (newLat && !isValidLatitude(lat)) {
			setError("Latitude must be between -90 and 90");
		} else if (newLng && !isValidLongitude(lng)) {
			setError("Longitude must be between -180 and 180");
		} else {
			setError("");
		}

		onChange(
			encodeGeolocation({
				latitude: lat || 0,
				longitude: lng || 0,
				altitude: alt,
			}),
		);
	};

	return (
		<div className="space-y-4">
			<Tooltip content="Latitude coordinate (-90 to 90)">
				<Input
					label="Latitude"
					placeholder="37.7749"
					value={latitude}
					onValueChange={(value: string) => {
						setLatitude(value);
						updateContent(value, longitude, altitude);
					}}
					type="number"
					isRequired
					isInvalid={!!error && error.includes("Latitude")}
				/>
			</Tooltip>
			<Tooltip content="Longitude coordinate (-180 to 180)">
				<Input
					label="Longitude"
					placeholder="-122.4194"
					value={longitude}
					onValueChange={(value: string) => {
						setLongitude(value);
						updateContent(latitude, value, altitude);
					}}
					type="number"
					isRequired
					isInvalid={!!error && error.includes("Longitude")}
				/>
			</Tooltip>
			{error && <p className="text-danger text-sm">{error}</p>}
			<Tooltip content="Altitude in meters (optional)">
				<Input
					label="Altitude (Optional)"
					placeholder="100"
					value={altitude}
					onValueChange={(value: string) => {
						setAltitude(value);
						updateContent(latitude, longitude, value);
					}}
					type="number"
					description="Altitude in meters above sea level"
				/>
			</Tooltip>
		</div>
	);
}

/**
 * Main DataInputForm component
 * Switches between different input types based on dataType
 */
export function DataInputForm({
	dataType,
	content,
	onChange,
}: DataInputFormProps) {
	switch (dataType) {
		case "text":
			return <TextInput content={content} onChange={onChange} />;
		case "url":
			return <URLInput content={content} onChange={onChange} />;
		case "email":
			return <EmailInput content={content} onChange={onChange} />;
		case "phone":
			return <PhoneInput content={content} onChange={onChange} />;
		case "wifi":
			return <WiFiInput content={content} onChange={onChange} />;
		case "vcard":
			return <VCardInput content={content} onChange={onChange} />;
		case "calendar":
			return <CalendarInput content={content} onChange={onChange} />;
		case "geolocation":
			return <GeolocationInput content={content} onChange={onChange} />;
		default:
			return null;
	}
}
