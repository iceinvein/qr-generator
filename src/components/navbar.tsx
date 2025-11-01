import { Link } from "@heroui/link";
import {
	Navbar as HeroUINavbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@heroui/navbar";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";

export const Navbar = () => {
	return (
		<HeroUINavbar
			maxWidth="xl"
			position="sticky"
			className="glass-navbar shadow-lg"
			classNames={{
				wrapper: "px-4 sm:px-6",
			}}
		>
			<NavbarContent justify="start">
				<NavbarBrand>
					<motion.div
						className="flex items-center gap-2"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						<motion.div
							animate={{
								rotate: [0, 10, -10, 10, 0],
								scale: [1, 1.1, 1.1, 1.1, 1],
							}}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								repeatDelay: 3,
							}}
						>
							<Sparkles className="h-6 w-6 text-primary" />
						</motion.div>
						<Link
							className="font-bold text-inherit text-xl"
							color="foreground"
							href="/"
						>
							{siteConfig.name}
						</Link>
					</motion.div>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent justify="end">
				<NavbarItem>
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<ThemeSwitch />
					</motion.div>
				</NavbarItem>
			</NavbarContent>
		</HeroUINavbar>
	);
};
