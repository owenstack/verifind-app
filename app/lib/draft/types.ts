import type { Property } from "~/db/property.schema";

export interface DraftStorage {
	drafts: Record<string, PropertyDraftData>;
	lastCleanup: number;
}

export interface PropertyDraftData {
	id: string;
	ownerId: string;
	data: Partial<Property>;
	lastSaved: number;
	autoSaved: boolean;
	version: number;
}

export interface PropertyDraftStore {
	drafts: Record<string, PropertyDraftData>;
	activeDraftId: string | null;
	isAutoSaving: boolean;
	lastCleanup: number;

	saveDraft: (
		draftId: string,
		ownerId: string,
		data: Partial<Property>,
		autoSaved?: boolean,
	) => void;
	getDraft: (draftId: string) => PropertyDraftData | null;
	getUserDrafts: (ownerId: string) => PropertyDraftData[];
	deleteDraft: (draftId: string) => void;
	setActiveDraft: (draftId: string | null) => void;
	publishDraft: (
		draftId: string,
	) => Promise<{ error: string } | { success: boolean; message?: string }>;
	cleanup: (force?: boolean) => void;
	setAutoSaving: (saving: boolean) => void;
}
