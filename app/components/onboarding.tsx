import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateUser } from "~/lib/auth.client";
import type { OnboardingContent } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "./ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

export function OnboardingDialog({
	open,
	slides,
}: { open?: boolean; slides: OnboardingContent[] }) {
	const [isOpen, setIsOpen] = useState(open ?? false);
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		if (!api) {
			return;
		}
		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);
		api.on("select", () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	const finalize = async () => {
		setLoading(true);
		try {
			await updateUser(
				{ onboarded: true },
				{
					onSuccess: () => setIsOpen(false),
					onError: (ctx) => {
						toast.error("Failed to update onboarding status", {
							description: ctx.error.message,
						});
					},
				},
			);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "An error occurred";
			console.error(errorMessage);
			toast.error("Failed to update onboarding status", {
				description: errorMessage,
			});
		} finally {
			setLoading(false);
			setIsOpen(false);
		}
	};

	const selectPrevious = () => {
		if (!api) return;
		const previousIndex = api.selectedScrollSnap() - 1;
		if (previousIndex >= 0) {
			api.scrollTo(previousIndex);
		}
	};
	const selectNext = () => {
		if (!api) return;
		const nextIndex = api.selectedScrollSnap() + 1;
		if (nextIndex < count) {
			api.scrollTo(nextIndex);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="w-full max-w-lg mx-auto p-0 overflow-hidden">
				<DialogTitle className="sr-only">Onboarding carousel</DialogTitle>
				<div className="w-full p-6">
					<Carousel setApi={setApi} className="w-full">
						<CarouselContent className="-ml-2 md:-ml-4">
							{slides.map((slide) => (
								<CarouselItem
									key={slide.title}
									className="pl-2 md:pl-4 basis-full"
								>
									<div className="flex flex-col items-center text-center space-y-4 px-2">
										<div className="flex justify-center items-center h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0">
											{slide.illustration}
										</div>
										<div className="space-y-2 max-w-sm">
											<h2 className="text-lg sm:text-xl font-semibold text-primary leading-tight">
												{slide.title}
											</h2>
											<p className="text-sm text-muted-foreground leading-relaxed break-words">
												{slide.description}
											</p>
										</div>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>

						{/* Dots indicator */}
						<div className="flex items-center justify-center gap-2 mt-6 mb-4">
							{Array.from({ length: count }).map((_, index) => (
								<button
									type="button"
									key={`dot-${
										// biome-ignore lint/suspicious/noArrayIndexKey: <index used for unique key>
										index
									}`}
									onClick={() => api?.scrollTo(index)}
									className={cn(
										"h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
										current === index + 1
											? "w-6 bg-primary"
											: "w-2 bg-muted hover:bg-muted-foreground/50",
									)}
									aria-label={`Go to slide ${index + 1}`}
								/>
							))}
						</div>

						{/* Navigation controls */}
						<div className="flex items-center justify-between">
							<Button
								variant="outline"
								size="icon"
								className="rounded-full h-10 w-10"
								onClick={selectPrevious}
								disabled={current === 1}
								aria-label="Previous slide"
							>
								<ArrowLeft className="h-4 w-4" />
							</Button>

							<span className="text-xs text-muted-foreground px-2">
								{current} of {count}
							</span>

							{current === count ? (
								<Button
									onClick={finalize}
									disabled={loading}
									className="rounded-full h-10 w-10"
									size="icon"
									aria-label="Complete onboarding"
								>
									{" "}
									{loading ? (
										<Loader2 className="size-4 animate-spin" />
									) : (
										<Check className="size-4" />
									)}
								</Button>
							) : (
								<Button
									variant="outline"
									size="icon"
									className="rounded-full h-10 w-10"
									onClick={selectNext}
									aria-label="Next slide"
								>
									<ArrowRight className="h-4 w-4" />
								</Button>
							)}
						</div>
					</Carousel>
				</div>
			</DialogContent>
		</Dialog>
	);
}
