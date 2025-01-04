<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  title: "Todo App",
  meta: [
    {
      name: "В разработке",
      content: "сколько весит слон?",
    },
  ],
});
</script>