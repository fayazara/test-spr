<template>
  <div class="space-y-4">
    <img
      v-if="image"
      :src="image"
      :alt="prompt"
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
    <h1 v-if="prompt" class="text-center text-gray-700 font-medium">
      {{ prompt }}
    </h1>
  </div>
</template>

<script setup>
defineProps({
  image: {
    type: String,
    default: null,
  },
  prompt: {
    type: String,
    default: "",
  },
});
</script>

<style></style>
