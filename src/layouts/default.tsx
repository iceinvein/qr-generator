import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex h-screen flex-col overflow-hidden">
			{/* Animated gradient background */}
			<div className="gradient-bg fixed inset-0 -z-10" />

			{/* Decorative blobs */}
			<motion.div
				className="pointer-events-none fixed -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"
				animate={{
					scale: [1, 1.2, 1],
					rotate: [0, 90, 0],
				}}
				transition={{
					duration: 20,
					repeat: Number.POSITIVE_INFINITY,
					ease: "linear",
				}}
			/>
			<motion.div
				className="pointer-events-none fixed -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-pink-400/20 to-purple-400/20 blur-3xl"
				animate={{
					scale: [1, 1.3, 1],
					rotate: [0, -90, 0],
				}}
				transition={{
					duration: 25,
					repeat: Number.POSITIVE_INFINITY,
					ease: "linear",
				}}
			/>

			<Navbar />
			<motion.main
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="container relative z-10 mx-auto max-w-7xl grow overflow-y-auto px-6 pt-8 pb-20"
			>
				{children}
			</motion.main>
		</div>
	);
}
