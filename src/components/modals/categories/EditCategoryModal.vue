<script setup lang="ts">
import { ref, watch } from "vue";
import type { Category } from "@/types/category";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  category: Category | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "save", category: Category): void;
}>();

// estado interno editável do formulário
const form = ref<Category | null>(null);

watch(
  () => props.category,
  (newVal) => {
    form.value = newVal ? { ...newVal } : null; // clona para não mutar direto
  },
  { immediate: true }
);

const handleClose = () => emit("update:open", false);

const handleSave = () => {
  if (form.value) {
    emit("save", form.value);
    handleClose();
  }
};
</script>

<template>
  <Dialog :open="open" @update:open="val => emit('update:open', val)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Categoria</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <Input
          v-model="form!.name"
          placeholder="Nome da categoria"
        />
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleClose">Cancelar</Button>
        <Button @click="handleSave">Salvar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
