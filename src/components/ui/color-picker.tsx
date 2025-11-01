import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Tooltip } from "@heroui/tooltip";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
	color: string;
	onChange: (color: string) => void;
	label?: string;
	presets?: string[];
}

const DEFAULT_PRESETS = [
	"#000000",
	"#FFFFFF",
	"#FF0000",
	"#00FF00",
	"#0000FF",
	"#FFFF00",
	"#FF00FF",
	"#00FFFF",
	"#FF6B6B",
	"#4ECDC4",
	"#45B7D1",
	"#FFA07A",
	"#98D8C8",
	"#F7DC6F",
	"#BB8FCE",
	"#85C1E2",
];

const RECENT_COLORS_KEY = "qr-recent-colors";
const MAX_RECENT_COLORS = 8;

export function ColorPicker({
	color,
	onChange,
	label,
	presets = DEFAULT_PRESETS,
}: ColorPickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [recentColors, setRecentColors] = useState<string[]>([]);

	// Load recent colors from localStorage
	useEffect(() => {
		try {
			const stored = localStorage.getItem(RECENT_COLORS_KEY);
			if (stored) {
				setRecentColors(JSON.parse(stored));
			}
		} catch (error) {
			console.error("Failed to load recent colors:", error);
		}
	}, []);

	// Save color to recent colors
	const saveToRecent = (newColor: string) => {
		const upperColor = newColor.toUpperCase();
		setRecentColors((prev) => {
			// Remove if already exists
			const filtered = prev.filter((c) => c.toUpperCase() !== upperColor);
			// Add to beginning
			const updated = [upperColor, ...filtered].slice(0, MAX_RECENT_COLORS);
			// Save to localStorage
			try {
				localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(updated));
			} catch (error) {
				console.error("Failed to save recent colors:", error);
			}
			return updated;
		});
	};

	const handleColorChange = (newColor: string) => {
		onChange(newColor);
	};

	const handleColorSelect = (selectedColor: string) => {
		onChange(selectedColor);
		saveToRecent(selectedColor);
		setIsOpen(false);
	};

	const handleInputChange = (value: string) => {
		// Validate hex color
		if (/^#[0-9A-F]{6}$/i.test(value)) {
			onChange(value);
			saveToRecent(value);
		} else {
			onChange(value);
		}
	};

	return (
		<div className="flex flex-col space-y-2">
			{label && (
				<label className="font-medium text-sm" htmlFor={`color-${label}`}>
					{label}
				</label>
			)}
			<div className="flex items-stretch gap-2">
				<Popover
					isOpen={isOpen}
					onOpenChange={setIsOpen}
					placement="bottom-start"
					offset={8}
				>
					<Tooltip content="Click to pick a color">
						<PopoverTrigger>
							<button
								type="button"
								className="relative h-12 w-12 shrink-0 cursor-pointer rounded-md border-2 border-default-300 transition-all hover:border-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
								style={{ backgroundColor: color }}
								aria-label={`${label || "Color"} picker`}
							/>
						</PopoverTrigger>
					</Tooltip>
					<PopoverContent className="w-64 p-4">
						<div className="space-y-4">
							{/* Color Picker */}
							<div className="w-full">
								<HexColorPicker
									color={color}
									onChange={handleColorChange}
									style={{ width: "100%" }}
								/>
							</div>

							{/* Hex Input */}
							<Input
								type="text"
								value={color}
								onValueChange={handleInputChange}
								placeholder="#000000"
								size="sm"
								label="Hex Code"
								classNames={{
									input: "font-mono",
								}}
							/>

							{/* Recent Colors */}
							{recentColors.length > 0 && (
								<div className="space-y-2">
									<p className="text-xs font-medium text-default-600">
										Recent Colors
									</p>
									<div className="grid grid-cols-8 gap-1">
										{recentColors.map((recentColor) => (
											<Tooltip
												key={recentColor}
												content={recentColor}
												size="sm"
												delay={500}
											>
												<button
													type="button"
													className="relative h-7 w-7 rounded border-2 border-default-200 transition-all hover:border-primary hover:scale-110"
													style={{ backgroundColor: recentColor }}
													onClick={() => handleColorSelect(recentColor)}
													aria-label={`Select ${recentColor}`}
												>
													{color.toUpperCase() ===
														recentColor.toUpperCase() && (
														<Check
															size={14}
															className="absolute inset-0 m-auto text-white drop-shadow-lg"
															strokeWidth={3}
														/>
													)}
												</button>
											</Tooltip>
										))}
									</div>
								</div>
							)}

							{/* Color Presets */}
							<div className="space-y-2">
								<p className="text-xs font-medium text-default-600">Presets</p>
								<div className="grid grid-cols-8 gap-1">
									{presets.map((preset) => (
										<Tooltip key={preset} content={preset} size="sm" delay={500}>
											<button
												type="button"
												className="relative h-7 w-7 rounded border-2 border-default-200 transition-all hover:border-primary hover:scale-110"
												style={{ backgroundColor: preset }}
												onClick={() => handleColorSelect(preset)}
												aria-label={`Select ${preset}`}
											>
												{color.toUpperCase() === preset.toUpperCase() && (
													<Check
														size={14}
														className="absolute inset-0 m-auto text-white drop-shadow-lg"
														strokeWidth={3}
													/>
												)}
											</button>
										</Tooltip>
									))}
								</div>
							</div>

							{/* Apply Button */}
							<Button
								color="primary"
								size="sm"
								fullWidth
								onPress={() => {
									saveToRecent(color);
									setIsOpen(false);
								}}
							>
								Apply
							</Button>
						</div>
					</PopoverContent>
				</Popover>

				<Tooltip content="Enter hex color code">
					<Input
						type="text"
						value={color}
						onValueChange={handleInputChange}
						placeholder="#000000"
						classNames={{
							inputWrapper: "h-12",
							input: "font-mono",
						}}
						aria-label={`${label || "Color"} hex value`}
					/>
				</Tooltip>
			</div>
		</div>
	);
}

