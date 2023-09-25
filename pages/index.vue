<template>
  <main class="py-12 space-y-5">
    <h1 class="text-2xl font-bold text-center">Spiral Viral</h1>
    <form
      @submit.prevent="submit"
      class="flex items-center gap-3 p-3 bg-white shadow-sm border rounded-lg"
    >
      <Icon name="ph:spiral-bold" class="h-6 w-6" />
      <textarea
        class="flex-1 resize-none focus:outline-none"
        autofocus
        placeholder="Enter a prompt"
        v-model="prompt"
      >
      </textarea>
      <button
        type="submit"
        :disabled="!prompt || loading"
        class="h-8 w-8 flex-shrink-0 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200"
        :class="{ 'opacity-50 cursor-not-allowed': !prompt }"
      >
        <Icon
          v-if="loading"
          name="lucide:loader-2"
          class="h-4 w-4 animate-spin"
        />
        <Icon v-else name="ph:paper-plane-right-duotone" class="h-4 w-4" />
      </button>
    </form>
    <p class="text-sm text-center text-gray-500">Last created spiral</p>
    <img
      v-if="post.image"
      :src="post.image"
      :alt="post.prompt"
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
    <h1 class="text-center text-gray-700 font-medium">{{ post.prompt }}</h1>
  </main>
</template>

<script setup>
const toast = useToast();
const prompt = ref("");
const loading = ref(false);
const submit = async () => {
  try {
    loading.value = true;
    if (!prompt.value) {
      toast.add({
        title: "Please enter a prompt",
        color: "red",
      });
      return;
    }
    const data = await $fetch("/api/post", {
      method: "POST",
      body: { prompt: prompt.value },
    });
    console.log(data);
    toast.add({
      title: "Prompt submitted",
      color: "green",
    });
    navigateTo(`/${data.id}`);
  } catch (error) {
    console.log(error);
    toast.add({
      title: "Something went wrong",
      color: "red",
    });
  } finally {
    loading.value = false;
  }
};
const { data: post } = await useFetch("/api/post/last");
useHead({
  title: "Spiral Viral",
});
</script>
