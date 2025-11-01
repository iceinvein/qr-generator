import QRCodeStyling from "qr-code-styling";
import {
	forwardRef,
	useEffect,
	useEffectEvent,
	useImperativeHandle,
	useRef,
} from "react";
import type { ColorOption, QRCodeRendererProps } from "@/types/qr";

/**
 * Convert ColorOption to qr-code-styling format
 */
function convertColorOption(color: ColorOption) {
	if (typeof color === "string") {
		return { color };
	}
	// It's a gradient
	return {
		gradient: {
			type: color.type,
			rotation: color.rotation,
			colorStops: color.colorStops,
		},
	};
}

/**
 * QRCodeRenderer component
 * Renders a QR code with full styling capabilities using qr-code-styling library
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
			shape,
			dotStyle,
			cornerSquareStyle,
			cornerSquareColor,
			cornerDotStyle,
			cornerDotColor,
			logoDataUrl,
			logoSize,
			logoMargin,
			hideBackgroundDots,
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

		// Track previous margin and shape to detect changes that require recreation
		const prevMarginRef = useRef<number>(margin);
		const prevShapeRef = useRef<string>(shape);

		useEffect(() => {
			if (!containerRef.current || !content || content.trim() === "") {
				return;
			}

			try {
				// Convert logoSize percentage to ratio (0-1)
				const logoSizeRatio = logoSize / 100;

				const errorLevel = errorCorrectionLevel as "L" | "M" | "Q" | "H";

				// Convert color options to qr-code-styling format
				const dotsColorConfig = convertColorOption(foregroundColor);
				const backgroundColorConfig = convertColorOption(backgroundColor);
				const cornerSquareColorConfig = convertColorOption(cornerSquareColor);
				const cornerDotColorConfig = convertColorOption(cornerDotColor);

				// If margin or shape changed, we need to recreate the QR code
				const marginChanged = prevMarginRef.current !== margin;
				const shapeChanged = prevShapeRef.current !== shape;

				if ((marginChanged || shapeChanged) && qrRef.current) {
					// Clear the container
					if (containerRef.current) {
						containerRef.current.innerHTML = "";
					}
					qrRef.current = null;
					prevMarginRef.current = margin;
					prevShapeRef.current = shape;
				}

				if (!qrRef.current) {
					// Create new QR code instance with full styling options
					qrRef.current = new QRCodeStyling({
						width: size,
						height: size,
						type: "canvas",
						shape,
						data: content,
						margin,
						qrOptions: {
							errorCorrectionLevel: errorLevel,
						},
						dotsOptions: {
							...dotsColorConfig,
							type: dotStyle,
							roundSize: false,
						},
						backgroundOptions: backgroundColorConfig,
						cornersSquareOptions: {
							...cornerSquareColorConfig,
							type: cornerSquareStyle,
						},
						cornersDotOptions: {
							...cornerDotColorConfig,
							type: cornerDotStyle,
						},
						image: logoDataUrl || undefined,
						imageOptions: {
							hideBackgroundDots,
							imageSize: logoSizeRatio,
							margin: logoMargin,
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
							...dotsColorConfig,
							type: dotStyle,
						},
						backgroundOptions: backgroundColorConfig,
						cornersSquareOptions: {
							...cornerSquareColorConfig,
							type: cornerSquareStyle,
						},
						cornersDotOptions: {
							...cornerDotColorConfig,
							type: cornerDotStyle,
						},
						image: logoDataUrl || undefined,
						imageOptions: {
							hideBackgroundDots,
							imageSize: logoSizeRatio,
							margin: logoMargin,
						},
					});
				}

				handleRenderComplete();
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
			shape,
			dotStyle,
			cornerSquareStyle,
			cornerSquareColor,
			cornerDotStyle,
			cornerDotColor,
			logoDataUrl,
			logoSize,
			logoMargin,
			hideBackgroundDots,
		]);

		// Don't render if there's no content
		if (!content || content.trim() === "") {
			return <div ref={containerRef} />;
		}

		return (
			<div
				ref={containerRef}
				className="flex items-center justify-center"
				aria-label="QR code"
			/>
		);
	},
);

QRCodeRenderer.displayName = "QRCodeRenderer";
