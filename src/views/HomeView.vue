<template>
  <VRow class="match-height">
    <VCol
      cols="12"
      md="4"
    >
      <AnalyticsAward />
    </VCol>
    <VCol
      cols="12"
      md="8"
    >
      <AnalyticsTransactions />
    </VCol>
    <VCol
      cols="12"
      md="4"
    >
      <AnalyticsTotalEarning />
    </VCol>


  </VRow>
</template>


<script setup lang="ts">
import AnalyticsAward from '@/components/dashboard/AnalyticsAward.vue'
import AnalyticsTransactions from '@/components/dashboard/AnalyticsTransactions.vue'
import AnalyticsTotalEarning from '@/components/dashboard/AnalyticsTotalEarning.vue'


</script>
