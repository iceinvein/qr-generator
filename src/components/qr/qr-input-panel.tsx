/**
 * QRInputPanel component
 * Main input panel with bottom navigation for type selection
 */

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import {
	Calendar,
	Link,
	type LucideIcon,
	Mail,
	MapPin,
	Phone,
	Text,
	User,
	Wifi,
} from "lucide-react";
import type { QRDataType, QRInputPanelProps } from "@/types/qr";
import { BrandingPanel } from "./branding-panel";
import { DataInputForm } from "./data-input-form";
import { StyleConfigurator } from "./style-configurator";

// Type definitions with icons
const QR_TYPES: Array<{
	key: QRDataType;
	label: string;
	icon: LucideIcon;
	description: string;
}> = [
	{ key: "text", label: "Text", icon: Text, description: "Plain text" },
	{ key: "url", label: "URL", icon: Link, description: "Website link" },
	{
		key: "email",
		label: "Email",
		icon: Mail,
		description: "Email address",
	},
	{
		key: "phone",
		label: "Phone",
		icon: Phone,
		description: "Phone number",
	},
	{ key: "wifi", label: "WiFi", icon: Wifi, description: "WiFi network" },
	{
		key: "vcard",
		label: "Contact",
		icon: User,
		description: "Contact card",
	},
	{
		key: "calendar",
		label: "Event",
		icon: Calendar,
		description: "Calendar event",
	},
	{
		key: "geolocation",
		label: "Location",
		icon: MapPin,
		description: "GPS coordinates",
	},
];

export function QRInputPanel({ state, onStateChange }: QRInputPanelProps) {
	const handleDataTypeChange = (dataType: QRDataType) => {
		onStateChange({
			dataType,
			content: "", // Reset content when switching data types
		});
	};

	const handleContentChange = (content: string) => {
		onStateChange({ content });
	};

	const handleLogoUpload = (file: File) => {
		// Convert file to data URL
		const reader = new FileReader();
		reader.onload = () => {
			onStateChange({
				logo: file,
				logoDataUrl: reader.result as string,
				// Automatically set error correction to H when logo is added
				errorCorrectionLevel: "H",
			});
		};
		reader.readAsDataURL(file);
	};

	const handleLogoRemove = () => {
		onStateChange({
			logo: null,
			logoDataUrl: null,
		});
	};

	const handleLogoSizeChange = (size: number) => {
		onStateChange({ logoSize: size });
	};

	const handleErrorCorrectionChange = (level: "H") => {
		onStateChange({ errorCorrectionLevel: level });
	};

	const currentType = QR_TYPES.find((t) => t.key === state.dataType);
	const IconComponent = currentType?.icon;

	return (
		<Card className="w-full h-full flex flex-col shadow-lg">
			<CardBody className="gap-6 flex-1 overflow-y-auto pb-6">
				{/* Header with current type */}
				<div className="flex items-center gap-3">
					{IconComponent && (
						<div className="p-2 rounded-lg bg-primary/10">
							<IconComponent className="w-6 h-6 text-primary" />
						</div>
					)}
					<div>
						<h2 className="text-xl font-bold" id="qr-generator-title">
							{currentType?.label} QR Code
						</h2>
						<p className="text-sm text-default-500">
							{currentType?.description}
						</p>
					</div>
				</div>

				{/* Data Input Form */}
				<div role="region" aria-label="QR code content input">
					<DataInputForm
						dataType={state.dataType}
						content={state.content}
						onChange={handleContentChange}
					/>
				</div>

				{/* Style Configurator */}
				<div role="region" aria-label="QR code style customization">
					<StyleConfigurator
						foregroundColor={state.foregroundColor}
						backgroundColor={state.backgroundColor}
						size={state.size}
						margin={state.margin}
						errorCorrectionLevel={state.errorCorrectionLevel}
						hasLogo={!!state.logo}
						onChange={onStateChange}
					/>
				</div>

				{/* Branding Panel */}
				<div role="region" aria-label="Logo branding options">
					<BrandingPanel
						logo={state.logo}
						logoDataUrl={state.logoDataUrl}
						logoSize={state.logoSize}
						errorCorrectionLevel={state.errorCorrectionLevel}
						onLogoUpload={handleLogoUpload}
						onLogoRemove={handleLogoRemove}
						onLogoSizeChange={handleLogoSizeChange}
						onErrorCorrectionChange={handleErrorCorrectionChange}
					/>
				</div>
			</CardBody>

			{/* Bottom Navigation Bar */}
			<div className="fixed bottom-0 left-0 right-0 border-t border-divider bg-background/95 backdrop-blur-lg shadow-lg z-50">
				<div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
					<div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
						{QR_TYPES.map((type) => {
							const Icon = type.icon;
							return (
								<Tooltip key={type.key} content={type.description} delay={500}>
									<Button
										size="sm"
										variant={state.dataType === type.key ? "solid" : "light"}
										color={state.dataType === type.key ? "primary" : "default"}
										onPress={() => handleDataTypeChange(type.key)}
										className={`min-w-fit shrink-0 transition-all ${
											state.dataType === type.key
												? "scale-105"
												: "hover:scale-105 hover:bg-default-100"
										}`}
										aria-label={`Select ${type.label} QR code type`}
										aria-current={
											state.dataType === type.key ? "page" : undefined
										}
									>
										<Icon className="w-4 h-4" />
										<span className="hidden sm:inline text-xs sm:text-sm">
											{type.label}
										</span>
									</Button>
								</Tooltip>
							);
						})}
					</div>
				</div>
			</div>
		</Card>
	);
}
