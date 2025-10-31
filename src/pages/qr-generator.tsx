/**
 * QRGeneratorPage component
 * Main page that orchestrates the QR code generation experience
 */

import { useRef, useState } from "react";
import { ExportControls } from "@/components/qr/export-controls";
import { QRInputPanel } from "@/components/qr/qr-input-panel";
import { QRPreviewCanvas } from "@/components/qr/qr-preview-canvas";
import { SEO } from "@/components/seo";
import DefaultLayout from "@/layouts/default";
import type { QRState } from "@/types/qr";

export default function QRGeneratorPage() {
	// Initialize QR state with default values
	const [qrState, setQRState] = useState<QRState>({
		// Data configuration
		dataType: "text",
		content: "",

		// Style configuration
		foregroundColor: "#000000",
		backgroundColor: "#ffffff",
		size: 256,
		margin: 4,
		errorCorrectionLevel: "M",

		// Branding
		logo: null,
		logoDataUrl: null,
		logoSize: 20,

		// Export
		exportFormat: "png",

		// UI state
		isGenerating: false,
		error: null,
	});

	// Canvas ref for export functionality
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// State update handler
	const handleStateChange = (updates: Partial<QRState>) => {
		setQRState((prev) => ({
			...prev,
			...updates,
		}));
	};

	// Generation complete handler
	const handleGenerationComplete = () => {
		setQRState((prev) => ({
			...prev,
			isGenerating: false,
			error: null,
		}));
	};

	// Generation error handler
	const handleGenerationError = (error: string) => {
		setQRState((prev) => ({
			...prev,
			isGenerating: false,
			error,
		}));
	};

	return (
		<DefaultLayout>
			{/* SEO Meta Tags */}
			<SEO
				title="QR Magic - Create Custom QR Codes with Logo | Free Online Tool"
				description="Free online QR code generator. Create customizable QR codes for URLs, WiFi, contacts, events, and more. Add logos, customize colors, and export as PNG or SVG. No signup required."
				keywords="qr code generator, qr code maker, custom qr code, qr code with logo, wifi qr code, vcard qr code, free qr code, qr code creator, online qr generator, qr magic"
			/>

			{/* Skip to main content link for keyboard navigation */}
			<a
				href="#qr-input"
				className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
			>
				Skip to QR input
			</a>
			<a
				href="#qr-preview"
				className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
			>
				Skip to preview
			</a>

			<div>
				{/* Responsive layout: single column on mobile, two columns on desktop */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{/* Left column: Input Panel */}
					<div
						id="qr-input"
						className="h-full w-full overflow-hidden"
						tabIndex={-1}
					>
						<QRInputPanel state={qrState} onStateChange={handleStateChange} />
					</div>

					{/* Right column: Preview and Export */}
					<div
						id="qr-preview"
						className="flex w-full flex-col gap-6 overflow-y-auto"
						tabIndex={-1}
					>
						<QRPreviewCanvas
							ref={canvasRef}
							state={qrState}
							onGenerationComplete={handleGenerationComplete}
							onGenerationError={handleGenerationError}
						/>
						<ExportControls state={qrState} canvasRef={canvasRef} />
					</div>
				</div>
			</div>
		</DefaultLayout>
	);
}
