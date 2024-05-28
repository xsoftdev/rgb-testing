<script lang="ts" setup>
import { CloudUpload, FilePenLine } from "lucide-vue-next";
import { useTabStore } from "~/store/tab";
import Cropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const cropperRef = ref<any | null>(null);
const croppedImage = ref<string | null>(null);
const imageData = ref<any>(null);
const isImageSelected = ref(false);
const password = ref("");
const newpassword = ref("");
const tab = useTabStore();
const onFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageData.value = e.target?.result;
      isImageSelected.value = true;
    };
    reader.readAsDataURL(file);
  }
};

const cropImage = () => {
  if (cropperRef.value) {
    croppedImage.value = cropperRef.value
      .getCroppedCanvas({
        width: 200,
        height: 200,
      })
      .toDataURL();
    imageData.value = null;
  }
};

const cancelCrop = () => {
  imageData.value = null;
  isImageSelected.value = false;
  croppedImage.value = null;
};
const removeImage = () => {
  imageData.value = null;
  isImageSelected.value = false;
  croppedImage.value = null;
};
const active = ref(tab.active);
const userData = ref();
let session;

const loadUserData = async () => {
  session = localStorage.getItem("session");

  await fetch(`/api/users/${session}`).then((res) => {
    res.json().then((data) => {
      userData.value = data.message;
    });
  });
};
const savePassword = async () => {
  session = localStorage.getItem("session");

  await fetch("/api/users/passChange", {
    method: "POST",
    body: JSON.stringify({
      password: password.value,
      newpassword: newpassword.value,
      session,
    }),
  }).then((res) => {
    res.json().then((data) => {
      if (data.status === 200) {
        localStorage.removeItem("session");
        location.reload();
      }
    });
  });
};
const savePhoto = async () => {
  session = localStorage.getItem("session");

  await fetch("/api/users/imgChange", {
    method: "POST",
    body: JSON.stringify({
      avatar: croppedImage.value,
      session: session,
    }),
  }).then((res) => {
    res.json().then((data) => {
      console.log(data);
    });
  });
};
onMounted(async () => {
  await nextTick();

  loadUserData();
});
</script>
<template>
  <KeepAlive>
    <div
      class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
    >
      <div class="hidden border-r bg-muted/40 md:block">
        <div class="flex h-full max-h-screen flex-col gap-2">
          <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <NuxtLink
              to="/dashboard"
              class="flex items-center gap-2 font-semibold"
            >
              <ParticlesLogo />
            </NuxtLink>
          </div>
          <div class="flex-1">
            <nav
              class="flex justify-between flex-col h-full items-start px-2 text-sm font-medium lg:px-4 pb-16"
            >
              <NuxtLink
                to="/dashboard/my_files"
                class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary cursor-pointer w-full"
                :class="{ 'bg-muted text-primary': active === 'my_files' }"
                @click="tab.changeTab('my_files')"
              >
                <CloudUpload class="h-4 w-4" />
                My files
              </NuxtLink>
              <template v-if="userData">
                <div class="flex flex-col space-y-4">
                  <div class="flex flex-row items-center">
                    <div class="mr-2">
                      <img
                        :src="userData.avatar"
                        class="rounded-full max-w-16"
                      />
                    </div>
                    <div class="flex flex-col space-y-1">
                      <p class="underline font-bold">{{ userData.email }}</p>
                    </div>
                  </div>
                  <div>
                    <Dialog>
                      <DialogTrigger as-child>
                        <Button variant="outline" class="w-full">
                          Edit Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent class="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit profile</DialogTitle>
                          <DialogDescription>
                            Make changes to your profile here. Click save when
                            you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <Tabs default-value="photo" class="w-full">
                          <TabsList>
                            <TabsTrigger value="photo">Photo</TabsTrigger>
                            <TabsTrigger value="password">
                              Password
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="photo">
                            <div
                              class="grid w-full max-w-sm items-center gap-2 py-4"
                            >
                              <Label for="picture">{{
                                !croppedImage ? "Your image" : "Your profile"
                              }}</Label>
                              <Input
                                v-if="!isImageSelected"
                                id="picture"
                                type="file"
                                @change="onFileChange"
                              />
                              <div v-if="imageData" class="cropper-container">
                                <cropper
                                  ref="cropperRef"
                                  :src="imageData"
                                  :aspect-ratio="1"
                                  guides
                                  class="rounded-full w-full"
                                />

                                <div
                                  class="cropper-buttons w-full space-x-2 flex flex-row pt-2"
                                >
                                  <Button @click="cropImage" class="w-full"
                                    >Apply image</Button
                                  >
                                  <Button @click="cancelCrop" class="w-full"
                                    >Cancel</Button
                                  >
                                </div>
                              </div>
                              <template v-if="croppedImage">
                                <div
                                  class="flex flex-row items-start pt-2 relative"
                                >
                                  <NuxtImg
                                    :src="croppedImage"
                                    class="max-w-[60px] rounded-full mr-4"
                                  />
                                  <div class="data flex flex-col">
                                    <p class="underline">
                                      {{ !email ? "m@example.com" : email }}
                                    </p>
                                    <p>Developer</p>
                                  </div>
                                  <Toggle
                                    @click="removeImage"
                                    class="absolute bottom-0 right-0"
                                  >
                                    <FilePenLine class="w-6 h-6" />
                                  </Toggle>
                                </div>
                              </template>
                            </div>
                            <Button
                              type="submit"
                              class="mx-auto"
                              @click="savePhoto()"
                            >
                              Save photo
                            </Button>
                          </TabsContent>
                          <TabsContent value="password">
                            <div class="flex flex-col space-y-4 py-4">
                              <div class="grid gap-2">
                                <Label for="password">Your password</Label>
                                <Input
                                  id="password"
                                  type="password"
                                  placeholder="Type your password"
                                  v-model="password"
                                />
                              </div>
                              <div class="grid gap-2">
                                <Label for="password">New password</Label>
                                <Input
                                  id="new_password"
                                  type="password"
                                  placeholder="New password"
                                  v-model="newpassword"
                                />
                              </div>
                            </div>
                            <Button
                              type="submit"
                              class="mx-auto"
                              @click="savePassword()"
                            >
                              Save password
                            </Button>
                          </TabsContent>
                        </Tabs>
                        <DialogFooter> </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </template>
              <template v-else>Loading data...</template>
            </nav>
          </div>
        </div>
      </div>
      <div class="flex flex-col">
        <slot />
      </div>
    </div>
  </KeepAlive>
</template>

<style>
@import "cropperjs/dist/cropper.css";

.cropper-container {
  position: relative;
}

.cropper-container .cropper-view-box,
.cropper-container .cropper-face {
  border-radius: 50%;
}

img.rounded-full {
  border-radius: 50%;
}
</style>
