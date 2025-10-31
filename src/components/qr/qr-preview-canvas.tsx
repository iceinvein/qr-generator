/**
 * QRPreviewCanvas component
 * Displays the generated QR code with loading and error states
 */

import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { forwardRef, useEffect, useRef, useState } from "react";
import { QRCodeRenderer } from "@/components/qr/qr-code-renderer";
import type { QRPreviewCanvasProps } from "@/types/qr";
import { useDebounce } from "@/utils/qr-utils";

export const QRPreviewCanvas = forwardRef<
	HTMLCanvasElement,
	QRPreviewCanvasProps
>(({ state, onGenerationComplete, onGenerationError }, ref) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Debounce the state to prevent excessive re-renders (300ms delay)
	const debouncedState = useDebounce(state, 300);

	// Show loading state when state changes
	useEffect(() => {
		if (debouncedState.content) {
			setIsLoading(true);
		}
	}, [debouncedState.content]);

	// Handle render completion
	const handleRenderComplete = () => {
		setIsLoading(false);
		setError(null);
		onGenerationComplete();
	};

	// Handle render errors
	const handleRenderError = (errorMessage: string) => {
		setIsLoading(false);
		setError(errorMessage);
		onGenerationError(errorMessage);
	};

	return (
		<Card className="w-full">
			<CardBody className="flex items-center justify-center p-8 min-h-[400px]">
				{/* ARIA live region for status announcements */}
				<div
					role="status"
					aria-live="polite"
					aria-atomic="true"
					className="sr-only"
				>
					{isLoading && "Generating QR code"}
					{error && `Error: ${error}`}
					{!isLoading &&
						!error &&
						debouncedState.content &&
						"QR code generated successfully"}
				</div>

				{isLoading && !error && (
					<div
						className="flex flex-col items-center gap-4"
						role="alert"
						aria-busy="true"
					>
						<Spinner size="lg" label="Generating QR code..." />
					</div>
				)}

				{error && (
					<Card className="bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800">
						<CardBody
							className="text-center p-6"
							role="alert"
							aria-live="assertive"
						>
							<p className="text-danger-600 dark:text-danger-400 font-semibold mb-2">
								Failed to generate QR code
							</p>
							<p className="text-danger-500 dark:text-danger-300 text-sm">
								{error}
							</p>
						</CardBody>
					</Card>
				)}

				{!error && (
					<div
						className={
							isLoading ? "opacity-0" : "opacity-100 transition-opacity"
						}
						role="img"
						aria-label={`QR code for ${debouncedState.dataType}: ${debouncedState.content || "empty"}`}
					>
						<QRCodeRenderer
							ref={ref || canvasRef}
							content={debouncedState.content}
							foregroundColor={debouncedState.foregroundColor}
							backgroundColor={debouncedState.backgroundColor}
							size={debouncedState.size}
							margin={debouncedState.margin}
							errorCorrectionLevel={debouncedState.errorCorrectionLevel}
							logoDataUrl={debouncedState.logoDataUrl}
							logoSize={debouncedState.logoSize}
							onRenderComplete={handleRenderComplete}
							onRenderError={handleRenderError}
						/>
					</div>
				)}
			</CardBody>
		</Card>
	);
});

QRPreviewCanvas.displayName = "QRPreviewCanvas";
