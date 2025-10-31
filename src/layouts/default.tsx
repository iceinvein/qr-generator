import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex flex-col h-screen">
			<Navbar />
			<main className="container mx-auto max-w-7xl px-6 grow pt-8 pb-20">
				{children}
			</main>
		</div>
	);
}
