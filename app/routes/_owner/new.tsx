import { useState } from "react";
import { Progress } from "~/components/ui/progress";
import { auth } from "~/lib/auth";
import { usePropertyDraft } from "~/lib/draft/hooks";
import type { Route } from "./+types/new";

export const loader = async ({ request }: Route.LoaderArgs) => {
	const authz = await auth.api.getSession({ headers: request.headers });
	return {
		userId: authz?.user.id ?? "",
	};
};

export default function Page({ loaderData }: Route.ComponentProps) {
	const { userId } = loaderData;
	const { isAutoSaving, updateData, lastSaved } = usePropertyDraft(userId);
	const [step, _setStep] = useState(0);
	const text =
		step === 0
			? "Essentials"
			: step === 1
				? "Features & Pricing"
				: step === 2
					? "Media"
					: step === 3
						? "Amenities"
						: "Contact & Final Review";
	return (
		<div className="flex flex-col">
			<div className="flex flex-col items-baseline">
				<p className="text-base text-muted-foreground font-semibold mb-2">
					Step {step + 1} of 5: {text}
				</p>
				<Progress value={(step + 1) * 20} />
			</div>
		</div>
	);
}

{
	/* <div className='flex min-h-screen flex-col gap-6 p-6'>
			<div className="flex flex-col gap-2"> 
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">{step + 1} of 5</p>
					{isAutoSaving && <p className="text-sm text-muted-foreground">Saving...</p>}
					{lastSaved && <p className="text-sm text-muted-foreground">Last saved {lastSaved}</p>}
				</div>
				<Progress value={(step + 1) * 20} className="h-2" />
			</div>

			<div className="flex-1">
			</div>

			<div className="flex justify-between">
				<button 
					onClick={() => setStep(prev => Math.max(0, prev - 1))}
					disabled={step === 0}
					className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
				>
					Previous
				</button>
				<button 
					onClick={() => setStep(prev => Math.min(4, prev + 1))}
					disabled={step === 4}
					className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
				>
					Next
				</button>
			</div>
		</div> */
}
