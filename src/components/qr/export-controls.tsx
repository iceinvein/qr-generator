/**
 * ExportControls component
 * Provides controls for exporting QR codes in different formats
 */

import { Button } from "@heroui/button";
import { Radio, RadioGroup } from "@heroui/radio";
import { Tooltip } from "@heroui/tooltip";
import { useState } from "react";
import type { ExportControlsProps, ExportFormat } from "@/types/qr";
import { generateFilename } from "@/utils/qr-utils";

export function ExportControls({ state, canvasRef }: ExportControlsProps) {
	const [exportFormat, setExportFormat] = useState<ExportFormat>(
		state.exportFormat,
	);
	const [isExporting, setIsExporting] = useState(false);

	const handleFormatChange = (value: string) => {
		setExportFormat(value as ExportFormat);
	};

	/**
	 * Export QR code as raster image (PNG, JPEG, WEBP)
	 */
	const exportAsRaster = async (format: "png" | "jpeg" | "webp") => {
		try {
			setIsExporting(true);

			// Get canvas element
			const canvas = canvasRef.current;
			if (!canvas) {
				throw new Error("Canvas not found");
			}

			// Determine MIME type
			const mimeType = `image/${format}`;

			// Convert canvas to blob
			const blob = await new Promise<Blob>((resolve, reject) => {
				canvas.toBlob(
					(blob) => {
						if (blob) {
							resolve(blob);
						} else {
							reject(new Error(`Failed to generate ${format.toUpperCase()}`));
						}
					},
					mimeType,
					0.95, // Quality for JPEG/WEBP
				);
			});

			// Generate filename with timestamp
			const filename = generateFilename(format);

			// Create download link and trigger download
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Clean up
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error(`${format.toUpperCase()} export failed:`, error);
			// Show error toast
			alert(
				`Failed to export ${format.toUpperCase()}: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			setIsExporting(false);
		}
	};

	/**
	 * Export QR code as SVG
	 * Converts canvas to SVG data
	 */
	const exportAsSVG = async () => {
		try {
			setIsExporting(true);

			// Get canvas element
			const canvas = canvasRef.current;
			if (!canvas) {
				throw new Error("Canvas not found");
			}

			// Get canvas dimensions and image data
			const width = canvas.width;
			const height = canvas.height;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				throw new Error("Failed to get canvas context");
			}

			// Convert canvas to data URL
			const dataUrl = canvas.toDataURL("image/png");

			// Create SVG with embedded image
			const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image width="${width}" height="${height}" xlink:href="${dataUrl}"/>
</svg>`;

			// Create blob from SVG content
			const blob = new Blob([svgContent], { type: "image/svg+xml" });

			// Generate filename with timestamp
			const filename = generateFilename("svg");

			// Create download link and trigger download
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Clean up
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("SVG export failed:", error);
			// Show error toast
			alert(
				`Failed to export SVG: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div
			className="flex w-full flex-col gap-4"
			role="region"
			aria-label="Export controls"
		>
			{/* ARIA live region for export status */}
			<div
				role="status"
				aria-live="polite"
				aria-atomic="true"
				className="sr-only"
			>
				{isExporting && `Exporting QR code as ${exportFormat.toUpperCase()}`}
			</div>

			<Tooltip content="Choose export format: PNG, JPEG, WEBP for raster images, SVG for scalable vector graphics">
				<RadioGroup
					label="Export Format"
					orientation="horizontal"
					value={exportFormat}
					onValueChange={handleFormatChange}
					aria-label="Select export file format"
				>
					<Radio value="png" aria-label="Export as PNG image">
						PNG
					</Radio>
					<Radio value="jpeg" aria-label="Export as JPEG image">
						JPEG
					</Radio>
					<Radio value="webp" aria-label="Export as WEBP image">
						WEBP
					</Radio>
					<Radio value="svg" aria-label="Export as SVG vector graphic">
						SVG
					</Radio>
				</RadioGroup>
			</Tooltip>

			<Tooltip
				content={`Download QR code as ${exportFormat.toUpperCase()} file`}
			>
				<Button
					color="primary"
					size="lg"
					isLoading={isExporting}
					onPress={() => {
						if (exportFormat === "svg") {
							exportAsSVG();
						} else {
							exportAsRaster(exportFormat as "png" | "jpeg" | "webp");
						}
					}}
					className="w-full"
					aria-label={`Download QR code as ${exportFormat.toUpperCase()}`}
				>
					{isExporting
						? "Exporting..."
						: `Download ${exportFormat.toUpperCase()}`}
				</Button>
			</Tooltip>
		</div>
	);
}
