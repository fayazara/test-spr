<template>
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
</script>
