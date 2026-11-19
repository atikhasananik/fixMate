const IMGBB_UPLOAD_ENDPOINT = "https://api.imgbb.com/1/upload";

type ImgBBUploadResponse = {
  success: boolean;
  status: number;
  data?: {
    id: string;
    url: string;
    display_url: string;
    thumb?: { url: string };
    delete_url?: string;
  };
  error?: {
    message: string;
    code?: number;
  };
};

/**
 * Uploads an image file to ImgBB and returns the hosted URL.
 *
 * The API key lives in `.env` as `NEXT_PUBLIC_IMGBB_API`, so it is bundled for
 * the browser and the upload runs client-side (ImgBB keys are upload-only).
 */
export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API;

  if (!apiKey) {
    throw new Error(
      "ImgBB API key is missing. Add NEXT_PUBLIC_IMGBB_API to your .env file."
    );
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `${IMGBB_UPLOAD_ENDPOINT}?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const payload = (await response
    .json()
    .catch(() => null)) as ImgBBUploadResponse | null;

  if (!response.ok || !payload?.success || !payload.data?.url) {
    throw new Error(
      payload?.error?.message ??
        "ImgBB couldn't upload that image. Please try again."
    );
  }

  return payload.data.url;
}
