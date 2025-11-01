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
			<CardBody className="flex min-h-[400px] items-center justify-center p-8">
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
					<Card className="border-danger-200 bg-danger-50 dark:border-danger-800 dark:bg-danger-900/20">
						<CardBody
							className="p-6 text-center"
							role="alert"
							aria-live="assertive"
						>
							<p className="mb-2 font-semibold text-danger-600 dark:text-danger-400">
								Failed to generate QR code
							</p>
							<p className="text-danger-500 text-sm dark:text-danger-300">
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
							shape={debouncedState.shape}
							dotStyle={debouncedState.dotStyle}
							cornerSquareStyle={debouncedState.cornerSquareStyle}
							cornerSquareColor={debouncedState.cornerSquareColor}
							cornerDotStyle={debouncedState.cornerDotStyle}
							cornerDotColor={debouncedState.cornerDotColor}
							logoDataUrl={debouncedState.logoDataUrl}
							logoSize={debouncedState.logoSize}
							logoMargin={debouncedState.logoMargin}
							hideBackgroundDots={debouncedState.hideBackgroundDots}
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
