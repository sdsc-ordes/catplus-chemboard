<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';;
	import type { FilterCategory, FilterDisplayConfig } from '$lib/types/qleverSearch';
	import { FilterDisplays, FilterCategoriesSorted } from '$lib/types/qleverSearch';
	import { Search, Atom } from '@lucide/svelte';
	import {
		initializeCategoryState, toggleGenericSelection, type SelectionState
	} from '$lib/utils/searchForm';
	let { data } = $props();

	interface AccordionItemConfig extends FilterDisplayConfig {
		options: string[];
	}

	const accordionItemsConfig = Object.fromEntries(
		FilterCategoriesSorted.map((categoryKey) => {
			const categorySpecificPicklist = data.picklists?.[categoryKey] ?? [];
			const itemConfig: AccordionItemConfig = {
				label: FilterDisplays[categoryKey].label,
				nameAttr: FilterDisplays[categoryKey].nameAttr,
				options: categorySpecificPicklist,
			};
			return [categoryKey, itemConfig];
		})
	) as Record<FilterCategory, AccordionItemConfig>;

	const initialSelectionsObject = Object.fromEntries(
		FilterCategoriesSorted.map((categoryKey) => {
			const categorySpecificInitialData = data.initialFilters?.[categoryKey] ?? [];
			return [categoryKey, initializeCategoryState(categoryKey, categorySpecificInitialData)];
		})
	) as Record<FilterCategory, SelectionState>;

	let selections = $state<Record<FilterCategory, SelectionState>>(initialSelectionsObject);
	let value = $state<string[]>([]);
</script>

<form
	method="POST"
	action="?/search"
	class="bg-secondary-100 mx-auto w-full max-w-md space-y-4 rounded"
>
	<Accordion {value} onValueChange={(e) => (value = e.value)} multiple>
		{#each FilterCategoriesSorted as key}
			<Accordion.Item
				value={key}
				classes="text-sm"
				controlClasses={selections[key].active ? 'bg-primary-50' : ''}
			>
			    <p>{accordionItemsConfig[key].options}</p>
				<!-- Control -->
			{#snippet lead()}
			<Atom size={24} /><input
						class="hidden"
						name={key}
						value={selections[key].display}
					/>
			{/snippet}
				{#snippet control()}{accordionItemsConfig[key].label}: {selections[key].display}{/snippet}
				<!-- Panel -->
				{#snippet panel()}
					{#each accordionItemsConfig[key].options as optionValue}
						<label class="flex cursor-pointer items-center space-x-2">
							<input
								class="checkbox"
								type="checkbox"
								value={optionValue}
								checked={selections[key].selected.has(optionValue)}
								onchange={(e) =>
									toggleGenericSelection(
										selections,
										key,
										optionValue,
										e.currentTarget.checked
									)}
							/>
							<p class="break-words">{optionValue}</p>
						</label>
					{/each}
				{/snippet}
			</Accordion.Item>
		{/each}
	</Accordion>
	<div class="flex justify-start">
		<button type="submit" class="btn preset-filled-primary-500 w-full">
			<Search />Apply Search Filter
		</button>
	</div>
</form>
