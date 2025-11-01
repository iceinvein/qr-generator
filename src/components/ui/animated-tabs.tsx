import { motion, type Transition } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export interface AnimatedTab {
	id: string;
	label: string;
	content: React.ReactNode;
	color?: string;
}

export interface AnimatedTabsProps {
	tabs: AnimatedTab[];
	defaultTab?: string;
	onTabChange?: (tabId: string) => void;
	transition?: Transition;
	enableBlur?: boolean;
	minHeight?: number;
	maxHeight?: number;
}

/**
 * AnimatedTabs component with smooth swipe animations
 * Inspired by modern mobile UI patterns
 */
export function AnimatedTabs({
	tabs,
	defaultTab,
	onTabChange,
	transition = { type: "spring", stiffness: 300, damping: 30 },
	enableBlur = false,
	minHeight = 200,
	maxHeight,
}: AnimatedTabsProps) {
	const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
	const [contentHeight, setContentHeight] = useState<number>(minHeight);
	const contentRefs = useRef<Map<string, HTMLDivElement>>(new Map());

	const handleTabChange = (tabId: string) => {
		setActiveTab(tabId);
		onTabChange?.(tabId);
	};

	const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

	// Measure and update height when active tab changes
	useEffect(() => {
		const activeContent = contentRefs.current.get(activeTab);
		if (activeContent) {
			const measureHeight = () => {
				// Get the full height including padding and margins
				const rect = activeContent.getBoundingClientRect();
				const computedStyle = window.getComputedStyle(activeContent);
				const marginTop = Number.parseFloat(computedStyle.marginTop);
				const marginBottom = Number.parseFloat(computedStyle.marginBottom);

				// Add parent padding (p-2 = 8px on each side = 16px total)
				const parentPadding = 16;
				const totalHeight =
					rect.height + marginTop + marginBottom + parentPadding;

				// Clamp between min and max height
				let finalHeight = Math.max(totalHeight, minHeight);
				if (maxHeight) {
					finalHeight = Math.min(finalHeight, maxHeight);
				}

				setContentHeight(finalHeight);
			};

			// Use ResizeObserver for accurate height measurement
			const resizeObserver = new ResizeObserver(() => {
				measureHeight();
			});

			resizeObserver.observe(activeContent);

			// Initial measurement with a small delay to ensure content is rendered
			requestAnimationFrame(() => {
				measureHeight();
			});

			return () => {
				resizeObserver.disconnect();
			};
		}
	}, [activeTab, minHeight, maxHeight]);

	return (
		<div className="flex w-full flex-col gap-2">
			{/* Content Container with animated height */}
			<motion.div
				className="relative w-full rounded-xl border border-default-200 bg-default-50/50 backdrop-blur-md"
				animate={{ height: contentHeight }}
				transition={transition}
				style={{ overflow: "hidden" }}
			>
				{tabs.map((tab, index) => {
					const offset = (index - activeIndex) * 100;
					const isActive = tab.id === activeTab;

					return (
						<motion.div
							key={tab.id}
							className="absolute top-0 right-0 left-0 h-full p-2"
							initial={false}
							animate={{
								x: `${offset}%`,
								opacity: isActive ? 1 : 0,
								filter: enableBlur && !isActive ? "blur(4px)" : "blur(0px)",
							}}
							transition={transition}
							style={{
								transformOrigin: "center center",
								willChange: "transform, filter",
								isolation: "isolate",
								pointerEvents: isActive ? "auto" : "none",
								overflowY: maxHeight ? "auto" : "visible",
							}}
						>
							<div
								ref={(el) => {
									if (el) {
										contentRefs.current.set(tab.id, el);
									}
								}}
								className="flex w-full flex-col gap-3 rounded-lg p-8"
							>
								{tab.content}
							</div>
						</motion.div>
					);
				})}
			</motion.div>

			{/* Tab Buttons */}
			<ul className="flex w-full gap-0 rounded-xl border border-default-200 bg-default-50/50 p-1 backdrop-blur-md">
				{tabs.map((tab, index) => {
					const isActive = tab.id === activeTab;

					return (
						<li
							key={tab.id}
							className="flex flex-1"
							style={{
								padding:
									index === 0
										? "0 0 0 0"
										: index === tabs.length - 1
											? "0 0 0 0"
											: "0",
							}}
						>
							<button
								type="button"
								onClick={() => handleTabChange(tab.id)}
								className="relative w-full cursor-pointer rounded-lg px-4 py-2 font-medium text-sm transition-colors"
								aria-current={isActive ? "page" : undefined}
							>
								<span
									className="relative z-10"
									style={{
										color: isActive ? "white" : "var(--nextui-default-500)",
									}}
								>
									{tab.label}
								</span>

								{/* Animated Background */}
								{isActive && (
									<motion.span
										layoutId="activeTab"
										className="absolute inset-0 rounded-lg"
										style={{
											backgroundColor: tab.color || "var(--nextui-primary)",
										}}
										transition={transition}
									/>
								)}
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
