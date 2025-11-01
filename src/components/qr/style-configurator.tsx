import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { Tooltip } from "@heroui/tooltip";
import { RotateCcw, Shuffle } from "lucide-react";
import { useState } from "react";
import { type AnimatedTab, AnimatedTabs } from "@/components/ui/animated-tabs";
import { ColorPicker } from "@/components/ui/color-picker";
import type {
	ColorOption,
	CornerDotStyle,
	CornerSquareStyle,
	DotStyle,
	ErrorCorrectionLevel,
	QRShape,
	StyleConfiguratorProps,
} from "@/types/qr";
import {
	checkContrastLevel,
	generateContrastingColors,
} from "@/utils/color-contrast";

/**
 * StyleConfigurator component for customizing QR code appearance
 * Provides comprehensive controls for all qr-code-styling options
 */
export function StyleConfigurator({
	foregroundColor,
	backgroundColor,
	size,
	margin,
	errorCorrectionLevel,
	shape,
	dotStyle,
	cornerSquareStyle,
	cornerSquareColor,
	cornerDotStyle,
	cornerDotColor,
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

	const shapes: Array<{ key: QRShape; label: string }> = [
		{ key: "square", label: "Square" },
		{ key: "circle", label: "Circle" },
	];

	const dotStyles: Array<{ key: DotStyle; label: string }> = [
		{ key: "square", label: "Square" },
		{ key: "rounded", label: "Rounded" },
		{ key: "dots", label: "Dots" },
		{ key: "classy", label: "Classy" },
		{ key: "classy-rounded", label: "Classy Rounded" },
		{ key: "extra-rounded", label: "Extra Rounded" },
	];

	const cornerSquareStyles: Array<{ key: CornerSquareStyle; label: string }> = [
		{ key: "square", label: "Square" },
		{ key: "dot", label: "Dot" },
		{ key: "rounded", label: "Rounded" },
		{ key: "extra-rounded", label: "Extra Rounded" },
		{ key: "dots", label: "Dots" },
		{ key: "classy", label: "Classy" },
		{ key: "classy-rounded", label: "Classy Rounded" },
	];

	const cornerDotStyles: Array<{ key: CornerDotStyle; label: string }> = [
		{ key: "square", label: "Square" },
		{ key: "dot", label: "Dot" },
		{ key: "rounded", label: "Rounded" },
		{ key: "extra-rounded", label: "Extra Rounded" },
		{ key: "dots", label: "Dots" },
		{ key: "classy", label: "Classy" },
		{ key: "classy-rounded", label: "Classy Rounded" },
	];

	const handleErrorCorrectionChange = (selected: ErrorCorrectionLevel) => {
		if (selected !== "H") {
			setShowLowECWarning(true);
		} else {
			setShowLowECWarning(false);
		}
		onChange({ errorCorrectionLevel: selected });
	};

	// Helper to get color string from ColorOption
	const getColorString = (color: ColorOption): string => {
		return typeof color === "string" ? color : "#000000";
	};

	// Randomize all colors with guaranteed good contrast
	const handleRandomizeColors = () => {
		// Generate foreground and background with good contrast
		const { foreground, background } = generateContrastingColors();
		
		// Generate random colors for corners (with good contrast against background)
		const letters = "0123456789ABCDEF";
		const generateRandomColor = () => {
			let color = "#";
			for (let i = 0; i < 6; i++) {
				color += letters[Math.floor(Math.random() * 16)];
			}
			return color;
		};

		onChange({
			foregroundColor: foreground,
			backgroundColor: background,
			cornerSquareColor: generateRandomColor(),
			cornerDotColor: generateRandomColor(),
		});
	};

	// Reset to classic black and white
	const handleResetToBlackAndWhite = () => {
		onChange({
			foregroundColor: "#000000",
			backgroundColor: "#FFFFFF",
			cornerSquareColor: "#000000",
			cornerDotColor: "#000000",
		});
	};

	// Define tabs for AnimatedTabs component
	const tabs: AnimatedTab[] = [
		{
			id: "colors",
			label: "Colors",
			color: "#3b82f6",
			content: (
				<>
					<div className="flex items-center justify-between">
						<h3 className="font-semibold text-lg">Colors</h3>
						<div className="flex gap-2">
							<Tooltip content="Reset to classic black and white">
								<Button
									color="default"
									variant="flat"
									size="sm"
									startContent={<RotateCcw size={16} />}
									onPress={handleResetToBlackAndWhite}
									aria-label="Reset to black and white"
								>
									Reset
								</Button>
							</Tooltip>
							<Tooltip content="Generate random colors for all elements">
								<Button
									color="primary"
									variant="flat"
									size="sm"
									startContent={<Shuffle size={16} />}
									onPress={handleRandomizeColors}
									aria-label="Randomize colors"
								>
									Randomize
								</Button>
							</Tooltip>
						</div>
					</div>
					<div className="space-y-4">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{/* Foreground Color Picker */}
							<ColorPicker
								color={getColorString(foregroundColor)}
								onChange={(value) => onChange({ foregroundColor: value })}
								label="Foreground Color"
							/>

							{/* Background Color Picker */}
							<ColorPicker
								color={getColorString(backgroundColor)}
								onChange={(value) => onChange({ backgroundColor: value })}
								label="Background Color"
							/>
						</div>

						{/* Contrast Warning */}
						{(() => {
							const contrast = checkContrastLevel(
								getColorString(foregroundColor),
								getColorString(backgroundColor),
							);

							if (contrast.level === "excellent") {
								return (
									<div
										className="rounded-lg border border-success-200 bg-success-50 p-3 dark:bg-success-100/10"
										role="status"
									>
										<div className="flex items-start gap-2">
											<span className="text-lg">✓</span>
											<div>
												<p className="font-semibold text-success-700 text-sm dark:text-success-500">
													Excellent Contrast ({contrast.ratio.toFixed(1)}:1)
												</p>
												<p className="text-success-600 text-xs dark:text-success-400">
													Your QR code will scan reliably in all conditions.
												</p>
											</div>
										</div>
									</div>
								);
							}

							if (contrast.level === "good") {
								return (
									<div
										className="rounded-lg border border-primary-200 bg-primary-50 p-3 dark:bg-primary-100/10"
										role="status"
									>
										<div className="flex items-start gap-2">
											<span className="text-lg">✓</span>
											<div>
												<p className="font-semibold text-primary-700 text-sm dark:text-primary-500">
													Good Contrast ({contrast.ratio.toFixed(1)}:1)
												</p>
												<p className="text-primary-600 text-xs dark:text-primary-400">
													Your QR code should scan well in most conditions.
												</p>
											</div>
										</div>
									</div>
								);
							}

							if (contrast.level === "fair") {
								return (
									<div
										className="rounded-lg border border-warning-200 bg-warning-50 p-3 dark:bg-warning-100/10"
										role="alert"
										aria-live="polite"
									>
										<div className="flex items-start gap-2">
											<span className="text-lg">⚠️</span>
											<div>
												<p className="font-semibold text-warning-700 text-sm dark:text-warning-500">
													Low Contrast ({contrast.ratio.toFixed(1)}:1)
												</p>
												<p className="text-warning-600 text-xs dark:text-warning-400">
													{contrast.warning}
												</p>
											</div>
										</div>
									</div>
								);
							}

							// Poor contrast
							return (
								<div
									className="rounded-lg border border-danger-200 bg-danger-50 p-3 dark:bg-danger-100/10"
									role="alert"
									aria-live="assertive"
								>
									<div className="flex items-start gap-2">
										<span className="text-lg">⛔</span>
										<div>
											<p className="font-semibold text-danger-700 text-sm dark:text-danger-500">
												Poor Contrast ({contrast.ratio.toFixed(1)}:1)
											</p>
											<p className="text-danger-600 text-xs dark:text-danger-400">
												{contrast.warning}
											</p>
										</div>
									</div>
								</div>
							);
						})()}
					</div>
				</>
			),
		},
		{
			id: "dots",
			label: "Shape & Dots",
			color: "#8b5cf6",
			content: (
				<>
					<h3 className="font-semibold text-lg">Shape & Dots</h3>
					<div className="space-y-4">
						{/* QR Shape */}
						<div className="space-y-2">
							<Tooltip content="Overall shape of the QR code">
								<label className="font-medium text-sm">QR Shape</label>
							</Tooltip>
							<Select
								selectedKeys={[shape]}
								onSelectionChange={(keys) => {
									const selected = Array.from(keys)[0] as QRShape;
									onChange({ shape: selected });
								}}
								aria-label="QR shape selector"
							>
								{shapes.map((s) => (
									<SelectItem key={s.key} title={s.label}>
										{s.label}
									</SelectItem>
								))}
							</Select>
						</div>

						{/* Dot Style */}
						<div className="space-y-2">
							<Tooltip content="Style of the QR code dots/modules">
								<label className="font-medium text-sm">Dot Style</label>
							</Tooltip>
							<Select
								selectedKeys={[dotStyle]}
								onSelectionChange={(keys) => {
									const selected = Array.from(keys)[0] as DotStyle;
									onChange({ dotStyle: selected });
								}}
								aria-label="Dot style selector"
							>
								{dotStyles.map((s) => (
									<SelectItem key={s.key} title={s.label}>
										{s.label}
									</SelectItem>
								))}
							</Select>
						</div>
					</div>
				</>
			),
		},
		{
			id: "corners",
			label: "Corners",
			color: "#ec4899",
			content: (
				<>
					<h3 className="font-semibold text-lg">Corners</h3>
					<div className="space-y-4">
						{/* Corner Square Style */}
						<div className="space-y-2">
							<Tooltip content="Style of the corner square markers">
								<label className="font-medium text-sm">
									Corner Square Style
								</label>
							</Tooltip>
							<Select
								selectedKeys={[cornerSquareStyle]}
								onSelectionChange={(keys) => {
									const selected = Array.from(keys)[0] as CornerSquareStyle;
									onChange({ cornerSquareStyle: selected });
								}}
								aria-label="Corner square style selector"
							>
								{cornerSquareStyles.map((s) => (
									<SelectItem key={s.key} title={s.label}>
										{s.label}
									</SelectItem>
								))}
							</Select>
						</div>

						{/* Corner Square Color */}
						<ColorPicker
							color={getColorString(cornerSquareColor)}
							onChange={(value) => onChange({ cornerSquareColor: value })}
							label="Corner Square Color"
						/>

						{/* Corner Dot Style */}
						<div className="space-y-2">
							<Tooltip content="Style of the corner dot markers">
								<label className="font-medium text-sm">Corner Dot Style</label>
							</Tooltip>
							<Select
								selectedKeys={[cornerDotStyle]}
								onSelectionChange={(keys) => {
									const selected = Array.from(keys)[0] as CornerDotStyle;
									onChange({ cornerDotStyle: selected });
								}}
								aria-label="Corner dot style selector"
							>
								{cornerDotStyles.map((s) => (
									<SelectItem key={s.key} title={s.label}>
										{s.label}
									</SelectItem>
								))}
							</Select>
						</div>

						{/* Corner Dot Color */}
						<ColorPicker
							color={getColorString(cornerDotColor)}
							onChange={(value) => onChange({ cornerDotColor: value })}
							label="Corner Dot Color"
						/>
					</div>
				</>
			),
		},
		{
			id: "dimensions",
			label: "Dimensions",
			color: "#10b981",
			content: (
				<>
					<h3 className="font-semibold text-lg">Dimensions</h3>
					<div className="space-y-4">
						{/* Size Slider */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Tooltip content="Adjust the QR code dimensions in pixels">
									<label className="font-medium text-sm">Size</label>
								</Tooltip>
								<span className="text-default-500 text-sm">{size}px</span>
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
							<div className="flex justify-between text-default-400 text-xs">
								<span>128px</span>
								<span>1024px</span>
							</div>
						</div>

						{/* Margin Slider */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Tooltip content="Adjust the quiet zone (white space) around the QR code">
									<label className="font-medium text-sm">Margin</label>
								</Tooltip>
								<span className="text-default-500 text-sm">{margin}</span>
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
							<div className="flex justify-between text-default-400 text-xs">
								<span>0</span>
								<span>10</span>
							</div>
						</div>
					</div>
				</>
			),
		},
		{
			id: "error-correction",
			label: "Error Correction",
			color: "#f59e0b",
			content: (
				<>
					<h3 className="font-semibold text-lg">Error Correction</h3>
					<div className="space-y-4">
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
							<p className="text-default-500 text-xs">
								Higher error correction allows the QR code to be read even if
								partially damaged or obscured. Use High (H) when adding a logo.
							</p>

							{/* Critical warning when logo is present but error correction is not H */}
							{hasLogo && errorCorrectionLevel !== "H" && (
								<div
									className="rounded-lg border border-danger-200 bg-danger-50 p-3 dark:bg-danger-100/10"
									role="alert"
									aria-live="assertive"
								>
									<p className="font-semibold text-danger-700 text-xs dark:text-danger-500">
										🚨 Critical: Logo detected with low error correction! QR
										code may not scan properly. Set to High (H) to prevent data
										loss.
									</p>
								</div>
							)}

							{/* Warning for low error correction with potential data loss */}
							{!hasLogo && showLowECWarning && errorCorrectionLevel !== "H" && (
								<div
									className="rounded-lg border border-warning-200 bg-warning-50 p-3 dark:bg-warning-100/10"
									role="alert"
									aria-live="polite"
								>
									<p className="font-medium text-warning-700 text-xs dark:text-warning-500">
										⚠️ Lower error correction levels may result in data loss if
										the QR code is damaged
									</p>
								</div>
							)}
						</div>
					</div>
				</>
			),
		},
	];

	return (
		<div className="space-y-6">
			<AnimatedTabs
				tabs={tabs}
				defaultTab="colors"
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
				enableBlur={false}
				minHeight={300}
				maxHeight={800}
			/>
		</div>
	);
}
