import type { Updater } from "@tanstack/vue-table";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Ref } from "vue";
import type { Epi } from "@/types/epi";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function valueUpdater<T extends Updater<any>>(
	updaterOrValue: T,
	ref: Ref,
) {
	ref.value =
		typeof updaterOrValue === "function"
			? updaterOrValue(ref.value)
			: updaterOrValue;
}

export function mapEpiToForm(epi: Epi | null) {
	if (!epi)
		return {
			name: "",
			description: "",
			ca: null,
			categoryId: null,
			expiration: new Date(),
		};
	return {
		name: epi.name,
		description: epi.description,
		ca: epi.ca,
		categoryId: epi.categoryId,
		expiration: epi.expiration,
	};
}
