<template>
  <div
    class="rounded-xl border border-dashed bg-card text-card-foreground shadow p-12 py-20"
    @dragover.prevent
    @dragenter.prevent
    @dragleave="onDragLeave"
    @drop="onDrop"
    @click="triggerFileInput"
  >
    <input type="file" ref="fileInput" class="hidden" @change="onFileChange" />
    <div class="text-center flex flex-row justify-center items-center">
      <p class="mr-4 font-bold">Drag & Drop your files</p>
      <CloudUpload class="w-10 h-10" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CloudUpload } from "lucide-vue-next";

const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const uploadFiles = async (filesToUpload: File[]) => {
  const formData = new FormData();
  filesToUpload.forEach((file) => {
    formData.append("file", file);
  });

  const session = localStorage.getItem("session");

  try {
    const response = await fetch(`/api/files/${session}/upload`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json().then(location.reload());
    console.log("Upload successful:", result);
  } catch (error) {
    console.error("Error uploading files:", error);
  }
};

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    files.value = Array.from(input.files);
    uploadFiles(files.value);
  }
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer?.files) {
    files.value = Array.from(event.dataTransfer.files);
    uploadFiles(files.value);
  }
};

const onDragLeave = (event: DragEvent) => {
  event.preventDefault();
};
</script>   