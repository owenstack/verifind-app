import { useMutation } from "@tanstack/react-query";
import { Loader2, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTRPC } from "~/trpc/client";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { buttonVariants } from "../ui/button";

export function DeactivateProperty({ id }: { id: string }) {
	const trpc = useTRPC();
	const [open, setOpen] = useState(false);
	const { mutateAsync, isPending } = useMutation(
		trpc.property.deactivateProperty.mutationOptions(),
	);
	const handleDeactivate = async () => {
		try {
			const { error, message } = await mutateAsync({ id });
			if (error) {
				toast.error("Something went wrong", {
					description: error,
				});
			}
			toast.success(message);
		} catch (error) {
			toast.error("Failed to deactivate property.", {
				description: error instanceof Error ? error.message : "Unknown error",
			});
		} finally {
			setOpen(false);
		}
	};
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger className={buttonVariants({ variant: "ghost" })}>
				<TriangleAlert /> Deactivate
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Deactivate Property?</AlertDialogTitle>
					<AlertDialogDescription>
						The property would be marked as inactive and would only be visible
						to you
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDeactivate} disabled={isPending}>
						{isPending ? <Loader2 className="animate-spin" /> : null}
						{isPending ? "Deactivating" : "Deactivate"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function DeleteProperty({ id }: { id: string }) {
	const trpc = useTRPC();
	const [open, setOpen] = useState(false);
	const { mutateAsync, isPending } = useMutation(
		trpc.property.deleteProperty.mutationOptions(),
	);
	const handleDelete = async () => {
		try {
			const { error, message } = await mutateAsync({ id });
			if (error) {
				toast.error("Something went wrong", {
					description: error,
				});
			}
			toast.success(message);
		} catch (error) {
			toast.error("Failed to delete property.", {
				description: error instanceof Error ? error.message : "Unknown error",
			});
		} finally {
			setOpen(false);
		}
	};
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger className={buttonVariants({ variant: "ghost" })}>
				<TriangleAlert /> Delete
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						The property would be permanently deleted and cannot be recovered.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete} disabled={isPending}>
						{isPending ? <Loader2 className="animate-spin" /> : null}
						{isPending ? "Deleting" : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
