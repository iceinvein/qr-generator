/**
 * SEO Component
 * Dynamically updates meta tags for better SEO
 */

import { useEffect } from "react";

interface SEOProps {
	title?: string;
	description?: string;
	keywords?: string;
	image?: string;
	url?: string;
	type?: string;
}

export function SEO({
	title = "QR Code Generator - Create Custom QR Codes with Logo | Free Online Tool",
	description = "Free online QR code generator. Create customizable QR codes for URLs, WiFi, contacts, events, and more. Add logos, customize colors, and export as PNG or SVG. No signup required.",
	keywords = "qr code generator, qr code maker, custom qr code, qr code with logo, wifi qr code, vcard qr code, free qr code",
	image = "https://qrcodegen.app/og-image.png",
	url = "https://qrcodegen.app/",
	type = "website",
}: SEOProps) {
	useEffect(() => {
		// Update document title
		document.title = title;

		// Update or create meta tags
		const updateMetaTag = (
			name: string,
			content: string,
			isProperty = false,
		) => {
			const attribute = isProperty ? "property" : "name";
			let element = document.querySelector(
				`meta[${attribute}="${name}"]`,
			) as HTMLMetaElement;

			if (!element) {
				element = document.createElement("meta");
				element.setAttribute(attribute, name);
				document.head.appendChild(element);
			}

			element.content = content;
		};

		// Primary meta tags
		updateMetaTag("title", title);
		updateMetaTag("description", description);
		updateMetaTag("keywords", keywords);

		// Open Graph
		updateMetaTag("og:title", title, true);
		updateMetaTag("og:description", description, true);
		updateMetaTag("og:image", image, true);
		updateMetaTag("og:url", url, true);
		updateMetaTag("og:type", type, true);

		// Twitter Card
		updateMetaTag("twitter:title", title);
		updateMetaTag("twitter:description", description);
		updateMetaTag("twitter:image", image);
		updateMetaTag("twitter:url", url);

		// Update canonical link
		let canonical = document.querySelector(
			'link[rel="canonical"]',
		) as HTMLLinkElement;
		if (!canonical) {
			canonical = document.createElement("link");
			canonical.rel = "canonical";
			document.head.appendChild(canonical);
		}
		canonical.href = url;
	}, [title, description, keywords, image, url, type]);

	return null;
}
