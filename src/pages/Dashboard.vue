<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { type EpiMetricsResponse, metricsService } from "@/services/metric.service";

  const metrics = ref<EpiMetricsResponse>({
    total: 0,
    expired: 0,
    byCategory: {},
  });

  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchMetrics() {
    try {
      loading.value = true;
      error.value = null;
      metrics.value = await metricsService.get();
    } catch (err) {
      console.error(err);
      error.value = "Erro ao carregar métricas";
    } finally {
      loading.value = false;
    }
  }

  onMounted(fetchMetrics);
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">Dashboard</h1>

    <div v-if="loading" class="text-muted-foreground">Carregando...</div>

    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total EPIs</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ metrics.total }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>EPIs Expirados</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold text-red-600">{{ metrics.expired }}</div>
        </CardContent>
      </Card>

      <Card class="lg:col-span-3">
        <CardHeader>
          <CardTitle>EPIs por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div
              v-for="(count, category) in metrics.byCategory"
              :key="category"
              class="flex justify-between"
            >
              <span class="font-medium">{{ category }}</span>
              <span class="font-bold">{{ count }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="flex justify-end">
      <Button variant="outline" @click="fetchMetrics">Refresh</Button>
    </div>
  </div>
</template>
