import { useSignal } from "@preact/signals";
import { prerelease } from "https://deno.land/std@0.193.0/semver/mod.ts";

export default function FileUpload() {
  const selectedImage = useSignal(new File([], ""));
  const isLoading = useSignal(false);
  const responseImages = useSignal();

  const handleDragOver = (event: Event) => {
    event.preventDefault();
  };

  const handleDrop = async (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) {
      selectedImage.value = event.dataTransfer.files[0];

      const formData = new FormData();
      formData.append("image", selectedImage.value);

      const url = "/cuartos/upload";
      const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        body: formData,
      });

      if (response.status === 200) {
        responseImages.value = await response.json();
      }
    }
  };

  const onUploadFile = async (event: Event) => {
    event.preventDefault();
    if (event.target) {
      selectedImage.value = event.target.files[0];

      const formData = new FormData();
      formData.append("image", selectedImage.value);

      const url = "/cuartos/upload";
      const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        body: formData,
      });

      if (response.status === 200) {
        responseImages.value = await response.json();
      }
    }
  };

  return (
    <div class="mx-auto mt-10 space-y-5">
      <div onDragOver={handleDragOver} onDrop={handleDrop}>
        <label class="flex w-full cursor-pointer appearance-none items-center justify-center rounded-md border-2 border-dashed border-gray-200 p-6 transition-all hover:border-primary-300">
          <div class="space-y-1 text-center">
            <div class="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6 text-gray-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>
            </div>
            <div class="text-gray-600">
              <a class="font-medium text-primary-500 hover:text-primary-700">
                Click to upload
              </a>
              <br />or drag and drop
            </div>
            <p class="text-sm text-gray-500">PDF, SVG, PNG, JPG or GIF</p>
          </div>
          <input
            id="uploadFile"
            type="file"
            class="sr-only"
            onInput={onUploadFile}
          />
        </label>
      </div>
      {responseImages.value
        ? <Carousel imagesURL={responseImages.value} />
        : <></>}
    </div>
  );
}

function Carousel({ imagesURL }) {
  return (
    <>
      <div className="carousel w-full">
        <div id="original" className="carousel-item w-full">
          <img
            src={imagesURL[0]}
            className="w-full"
          />
        </div>
        <div id="dreamed" className="carousel-item w-full">
          <img
            src={imagesURL[1]}
            className="w-full"
          />
        </div>
      </div>
      <div className="flex justify-center w-full py-2 gap-2">
        <a href="#original" className="btn btn-xs">ORIGINAL</a>
        <a href="#dreamed" className="btn btn-xs">DREAMED</a>
      </div>
    </>
  );
}
