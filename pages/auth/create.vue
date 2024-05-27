<script lang="ts" setup>
import Cropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import { Form } from "vee-validate";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "~/components/ui/toggle";
import { useToast } from "@/components/ui/toast/use-toast";
import { useRouter } from "vue-router";

const router = useRouter();
const { toast } = useToast();
import { FilePenLine } from "lucide-vue-next";
definePageMeta({
  layout: "authentificate",
});

interface Error {
  message?: string;
  status?: boolean;
}

const cropperRef = ref<any | null>(null);
const croppedImage = ref<string | null>(null);
const imageData = ref<any>(null);
const isImageSelected = ref(false);
const email = ref<string | number | undefined>("");
const pass = ref<string | number | undefined>("");
const error = ref<Error>({
  message: "",
  status: false,
});
const terms = ref(false);

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

const createAccount = async () => {
  if (!email.value || !pass.value) {
    error.value = {
      message: "Email and password are required",
      status: true,
    };
    return;
  }
  if (!croppedImage.value) {
    error.value = {
      message: "Please select and crop an image",
      status: true,
    };
    return;
  }
  if (!String(email.value).includes("@")) {
    error.value = {
      message: "Type a correct email",
      status: true,
    };
    return;
  }
  if (!terms.value) {
    error.value = {
      message: "Accept the agreement",
      status: true,
    };
    return;
  }
  try {
    await fetch("/api/users/create", {
      method: "POST",
      body: JSON.stringify({
        email: email.value,
        password: pass.value,
        avatar: croppedImage.value,
      }),
    }).then((res) => {
      res.json().then((data) => {
        let response = data.message;
        if (data.status === 200) {
          localStorage.removeItem("session");
          localStorage.setItem("session", response.session);
          router.push("/auth/login");
        } else {
          return;
        }
      });
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
const removeImage = () => {
  imageData.value = null;
  isImageSelected.value = false;
  croppedImage.value = null;
};

// Отображение toast во время ошибок
watch(error, (newValue, oldValue) => {
  toast({
    description: error.value.message,
  });
});
</script>

<template>
  <div class="relative h-dvh backdrop-filter backdrop-blur-2xl">
    <div
      class="h-dvh text-white flex flex-col justify-center items-center space-y-6 relative z-20 lg:px-0 px-4"
    >
      <ParticlesLogo />

      <Card class="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle class="text-xl"> Sign Up </CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                v-model="email"
              />
            </div>
            <div class="grid gap-2">
              <Label for="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Type your password"
                v-model="pass"
              />
            </div>
            <div class="grid w-full max-w-sm items-center gap-2">
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
                  <Button @click="cropImage" class="w-full">Apply image</Button>
                  <Button @click="cancelCrop" class="w-full">Cancel</Button>
                </div>
              </div>
              <template v-if="croppedImage">
                <div class="flex flex-row items-start pt-2 relative">
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
            <div>
              <div class="flex items-center space-x-2">
                <Checkbox id="terms" @click="terms = !terms" />
                <Label for="terms">Accept terms and conditions</Label>
              </div>
            </div>
            <Button class="w-full" @click="createAccount()">
              Create an account
            </Button>
            <Button variant="outline" class="w-full" :disabled="true">
              Sign up with GitHub
            </Button>
          </div>
          <div class="mt-4 text-center text-sm">
            Already have an account?
            <NuxtLink to="/auth/login" class="underline"> Sign in </NuxtLink>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
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
