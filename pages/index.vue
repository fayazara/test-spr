<template>
  <main class="py-12 space-y-5">
    <Logo />
    <PromptForm />
    <p class="text-sm text-center text-gray-500">Last created spiral</p>
    <PhotoBooth :image="post.image" :prompt="post.prompt" />
  </main>
</template>

<script setup>
const { data: post } = await useFetch("/api/post/last");
useHead({
  title: "Spiral Viral",
});
</script>
