<script setup lang="ts">
import type {
	ColumnDef,
	ColumnFiltersState,
	ExpandedState,
	SortingState,
	VisibilityState,
} from "@tanstack/vue-table";
import {
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useVueTable,
} from "@tanstack/vue-table";
import { ChevronDown } from "lucide-vue-next";
import { ref, watch } from "vue";
import DataTable from "@/components/categories/data-table.vue";
import { columns as epiColumns } from "@/components/epis/columns";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { Epi } from "@/types/epi";

const data = ref<Epi[]>([]);

const pageIndex = ref(0);
const pageSize = ref(5);
const totalCount = ref(0);
const filterName = ref("");

async function fetchEpis() {
	const allEpis: Epi[] = [
		{
			id: "1",
			name: "Capacete",
			description: "Capacete de segurança",
			ca: 1234,
			categoryId: "1",
			category: { id: "1", name: "Test" },
			expiration: new Date("2026-01-01"),
		},
		{
			id: "2",
			name: "Luvas",
			description: "Luvas resistentes",
			ca: 5678,
			categoryId: "1",
			category: { id: "1", name: "Test" },
			expiration: new Date("2025-12-31"),
		},
		{
			id: "3",
			name: "Botas",
			description: "Botas de segurança",
			ca: 9012,
			categoryId: "1",
			category: { id: "1", name: "Test" },
			expiration: new Date("2025-06-30"),
		},
		// adicione mais conforme necessário
	];

	const filtered = allEpis.filter((e) =>
		e.name.toLowerCase().includes(filterName.value.toLowerCase()),
	);

	totalCount.value = filtered.length;

	const start = pageIndex.value * pageSize.value;
	data.value = filtered.slice(start, start + pageSize.value);
}

// Sempre que filtro ou página mudar, busca de novo
watch([filterName, pageIndex, pageSize], fetchEpis, { immediate: true });

// Estado da tabela
const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

const table = useVueTable({
	data,
	columns: epiColumns as ColumnDef<Epi>[],
	getCoreRowModel: getCoreRowModel(),
	getSortedRowModel: getSortedRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
	getExpandedRowModel: getExpandedRowModel(),
	getPaginationRowModel: getPaginationRowModel(),
	pageCount: Math.ceil(totalCount.value / pageSize.value),
	state: {
		get sorting() {
			return sorting.value;
		},
		get columnFilters() {
			return columnFilters.value;
		},
		get columnVisibility() {
			return columnVisibility.value;
		},
		get rowSelection() {
			return rowSelection.value;
		},
		get expanded() {
			return expanded.value;
		},
	},
});
</script>

<template>
  <div class="w-full">
    <h1 class="flex font-bold text-2xl">Epis</h1>
    <div class="flex items-center py-4 gap-2">
      <Input
        class="max-w-sm"
        placeholder="Filter EPI..."
        v-model="filterName"
      />

      <Button
        variant="outline"
        @click="console.log('Criar novo EPI')"
      >
        New EPI
      </Button>

      <div class="flex-1"></div>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline">
            Columns <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table.getAllColumns().filter(c => c.getCanHide())"
            :key="column.id"
            class="capitalize"
            :model-value="column.getIsVisible()"
            @update:model-value="(value) => column.toggleVisibility(!!value)"
          >
            {{ column.id }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <DataTable :columns="epiColumns" :data="data" />

    <div class="flex items-center justify-end gap-2 py-4">
      <div class="text-sm text-muted-foreground">
        {{ pageIndex * pageSize + 1 }} -
        {{ Math.min((pageIndex + 1) * pageSize, totalCount) }} of {{ totalCount }}
      </div>
      <Button
        variant="outline"
        size="sm"
        :disabled="pageIndex === 0"
        @click="pageIndex--"
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        :disabled="(pageIndex + 1) * pageSize >= totalCount"
        @click="pageIndex++"
      >
        Next
      </Button>
    </div>
  </div>
</template>
