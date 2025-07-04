import { toast } from "sonner";
import { auth } from "~/lib/auth";
import { usePropertyDraft } from "~/lib/draft/hooks";
import { caller } from "~/trpc/utils";
import type { Route } from "./+types/property";

export const loader = async (args: Route.LoaderArgs) => {
	const authz = await auth.api.getSession({ headers: args.request.headers });
	const trpc = await caller(args);
	const userId = authz?.user.id ?? "";
	const propertyId = args.params.propertyId;
	const res = await trpc.property.getPropertyById({
		id: propertyId,
	});
	return {
		data: res,
		userId,
		propertyId,
	};
};

export default function Page({ loaderData }: Route.ComponentProps) {
	const { data, userId, propertyId } = loaderData;
	const _isOwner = data?.data?.ownerId === userId;
	if (data?.error) {
		toast.error("Something went wrong", {
			description: data.error,
		});
	}
	const { loadDraft, draftData } = usePropertyDraft(userId);
	loadDraft(propertyId);

	return "Property Details";
}
