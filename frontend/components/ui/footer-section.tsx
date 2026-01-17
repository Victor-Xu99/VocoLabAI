'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Mic, FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon, TwitterIcon } from 'lucide-react';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Product',
		links: [
			{ title: 'Features', href: '#features' },
			{ title: 'Pricing', href: '#pricing' },
			{ title: 'Testimonials', href: '#testimonials' },
			{ title: 'How It Works', href: '#how-it-works' },
		],
	},
	{
		label: 'Company',
		links: [
			{ title: 'About Us', href: '/about' },
			{ title: 'Privacy Policy', href: '/privacy' },
			{ title: 'Terms of Service', href: '/terms' },
			{ title: 'Contact', href: '/contact' },
		],
	},
	{
		label: 'Resources',
		links: [
			{ title: 'Blog', href: '/blog' },
			{ title: 'Help Center', href: '/help' },
			{ title: 'API Docs', href: '/docs' },
			{ title: 'Community', href: '/community' },
		],
	},
	{
		label: 'Social',
		links: [
			{ title: 'Twitter', href: '#', icon: TwitterIcon },
			{ title: 'LinkedIn', href: '#', icon: LinkedinIcon },
			{ title: 'Instagram', href: '#', icon: InstagramIcon },
			{ title: 'YouTube', href: '#', icon: YoutubeIcon },
		],
	},
];

export function Footer() {
	return (
		<footer className="relative w-full flex flex-col items-center justify-center border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] py-12 lg:py-16">
			<div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

			<div className="container mx-auto px-6 grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
				<AnimatedContainer className="space-y-4">
					<div className="flex items-center gap-2">
						<Mic className="size-8" />
						<span className="text-xl font-bold">VocoLabAI</span>
					</div>
					<p className="text-muted-foreground mt-4 text-sm">
						AI-powered speech training for confident, clear communication.
					</p>
					<p className="text-muted-foreground text-sm">
						© {new Date().getFullYear()} VocoLabAI. All rights reserved.
					</p>
				</AnimatedContainer>

				<div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<div className="mb-10 md:mb-0">
								<h3 className="text-xs font-semibold">{section.label}</h3>
								<ul className="text-muted-foreground mt-4 space-y-2 text-sm">
									{section.links.map((link) => (
										<li key={link.title}>
											<a
												href={link.href}
												className="hover:text-foreground inline-flex items-center transition-all duration-300"
											>
												{link.icon && <link.icon className="me-1 size-4" />}
												{link.title}
											</a>
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
				</div>
			</div>
		</footer>
	);
};

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	// Always return the same structure (motion.div) to prevent hydration mismatch
	// Use the same initial state on server and client - start visible if motion reduced
	// Otherwise, start hidden and animate in
	return (
		<motion.div
			initial={shouldReduceMotion ? { opacity: 1, filter: 'blur(0px)', translateY: 0 } : { filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={shouldReduceMotion ? undefined : { filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={shouldReduceMotion ? undefined : { delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
};
