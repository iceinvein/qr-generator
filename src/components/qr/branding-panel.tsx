/**
 * BrandingPanel component for logo upload and configuration
 */

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Slider } from "@heroui/slider";
import { Switch } from "@heroui/switch";
import { Tooltip } from "@heroui/tooltip";
import { useRef, useState } from "react";
import type { BrandingPanelProps } from "@/types/qr";
import { validateLogoFile } from "@/utils/qr-validation";

export function BrandingPanel({
	logo,
	logoDataUrl,
	logoSize,
	logoMargin,
	hideBackgroundDots,
	errorCorrectionLevel,
	onLogoUpload,
	onLogoRemove,
	onLogoSizeChange,
	onLogoMarginChange,
	onHideBackgroundDotsChange,
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
				<h3 className="mb-2 font-medium text-sm">Logo Branding</h3>
				<p className="mb-3 text-default-500 text-xs">
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
					className={`w-full cursor-pointer border-2 border-dashed transition-colors ${
						isDragging
							? "border-primary bg-primary-50 dark:bg-primary-100/10"
							: "border-default-300 hover:border-primary hover:bg-default-100"
					}`}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<CardBody className="flex w-full flex-col items-center justify-center gap-3 py-12">
						<svg
							className={`h-16 w-16 ${isDragging ? "text-primary" : "text-default-400"}`}
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
							<p className="text-center font-semibold text-base">
								{isDragging ? "Drop logo here" : "Drag & drop logo here"}
							</p>
							<p className="text-center text-default-500 text-sm">
								or click to browse
							</p>
						</div>
						<p className="text-center text-default-400 text-xs">
							PNG, JPG, or SVG (max 2MB)
						</p>
					</CardBody>
				</Card>
			) : (
				<div className="space-y-3">
					{/* Logo preview */}
					<div className="relative rounded-lg border-2 border-default-200 bg-default-50 p-4 dark:bg-default-100">
						<img
							src={logoDataUrl}
							alt="Logo preview"
							className="mx-auto max-h-32 max-w-full object-contain"
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
							<label className="font-medium text-sm">
								Logo Size: {logoSize}%
							</label>
						</Tooltip>
						<Tooltip content="Drag to adjust logo size (10-50%). Keep below 40% for best scannability">
							<Slider
								size="sm"
								step={1}
								minValue={10}
								maxValue={50}
								value={logoSize}
								onChange={handleLogoSizeChange}
								aria-label="Logo size percentage"
								className="max-w-full"
							/>
						</Tooltip>
						<p className="text-default-500 text-xs">
							Recommended: 10-40% for optimal scannability
						</p>
					</div>

					{/* Logo margin slider */}
					<div className="space-y-2">
						<Tooltip content="Adjust padding around the logo">
							<label className="font-medium text-sm">
								Logo Margin: {logoMargin}px
							</label>
						</Tooltip>
						<Tooltip content="Drag to adjust logo margin (0-20px)">
							<Slider
								size="sm"
								step={1}
								minValue={0}
								maxValue={20}
								value={logoMargin}
								onChange={(value: number | number[]) => {
									const margin = Array.isArray(value) ? value[0] : value;
									onLogoMarginChange(margin);
								}}
								aria-label="Logo margin in pixels"
								className="max-w-full"
							/>
						</Tooltip>
						<p className="text-default-500 text-xs">
							Adds white space around the logo
						</p>
					</div>

					{/* Hide background dots switch */}
					<div className="space-y-2">
						<Tooltip content="Hide QR code dots behind the logo for cleaner appearance">
							<Switch
								isSelected={hideBackgroundDots}
								onValueChange={onHideBackgroundDotsChange}
								size="sm"
							>
								<span className="font-medium text-sm">
									Hide Background Dots
								</span>
							</Switch>
						</Tooltip>
						<p className="text-default-500 text-xs">
							Removes QR dots covered by the logo
						</p>
					</div>

					{/* Warning for large logo size */}
					{showWarning && (
						<div
							className="rounded-lg border border-warning-200 bg-warning-50 p-3 dark:bg-warning-100/10"
							role="alert"
							aria-live="polite"
						>
							<p className="text-warning-700 text-xs dark:text-warning-500">
								⚠️ Logo size above 25% may affect QR code scannability
							</p>
						</div>
					)}

					{/* Error correction notification */}
					{logo && errorCorrectionLevel === "H" && (
						<div
							className="rounded-lg border border-primary-200 bg-primary-50 p-3 dark:bg-primary-100/10"
							role="status"
							aria-live="polite"
						>
							<p className="text-primary-700 text-xs dark:text-primary-500">
								ℹ️ Error correction set to High (H) for better logo compatibility
							</p>
						</div>
					)}
				</div>
			)}

			{/* Error display */}
			{error && (
				<div
					className="rounded-lg border border-danger-200 bg-danger-50 p-3 dark:bg-danger-100/10"
					role="alert"
					aria-live="assertive"
				>
					<p className="text-danger-700 text-xs dark:text-danger-500">
						{error}
					</p>
				</div>
			)}
		</div>
	);
}
