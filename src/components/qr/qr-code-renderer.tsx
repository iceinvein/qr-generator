import QRCodeStyling from "qr-code-styling";
import {
	forwardRef,
	useEffect,
	useEffectEvent,
	useImperativeHandle,
	useRef,
} from "react";
import type { QRCodeRendererProps } from "@/types/qr";

/**
 * QRCodeRenderer component
 * Renders a QR code with optional logo overlay using qr-code-styling library
 */
export const QRCodeRenderer = forwardRef<
	HTMLCanvasElement,
	QRCodeRendererProps
>(
	(
		{
			content,
			foregroundColor,
			backgroundColor,
			size,
			margin,
			errorCorrectionLevel,
			logoDataUrl,
			logoSize,
			onRenderComplete,
			onRenderError,
		},
		ref,
	) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const qrRef = useRef<QRCodeStyling | null>(null);

		// Expose the canvas element to parent via ref
		useImperativeHandle(ref, () => {
			const canvas = containerRef.current?.querySelector("canvas");
			if (!canvas) {
				return document.createElement("canvas");
			}
			return canvas;
		});

		// Create stable event handlers
		const handleRenderComplete = useEffectEvent(() => {
			onRenderComplete?.();
		});

		const handleRenderError = useEffectEvent((error: string) => {
			onRenderError?.(error);
		});

		// Track previous margin to detect changes that require recreation
		const prevMarginRef = useRef<number>(margin);

		useEffect(() => {
			if (!containerRef.current || !content || content.trim() === "") {
				return;
			}

			try {
				// Convert logoSize percentage to ratio (0-1)
				const logoSizeRatio = logoSize / 100;

				const errorLevel = errorCorrectionLevel as "L" | "M" | "Q" | "H";

				// If margin changed, we need to recreate the QR code
				// because update() doesn't support margin changes
				const marginChanged = prevMarginRef.current !== margin;
				if (marginChanged && qrRef.current) {
					// Clear the container
					if (containerRef.current) {
						containerRef.current.innerHTML = "";
					}
					qrRef.current = null;
					prevMarginRef.current = margin;
				}

				if (!qrRef.current) {
					// Create new QR code instance
					// Note: margin of 0 means no quiet zone, any value > 0 adds a quiet zone
					// The library seems to treat margin as boolean-like (0 = off, >0 = on with fixed size)
					qrRef.current = new QRCodeStyling({
						width: size,
						height: size,
						type: "canvas",
						data: content,
						margin,
						qrOptions: {
							errorCorrectionLevel: errorLevel,
						},
						dotsOptions: {
							color: foregroundColor,
							type: "square",
							roundSize: false, // Disable rounding to allow precise margin
						},
						backgroundOptions: {
							color: backgroundColor,
						},
						image: logoDataUrl || undefined,
						imageOptions: {
							hideBackgroundDots: true,
							imageSize: logoSizeRatio,
							margin: 4,
							crossOrigin: "anonymous",
						},
					});

					// Append to container
					qrRef.current.append(containerRef.current);
				} else {
					// Update existing QR code
					qrRef.current.update({
						width: size,
						height: size,
						data: content,
						qrOptions: {
							errorCorrectionLevel: errorLevel,
						},
						dotsOptions: {
							color: foregroundColor,
						},
						backgroundOptions: {
							color: backgroundColor,
						},
						image: logoDataUrl || undefined,
						imageOptions: {
							imageSize: logoSizeRatio,
						},
					});
				}

				// Call completion handler after a short delay to ensure rendering is done
				const timeoutId = setTimeout(() => {
					handleRenderComplete();
				}, 50);

				return () => clearTimeout(timeoutId);
			} catch (error) {
				console.error("Error rendering QR code:", error);
				handleRenderError(
					error instanceof Error ? error.message : "Failed to render QR code",
				);
			}
		}, [
			content,
			foregroundColor,
			backgroundColor,
			size,
			margin,
			errorCorrectionLevel,
			logoDataUrl,
			logoSize,
		]);

		// Don't render if there's no content
		if (!content || content.trim() === "") {
			return <div ref={containerRef} />;
		}

		return (
			<div
				ref={containerRef}
				style={{ width: size, height: size }}
				aria-label="QR code"
			/>
		);
	},
);

QRCodeRenderer.displayName = "QRCodeRenderer";
