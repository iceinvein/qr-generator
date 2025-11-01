import { motion, type HTMLMotionProps } from "framer-motion";
import type React from "react";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
	children: React.ReactNode;
	delay?: number;
	glass?: boolean;
	hover?: boolean;
}

/**
 * AnimatedCard component with glassmorphism and entrance animations
 */
export function AnimatedCard({
	children,
	delay = 0,
	glass = true,
	hover = true,
	className = "",
	...props
}: AnimatedCardProps) {
	const glassClass = glass ? "glass-card" : "";
	const hoverScale = hover ? 1.02 : 1;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.5,
				delay,
				ease: [0.4, 0, 0.2, 1],
			}}
			whileHover={{ scale: hoverScale }}
			className={`rounded-xl ${glassClass} ${className}`}
			{...props}
		>
			{children}
		</motion.div>
	);
}
