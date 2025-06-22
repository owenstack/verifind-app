import { useCallback, useEffect, useRef } from "react";
import type { Property } from "~/db/property.schema";
import { usePropertyDraftStore } from "./store";

export function usePropertyDraft(
	ownerId: string,
	initialData?: Partial<Property>,
	existingDraftId?: string,
) {
	const store = usePropertyDraftStore();
	const draftId = useRef(existingDraftId || crypto.randomUUID());
	const autoSaveTimer = useRef<ReturnType<typeof setInterval>>(0);

	// Get current draft data
	const draftData = store.getDraft(draftId.current)?.data || initialData || {};

	// Auto-save with debouncing
	const autoSave = useCallback(
		(data: Partial<Property>) => {
			if (autoSaveTimer.current) {
				clearTimeout(autoSaveTimer.current);
			}

			store.setAutoSaving(true);

			autoSaveTimer.current = setTimeout(() => {
				store.saveDraft(draftId.current, ownerId, data, true);
				store.setAutoSaving(false);
			}, 2000); // 2 second debounce
		},
		[ownerId, store],
	);

	// Manual save
	const saveDraft = useCallback(
		(data: Partial<Property>) => {
			store.saveDraft(draftId.current, ownerId, data, false);
		},
		[ownerId, store],
	);

	// Update draft data
	const updateData = useCallback(
		(updates: Partial<Property>) => {
			const currentDraft = store.getDraft(draftId.current);
			const newData = { ...currentDraft?.data, ...updates };

			// Save immediately to store for UI updates
			store.saveDraft(draftId.current, ownerId, newData, true);

			// Trigger auto-save
			autoSave(newData);
		},
		[ownerId, store, autoSave],
	);

	// Load existing draft
	const loadDraft = useCallback(
		(id: string) => {
			const draft = store.getDraft(id);
			if (draft) {
				draftId.current = id;
				store.setActiveDraft(id);
			}
		},
		[store],
	);

	// Set this as active draft
	useEffect(() => {
		store.setActiveDraft(draftId.current);

		return () => {
			if (autoSaveTimer.current) {
				clearTimeout(autoSaveTimer.current);
			}
		};
	}, [store]);

	const currentDraft = store.getDraft(draftId.current);

	return {
		draftData,
		updateData,
		saveDraft: () => saveDraft(draftData),
		loadDraft,
		isAutoSaving: store.isAutoSaving,
		lastSaved: currentDraft?.lastSaved
			? new Date(currentDraft.lastSaved)
			: null,
		draftId: draftId.current,
	};
}
export function useDraftList(ownerId: string) {
	const store = usePropertyDraftStore();
	const drafts = store.getUserDrafts(ownerId);
	const deleteDraft = useCallback(
		(draftId: string) => {
			store.deleteDraft(draftId);
		},
		[store],
	);
	const cleanup = useCallback(() => {
		store.cleanup(true);
	}, [store]);

	return {
		drafts,
		deleteDraft,
		cleanup,
	};
}
