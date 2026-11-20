"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
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
import { toast } from "@/components/ui/toast";
import { ProfileFormFields } from "@/components/profile/profile-form-fields";
import {
  createProfileUpdateData,
  getInitialProfileData,
  isEditableProfileField,
  type ProfileFormData,
} from "@/components/profile/profile-utils";
import { authClient } from "@/lib/auth-client";
import { uploadToImgBB } from "@/lib/imgbb";
import { MAX_SERVICE_IMAGE_BYTES, SERVICE_IMAGE_TYPES } from "@/lib/validation";
import type { DashboardViewer } from "@/types/type";

type UpdateProfileDialogProps = {
  viewer: DashboardViewer;
};

export function UpdateProfileDialog({ viewer }: UpdateProfileDialogProps) {
  const router = useRouter();
  const { refetch } = authClient.useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<ProfileFormData>(() =>
    getInitialProfileData(viewer),
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (isSubmitting) {
      return;
    }

    if (nextOpen) {
      setValues(getInitialProfileData(viewer));
      setImageFile(null);
      setImagePreview("");
      setImageError("");
    }

    setOpen(nextOpen);
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.currentTarget;

    if (!isEditableProfileField(name)) {
      return;
    }

    setValues((previous) => ({ ...previous, [name]: value }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    if (
      !SERVICE_IMAGE_TYPES.includes(
        file.type as (typeof SERVICE_IMAGE_TYPES)[number],
      )
    ) {
      setImageError("Choose a PNG, JPEG, or WebP image.");
      return;
    }

    if (file.size > MAX_SERVICE_IMAGE_BYTES) {
      setImageError("The image must be 5 MB or smaller.");
      return;
    }

    setImageError("");
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
      }
    };
    reader.onerror = () => {
      setImagePreview("");
      setImageFile(null);
      setImageError("Couldn't preview this image. Please choose another.");
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const name = values.name.trim();
    const phone = values.phone.trim();

    if (!name) {
      toast.add({
        type: "error",
        title: "Name is required",
        description: "Enter your full name before saving.",
      });
      return;
    }

    if (phone && !/^\d{6,15}$/.test(phone)) {
      toast.add({
        type: "error",
        title: "Check your phone number",
        description: "Use 6 to 15 digits for your phone number.",
      });
      return;
    }

    if (imageError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const image = imageFile ? await uploadToImgBB(imageFile) : values.image;
      const payload = createProfileUpdateData(
        { ...values, name },
        image || undefined,
      );

    
      const result = await authClient.updateUser(payload);

      if (result.error) {
        throw new Error(
          result.error.message ?? "Couldn't update your profile.",
        );
      }

      setValues((previous) => ({
        ...previous,
        name,
        image: image || previous.image,
      }));
      await refetch();

      toast.add({
        type: "success",
        title: "Profile updated",
        description: "Your account information has been saved.",
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.add({
        type: "error",
        title: "Couldn't update your profile",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const preview = imagePreview || values.image;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className="h-10 rounded-xl bg-blue-600 px-4 text-white hover:bg-blue-700" />
        }
      >
        Update Profile
      </DialogTrigger>

      <DialogContent className="max-h-[min(90dvh,48rem)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto p-0 lg:max-w-6xl xl:max-w-7xl overflow-x-hidden">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-border/60 px-5 py-5 sm:px-6">
            <DialogTitle className="text-xl">Update your profile</DialogTitle>
            <DialogDescription>
              Keep your account details current. Your email and role cannot be
              changed here.
            </DialogDescription>
          </DialogHeader>

          <div className="px-5 py-5 sm:px-6">
            <ProfileFormFields
              values={values}
              preview={preview}
              error={imageError}
              disabled={isSubmitting}
              fileInputRef={fileInputRef}
              onChange={handleChange}
              onImageChange={handleImageChange}
              onChooseImage={() => fileInputRef.current?.click()}
            />
          </div>

          <DialogFooter className="px-5 sm:px-6">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || Boolean(imageError)}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="animate-spin" aria-hidden="true" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
