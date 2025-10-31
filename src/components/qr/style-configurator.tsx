import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { Tooltip } from "@heroui/tooltip";
import { useState } from "react";
import type { ErrorCorrectionLevel, StyleConfiguratorProps } from "@/types/qr";

/**
 * StyleConfigurator component for customizing QR code appearance
 * Provides controls for colors, size, margin, and error correction level
 */
export function StyleConfigurator({
	foregroundColor,
	backgroundColor,
	size,
	margin,
	errorCorrectionLevel,
	hasLogo = false,
	onChange,
}: StyleConfiguratorProps) {
	const [showLowECWarning, setShowLowECWarning] = useState(false);

	const errorCorrectionLevels = [
		{ key: "L", label: "Low (7%)", description: "Recovers 7% of data" },
		{ key: "M", label: "Medium (15%)", description: "Recovers 15% of data" },
		{ key: "Q", label: "Quartile (25%)", description: "Recovers 25% of data" },
		{ key: "H", label: "High (30%)", description: "Recovers 30% of data" },
	];

	const handleErrorCorrectionChange = (selected: ErrorCorrectionLevel) => {
		// Show warning if user selects a level lower than H
		if (selected !== "H") {
			setShowLowECWarning(true);
		} else {
			setShowLowECWarning(false);
		}
		onChange({ errorCorrectionLevel: selected });
	};

	return (
		<div className="space-y-6">
			{/* Color Pickers Section */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Colors</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Foreground Color Picker */}
					<div className="space-y-2">
						<Tooltip content="Color of the QR code pattern">
							<label className="text-sm font-medium">Foreground Color</label>
						</Tooltip>
						<div className="flex items-center gap-3">
							<Tooltip content="Click to pick a color">
								<Input
									type="color"
									value={foregroundColor}
									onValueChange={(value) =>
										onChange({ foregroundColor: value })
									}
									className="w-20 h-12 cursor-pointer"
									aria-label="Foreground color picker"
								/>
							</Tooltip>
							<div className="flex-1">
								<Tooltip content="Enter hex color code">
									<Input
										type="text"
										value={foregroundColor}
										onValueChange={(value) =>
											onChange({ foregroundColor: value })
										}
										placeholder="#000000"
										aria-label="Foreground color hex value"
									/>
								</Tooltip>
							</div>
							{/* Color Preview Swatch */}
							<div
								className="w-12 h-12 rounded-md border-2 border-default-300"
								style={{ backgroundColor: foregroundColor }}
								aria-label="Foreground color preview"
							/>
						</div>
					</div>

					{/* Background Color Picker */}
					<div className="space-y-2">
						<Tooltip content="Background color behind the QR code">
							<label className="text-sm font-medium">Background Color</label>
						</Tooltip>
						<div className="flex items-center gap-3">
							<Tooltip content="Click to pick a color">
								<Input
									type="color"
									value={backgroundColor}
									onValueChange={(value) =>
										onChange({ backgroundColor: value })
									}
									className="w-20 h-12 cursor-pointer"
									aria-label="Background color picker"
								/>
							</Tooltip>
							<div className="flex-1">
								<Tooltip content="Enter hex color code">
									<Input
										type="text"
										value={backgroundColor}
										onValueChange={(value) =>
											onChange({ backgroundColor: value })
										}
										placeholder="#FFFFFF"
										aria-label="Background color hex value"
									/>
								</Tooltip>
							</div>
							{/* Color Preview Swatch */}
							<div
								className="w-12 h-12 rounded-md border-2 border-default-300"
								style={{ backgroundColor: backgroundColor }}
								aria-label="Background color preview"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Size and Margin Sliders Section */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Dimensions</h3>

				{/* Size Slider */}
				<div className="space-y-2">
					<div className="flex justify-between items-center">
						<Tooltip content="Adjust the QR code dimensions in pixels">
							<label className="text-sm font-medium">Size</label>
						</Tooltip>
						<span className="text-sm text-default-500">{size}px</span>
					</div>
					<Tooltip content="Drag to change QR code size (128-1024px)">
						<Slider
							value={size}
							onChange={(value: number | number[]) => {
								const newSize = Array.isArray(value) ? value[0] : value;
								onChange({ size: newSize });
							}}
							minValue={128}
							maxValue={1024}
							step={8}
							className="w-full"
							aria-label="QR code size"
						/>
					</Tooltip>
					<div className="flex justify-between text-xs text-default-400">
						<span>128px</span>
						<span>1024px</span>
					</div>
				</div>

				{/* Margin Slider */}
				<div className="space-y-2">
					<div className="flex justify-between items-center">
						<Tooltip content="Adjust the quiet zone (white space) around the QR code">
							<label className="text-sm font-medium">Margin</label>
						</Tooltip>
						<span className="text-sm text-default-500">{margin}</span>
					</div>
					<Tooltip content="Drag to change margin size (0-10 modules)">
						<Slider
							value={margin}
							onChange={(value: number | number[]) => {
								const newMargin = Array.isArray(value) ? value[0] : value;
								onChange({ margin: newMargin });
							}}
							minValue={0}
							maxValue={10}
							step={1}
							className="w-full"
							aria-label="QR code margin"
						/>
					</Tooltip>
					<div className="flex justify-between text-xs text-default-400">
						<span>0</span>
						<span>10</span>
					</div>
				</div>
			</div>

			{/* Error Correction Level Section */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Error Correction</h3>

				<Tooltip content="Higher levels allow QR codes to be read even when damaged. Use High (H) when adding logos.">
					<Select
						label="Error Correction Level"
						selectedKeys={[errorCorrectionLevel]}
						onSelectionChange={(keys) => {
							const selected = Array.from(keys)[0] as ErrorCorrectionLevel;
							handleErrorCorrectionChange(selected);
						}}
						aria-label="Error correction level selector"
					>
						{errorCorrectionLevels.map((level) => (
							<SelectItem key={level.key} title={level.label}>
								{level.label}
							</SelectItem>
						))}
					</Select>
				</Tooltip>

				<div className="space-y-2">
					<p className="text-xs text-default-500">
						Higher error correction allows the QR code to be read even if
						partially damaged or obscured. Use High (H) when adding a logo.
					</p>

					{/* Critical warning when logo is present but error correction is not H */}
					{hasLogo && errorCorrectionLevel !== "H" && (
						<div
							className="p-3 bg-danger-50 dark:bg-danger-100/10 border border-danger-200 rounded-lg"
							role="alert"
							aria-live="assertive"
						>
							<p className="text-xs text-danger-700 dark:text-danger-500 font-semibold">
								🚨 Critical: Logo detected with low error correction! QR code
								may not scan properly. Set to High (H) to prevent data loss.
							</p>
						</div>
					)}

					{/* Warning for low error correction with potential data loss */}
					{!hasLogo && showLowECWarning && errorCorrectionLevel !== "H" && (
						<div
							className="p-3 bg-warning-50 dark:bg-warning-100/10 border border-warning-200 rounded-lg"
							role="alert"
							aria-live="polite"
						>
							<p className="text-xs text-warning-700 dark:text-warning-500 font-medium">
								⚠️ Lower error correction levels may result in data loss if the
								QR code is damaged
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
