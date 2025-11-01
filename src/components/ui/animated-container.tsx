import { motion } from "framer-motion";
import type React from "react";

interface AnimatedContainerProps {
	children: React.ReactNode;
	className?: string;
	stagger?: number;
}

/**
 * AnimatedContainer with staggered children animations
 */
export function AnimatedContainer({
	children,
	className = "",
	stagger = 0.1,
}: AnimatedContainerProps) {
	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={{
				hidden: { opacity: 0 },
				visible: {
					opacity: 1,
					transition: {
						staggerChildren: stagger,
					},
				},
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}

interface AnimatedItemProps {
	children: React.ReactNode;
	className?: string;
}

/**
 * AnimatedItem for use within AnimatedContainer
 */
export function AnimatedItem({ children, className = "" }: AnimatedItemProps) {
	return (
		<motion.div
			variants={{
				hidden: { opacity: 0, y: 20 },
				visible: {
					opacity: 1,
					y: 0,
					transition: {
						duration: 0.5,
						ease: [0.4, 0, 0.2, 1],
					},
				},
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}
