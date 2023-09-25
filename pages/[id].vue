<template>
  <main class="py-12 space-y-4">
    <img
      v-if="data.image"
      :src="data.image"
      :alt="data.prompt"
      class="h-full w-full aspect-[1] rounded-lg"
    />
    <div
      v-else
      class="h-full w-full aspect-[1] bg-gray-200 flex rounded-lg items-center justify-center flex-col gap-4"
    >
      <Icon name="lucide:loader-2" class="h-5 w-5 animate-spin" />
      <p class="text-center text-sm">
        Our robots are building your image, please wait...
      </p>
    </div>
    <h1 class="text-center text-gray-700 font-medium">{{ data.prompt }}</h1>
  </main>
</template>

<script setup>
const route = useRoute();
const { data, refresh } = await useFetch(
  `/api/post/${route.params.id}`
);
const pollingInterval = 1000;
let pollingTimer = null;

const pollApi = async () => {
  if (!data.image) {
    await refresh();
    pollingTimer = setTimeout(pollApi, pollingInterval);
  }
};

onMounted(() => {
  pollApi();
});

onBeforeUnmount(() => {
  clearTimeout(pollingTimer);
});
</script>
