import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { insertPropertySchema } from "~/db/property.zod";
import { client } from "~/trpc/client";
import type { PropertyDraftData, PropertyDraftStore } from "./types";

const MAX_DRAFTS = 10;
const CLEANUP_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days

export const usePropertyDraftStore = create<PropertyDraftStore>()(
	subscribeWithSelector(
		persist(
			immer((set, get) => ({
				// Initial state
				drafts: {},
				activeDraftId: null,
				isAutoSaving: false,
				lastCleanup: Date.now(),

				// Actions
				saveDraft: (draftId, ownerId, data, autoSaved = true) => {
					set((state) => {
						state.drafts[draftId] = {
							id: draftId,
							ownerId,
							data,
							lastSaved: Date.now(),
							autoSaved,
							version: (state.drafts[draftId]?.version || 0) + 1,
						};

						// Limit number of drafts
						const draftEntries = Object.entries(state.drafts);
						if (draftEntries.length > MAX_DRAFTS) {
							const oldest = draftEntries.sort(
								([, a], [, b]) =>
									(a as PropertyDraftData).lastSaved -
									(b as PropertyDraftData).lastSaved,
							)[0][0];
							delete state.drafts[oldest];
						}
					});
				},

				getDraft: (draftId) => {
					return get().drafts[draftId] || null;
				},

				getUserDrafts: (ownerId) => {
					const { drafts } = get();
					return Object.values(drafts)
						.filter((draft) => draft.ownerId === ownerId)
						.sort((a, b) => b.lastSaved - a.lastSaved);
				},

				deleteDraft: (draftId) => {
					set((state) => {
						delete state.drafts[draftId];
						if (state.activeDraftId === draftId) {
							state.activeDraftId = null;
						}
					});
				},

				setActiveDraft: (draftId) => {
					set((state) => {
						state.activeDraftId = draftId;
					});
				},
				publishDraft: async (draftId) => {
					const draft = get().getDraft(draftId);
					if (!draft) return { error: "Draft not found" };
					try {
						const { error, data } = await insertPropertySchema.safeParseAsync(
							draft.data,
						);
						if (error) {
							return { error: error.message };
						}
						const { error: resError, message } =
							await client.property.publishProperty.mutate(data);
						if (resError) {
							return { error: resError };
						}

						// Remove draft after successful publish
						get().deleteDraft(draftId);
						return { success: true, message };
					} catch (error) {
						console.error("Failed to publish draft:", error);
						return {
							error:
								error instanceof Error
									? error.message
									: "An unexpected error occurred.",
						};
					}
				},

				cleanup: (force = false) => {
					set((state) => {
						const now = Date.now();

						if (!force && now - state.lastCleanup < CLEANUP_INTERVAL) {
							return;
						}

						const cutoff = now - CLEANUP_INTERVAL;
						const draftsToKeep: Record<string, PropertyDraftData> = {};

						for (const [id, draft] of Object.entries(state.drafts) as [
							string,
							PropertyDraftData,
						][]) {
							if (draft.lastSaved > cutoff) {
								draftsToKeep[id] = draft;
							}
						}

						state.drafts = draftsToKeep;
						state.lastCleanup = now;
					});
				},

				setAutoSaving: (saving) => {
					set((state) => {
						state.isAutoSaving = saving;
					});
				},
			})),
			{
				name: "property-drafts",
				// Only persist drafts and lastCleanup, not UI state
				partialize: (state) => ({
					drafts: state.drafts,
					lastCleanup: state.lastCleanup,
				}),
			},
		),
	),
);

class DraftCleanupService {
	private static instance: DraftCleanupService;
	private cleanupTimer: ReturnType<typeof setInterval> | null = null;
	private readonly CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

	private constructor() {
		this.startPeriodicCleanup();

		// Initial cleanup on page load
		usePropertyDraftStore.getState().cleanup();
	}

	static getInstance(): DraftCleanupService {
		if (!DraftCleanupService.instance) {
			DraftCleanupService.instance = new DraftCleanupService();
		}
		return DraftCleanupService.instance;
	}

	private startPeriodicCleanup(): void {
		this.cleanupTimer = setInterval(() => {
			usePropertyDraftStore.getState().cleanup();
		}, this.CLEANUP_INTERVAL);
	}

	destroy(): void {
		if (this.cleanupTimer) {
			clearInterval(this.cleanupTimer);
			this.cleanupTimer = null;
		}
	}
}

// Initialize cleanup service
if (typeof window !== "undefined") {
	DraftCleanupService.getInstance();
}
