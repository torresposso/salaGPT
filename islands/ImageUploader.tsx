import axios from "https://esm.sh/axios@1.4.0?target=es2022";
import { JSX } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import type { Signal } from "@preact/signals";
import { useSignal } from "@preact/signals";
import DisplayImages from "@/components/DisplayImages.tsx";

interface UploaderProps {
  progress: Signal<number>;
}

// Don’t forget to keep the Uppy instance outside of your component.

function ImageUploader() {
  const uploadProgress = useSignal(0);
  const downloadProgress = useSignal(0);

  const selectedImage = useSignal(new File([], ""));
  const isLoading = useSignal(false);
  const responseImages = useSignal<string[]>([]);

  const handleImageChange = (e: JSX.TargetedEvent) => {
    const file = (e.target as HTMLInputElement)?.files![0];
    selectedImage.value = file;
  };

  const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("Please select an image file.");
      return;
    }
    isLoading.value = true;

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const uploadResponse = await axios.post("/cuartos/upload", formData, {
        onUploadProgress: (progressEvent) => {
          uploadProgress.value = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total!,
          );
          console.log("progress", downloadProgress.value);
        },
        onDownloadProgress(progressEvent) {
          return downloadProgress.value = progressEvent.progress!;
        },
      });
      console.log("response", uploadResponse);

      responseImages.value = uploadResponse.data;

      isLoading.value = false;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };
  return (
    <>
      <div class="border">
        <form onSubmit={(e) => handleSubmit(e)} class="flex flex-col">
          <div>
            <input
              type="file"
              name="image"
              accept="image/png, image/jpeg"
              onChange={(e) => handleImageChange(e)}
            />
          </div>
          <div>
            <input
              className="text-gray-800"
              type="text"
              name="prompt"
            />
          </div>
          <button type="submmit" class="border text-black">Upload</button>
        </form>
        <div>
          <img src={URL.createObjectURL(selectedImage.value)} alt="" />
        </div>
        <div class="text-black">
          <pre>Upload Progress: {uploadProgress.value}</pre>
          <pre>Download Progress: {downloadProgress.value}</pre>
        </div>
        {responseImages.value && (
          <DisplayImages imagesURL={responseImages.value} />
        )}
      </div>
    </>
  );
}

export default ImageUploader;
