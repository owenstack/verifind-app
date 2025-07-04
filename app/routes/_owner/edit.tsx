import { caller } from "~/trpc/utils";
import type { Route } from "./+types/edit";

export const loader = async (args: Route.LoaderArgs) => {
	const trpc = await caller(args);
	const res = await trpc.property.getPropertyById({
		id: args.params.propertyId,
	});
	return { res };
};

export default function Page({ loaderData }: Route.ComponentProps) {
	const { res } = loaderData;
	return "Edit Page";
}
