/**
 * QRInputPanel component
 * Main input panel with bottom navigation for type selection
 */

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import { motion } from "framer-motion";
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

	const handleLogoMarginChange = (margin: number) => {
		onStateChange({ logoMargin: margin });
	};

	const handleHideBackgroundDotsChange = (hide: boolean) => {
		onStateChange({ hideBackgroundDots: hide });
	};

	const handleErrorCorrectionChange = (level: "H") => {
		onStateChange({ errorCorrectionLevel: level });
	};

	const currentType = QR_TYPES.find((t) => t.key === state.dataType);
	const IconComponent = currentType?.icon;

	return (
		<>
			<Card className="glass-strong flex h-full w-full flex-col shadow-xl">
				<CardBody className="flex-1 gap-6 overflow-y-auto">
				{/* Header with current type */}
				<div className="flex items-center gap-3">
					{IconComponent && (
						<div className="rounded-lg bg-primary/10 p-2">
							<IconComponent className="h-6 w-6 text-primary" />
						</div>
					)}
					<div>
						<h2 className="font-bold text-xl" id="qr-generator-title">
							{currentType?.label} QR Code
						</h2>
						<p className="text-default-500 text-sm">
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
						shape={state.shape}
						dotStyle={state.dotStyle}
						cornerSquareStyle={state.cornerSquareStyle}
						cornerSquareColor={state.cornerSquareColor}
						cornerDotStyle={state.cornerDotStyle}
						cornerDotColor={state.cornerDotColor}
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
						logoMargin={state.logoMargin}
						hideBackgroundDots={state.hideBackgroundDots}
						errorCorrectionLevel={state.errorCorrectionLevel}
						onLogoUpload={handleLogoUpload}
						onLogoRemove={handleLogoRemove}
						onLogoSizeChange={handleLogoSizeChange}
						onLogoMarginChange={handleLogoMarginChange}
						onHideBackgroundDotsChange={handleHideBackgroundDotsChange}
						onErrorCorrectionChange={handleErrorCorrectionChange}
					/>
				</div>
			</CardBody>
		</Card>

		{/* Bottom Navigation Bar - Fixed at bottom of viewport */}
		<motion.div
			className="glass-navbar fixed right-0 bottom-0 left-0 z-50 shadow-2xl"
			initial={{ y: 100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
		>
				<div className="mx-auto max-w-7xl px-2 py-3 sm:px-4 sm:py-4">
					<div className="scrollbar-hide flex items-center justify-center gap-2 overflow-x-auto sm:gap-3">
						{QR_TYPES.map((type, index) => {
							const Icon = type.icon;
							const isActive = state.dataType === type.key;
							return (
								<Tooltip key={type.key} content={type.description} delay={500}>
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.3,
											delay: 0.4 + index * 0.05,
											ease: [0.4, 0, 0.2, 1],
										}}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button
											size="sm"
											variant={isActive ? "solid" : "light"}
											color={isActive ? "primary" : "default"}
											onPress={() => handleDataTypeChange(type.key)}
											className={`min-w-fit shrink-0 transition-all duration-200 ${
												isActive
													? "shadow-lg"
													: "hover:bg-default-100 dark:hover:bg-default-50"
											}`}
											aria-label={`Select ${type.label} QR code type`}
											aria-current={isActive ? "page" : undefined}
										>
											<motion.div
												className="flex items-center gap-2"
												animate={isActive ? { scale: [1, 1.1, 1] } : {}}
												transition={{ duration: 0.3 }}
											>
												<Icon className="h-4 w-4" />
												<span className="hidden text-xs font-medium sm:inline sm:text-sm">
													{type.label}
												</span>
											</motion.div>
										</Button>
									</motion.div>
								</Tooltip>
							);
						})}
					</div>
				</div>
			</motion.div>
		</>
	);
}
