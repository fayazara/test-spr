<template>
  <main class="py-12 space-y-5">
    <Logo />
    <PromptForm />
    <PhotoBooth :image="data.image" :prompt="data.prompt" />
  </main>
</template>

<script setup>
const route = useRoute();
const { data, refresh } = await useFetch(`/api/post/${route.params.id}`);
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

useHead({
  title: data.value.prompt,
});
</script>
