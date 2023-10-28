// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers } from "$fresh/server.ts";
import { State } from "@/routes/_middleware.ts";
import { ulid } from "$std/ulid/mod.ts";
import {
  ImageMagick,
  IMagickImage,
  initialize,
  MagickFormat,
  MagickGeometry,
} from "https://deno.land/x/imagemagick_deno@0.0.26/mod.ts";

export const handler: Handlers<unknown, State> = {
  async POST(req, ctx) {
    try {
      const form = await req.formData();
      console.log("called");
      const image = form.get("image") as File;
      const imageData = new Uint8Array(await image.arrayBuffer());

      const { session, supabaseClient } = ctx.state;

      const userId = session?.user.id;

      const PATH = `${userId}/${ulid()}`;

      let uploadedImage: unknown;

      await initialize();

      try {
        await ImageMagick.read(imageData, async (img: IMagickImage) => {
          const geometry = new MagickGeometry(512);

          img.autoOrient();
          img.resize(geometry);
          img.quality = 85;

          await img.write(
            MagickFormat.Jpeg,
            async (data: Uint8Array) =>
              uploadedImage = await supabaseClient
                .storage
                .from("salas")
                .upload(`${PATH}/original`, data, {
                  cacheControl: "3600",
                  upsert: false,
                  contentType: "image/jpeg",
                }),
          );
        });
      } catch (error) {
        console.log(error);
      }

      console.log("image", uploadedImage);

      // POST request to Replicate to start the image restoration generation process
      const startResponse = await fetch(
        "https://api.replicate.com/v1/predictions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + Deno.env.get("REPLICATE_API_KEY")!,
          },
          body: JSON.stringify({
            version:
              "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
            input: {
              image:
                "https://guxtdxznekffifecpeyx.supabase.co/storage/v1/object/public/salas/" +
                uploadedImage?.data?.path,
              prompt: "futuristic",
              a_prompt:
                "best quality, extremely detailed, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning",
              n_prompt:
                "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
            },
          }),
        },
      );

      const jsonStartResponse = await startResponse.json();

      console.log("start response", jsonStartResponse);

      const endpointUrl = jsonStartResponse.urls.get;

      // GET request to get the status of the image restoration process & return the result when it's ready
      let generationResponse;
      while (!generationResponse) {
        // Loop in 1s intervals until the alt text is ready
        console.log("polling for result...");
        const finalResponse = await fetch(endpointUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + Deno.env.get("REPLICATE_API_KEY")!,
          },
        });
        const jsonFinalResponse = await finalResponse.json();

        if (jsonFinalResponse.status === "succeeded") {
          generationResponse = jsonFinalResponse.output;
        } else if (jsonFinalResponse.status === "failed") {
          break;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      const generatedImage = new Uint8Array(
        await (await fetch(generationResponse[1])).arrayBuffer(),
      );
      try {
        await ImageMagick.read(generatedImage, async (img: IMagickImage) => {
          const geometry = new MagickGeometry(512);

          img.resize(geometry);
          img.quality = 85;

          await img.write(
            MagickFormat.Png,
            async (data: Uint8Array) =>
              uploadedImage = await supabaseClient
                .storage
                .from("salas")
                .upload(`${PATH}/generated`, data, {
                  contentType: "image/png",
                }),
          );
        });
      } catch (error) {
        console.log(error);
      }

      const images = [
        `https://guxtdxznekffifecpeyx.supabase.co/storage/v1/object/public/salas/${PATH}/original`,
        `https://guxtdxznekffifecpeyx.supabase.co/storage/v1/object/public/salas/${PATH}/generated`,
      ];

      console.log("images", images);
      return Response.json(
        images,
      );
    } catch (error) {
      return Response.json(error);
    }
  },
};
