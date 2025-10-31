/**
 * BrandingPanel component for logo upload and configuration
 */

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Slider } from "@heroui/slider";
import { Tooltip } from "@heroui/tooltip";
import { useRef, useState } from "react";
import type { BrandingPanelProps } from "@/types/qr";
import { validateLogoFile } from "@/utils/qr-validation";

export function BrandingPanel({
	logo,
	logoDataUrl,
	logoSize,
	errorCorrectionLevel,
	onLogoUpload,
	onLogoRemove,
	onLogoSizeChange,
	onErrorCorrectionChange,
}: BrandingPanelProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [error, setError] = useState<string | null>(null);
	const [showWarning, setShowWarning] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const processFile = (file: File) => {
		// Validate the file
		const validation = validateLogoFile(file);
		if (!validation.isValid) {
			setError(validation.error || "Invalid file");
			// Reset the file input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			return;
		}

		// Clear any previous errors
		setError(null);

		// Convert file to data URL
		const reader = new FileReader();
		reader.onload = () => {
			onLogoUpload(file);

			// Automatically set error correction to 'H' when logo is uploaded
			if (errorCorrectionLevel !== "H") {
				onErrorCorrectionChange("H");
			}
		};
		reader.onerror = () => {
			setError("Failed to read file");
		};
		reader.readAsDataURL(file);
	};

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;
		processFile(file);
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);

		const file = event.dataTransfer.files?.[0];
		if (!file) return;
		processFile(file);
	};

	const handleRemoveLogo = () => {
		onLogoRemove();
		setError(null);
		setShowWarning(false);
		// Reset the file input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleLogoSizeChange = (value: number | number[]) => {
		const size = Array.isArray(value) ? value[0] : value;
		onLogoSizeChange(size);

		// Show warning if logo size exceeds 25% (recommended threshold)
		setShowWarning(size > 25);
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="space-y-4">
			<div>
				<h3 className="text-sm font-medium mb-2">Logo Branding</h3>
				<p className="text-xs text-default-500 mb-3">
					Add your logo to the center of the QR code
				</p>
			</div>

			{/* File input (hidden) */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/png,image/jpeg,image/jpg,image/svg+xml"
				onChange={handleFileSelect}
				className="hidden"
				aria-label="Upload logo file"
			/>

			{/* Drag and drop area or logo preview */}
			{!logoDataUrl ? (
				<Card
					isPressable
					onPress={handleUploadClick}
					className={`w-full border-2 border-dashed transition-colors cursor-pointer ${
						isDragging
							? "border-primary bg-primary-50 dark:bg-primary-100/10"
							: "border-default-300 hover:border-primary hover:bg-default-100"
					}`}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<CardBody className="flex flex-col items-center justify-center py-12 gap-3 w-full">
						<svg
							className={`w-16 h-16 ${isDragging ? "text-primary" : "text-default-400"}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							/>
						</svg>
						<div className="flex flex-col items-center gap-1">
							<p className="text-base font-semibold text-center">
								{isDragging ? "Drop logo here" : "Drag & drop logo here"}
							</p>
							<p className="text-sm text-default-500 text-center">
								or click to browse
							</p>
						</div>
						<p className="text-xs text-default-400 text-center">
							PNG, JPG, or SVG (max 2MB)
						</p>
					</CardBody>
				</Card>
			) : (
				<div className="space-y-3">
					{/* Logo preview */}
					<div className="relative border-2 border-default-200 rounded-lg p-4 bg-default-50 dark:bg-default-100">
						<img
							src={logoDataUrl}
							alt="Logo preview"
							className="max-w-full max-h-32 mx-auto object-contain"
						/>
					</div>

					{/* Remove button */}
					<Tooltip content="Remove the logo from the QR code">
						<Button
							onPress={handleRemoveLogo}
							color="danger"
							variant="flat"
							fullWidth
							size="sm"
						>
							Remove Logo
						</Button>
					</Tooltip>

					{/* Logo size slider */}
					<div className="space-y-2">
						<Tooltip content="Adjust logo size as percentage of QR code">
							<label className="text-sm font-medium">
								Logo Size: {logoSize}%
							</label>
						</Tooltip>
						<Tooltip content="Drag to adjust logo size (10-30%). Keep below 25% for best scannability">
							<Slider
								size="sm"
								step={1}
								minValue={10}
								maxValue={30}
								value={logoSize}
								onChange={handleLogoSizeChange}
								aria-label="Logo size percentage"
								className="max-w-full"
							/>
						</Tooltip>
						<p className="text-xs text-default-500">
							Recommended: 10-25% for optimal scannability
						</p>
					</div>

					{/* Warning for large logo size */}
					{showWarning && (
						<div
							className="p-3 bg-warning-50 dark:bg-warning-100/10 border border-warning-200 rounded-lg"
							role="alert"
							aria-live="polite"
						>
							<p className="text-xs text-warning-700 dark:text-warning-500">
								⚠️ Logo size above 25% may affect QR code scannability
							</p>
						</div>
					)}

					{/* Error correction notification */}
					{logo && errorCorrectionLevel === "H" && (
						<div
							className="p-3 bg-primary-50 dark:bg-primary-100/10 border border-primary-200 rounded-lg"
							role="status"
							aria-live="polite"
						>
							<p className="text-xs text-primary-700 dark:text-primary-500">
								ℹ️ Error correction set to High (H) for better logo compatibility
							</p>
						</div>
					)}
				</div>
			)}

			{/* Error display */}
			{error && (
				<div
					className="p-3 bg-danger-50 dark:bg-danger-100/10 border border-danger-200 rounded-lg"
					role="alert"
					aria-live="assertive"
				>
					<p className="text-xs text-danger-700 dark:text-danger-500">
						{error}
					</p>
				</div>
			)}
		</div>
	);
}
