"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  UserRound,
  Wrench,
} from "lucide-react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/toast";
import { signUp } from "@/lib/auth-client";
import { uploadToImgBB } from "@/lib/imgbb";
import { DASHBOARD_PATHS } from "@/lib/nav";
import {
  MAX_SERVICE_IMAGE_BYTES,
  PASSWORD_MIN_LENGTH,
  SERVICE_IMAGE_TYPES,
  validateSignUp,
} from "@/lib/validation";
import type {
  RoleOption,
  SignUpErrors,
  SignUpRole,
  SignUpValues,
} from "@/types/type";

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "customer",
    title: "Customer",
    description: "Book repairs for your devices and track them.",
    icon: UserRound,
  },
  {
    value: "technician",
    title: "Technician",
    description: "Take on repair jobs and manage your schedule.",
    icon: Wrench,
  },
];

const INITIAL_VALUES: SignUpValues = {
  name: "",
  email: "",
  password: "",
  role: "customer",
  image: "",
};

export function SignUpForm() {
  const router = useRouter();
  const [values, setValues] = useState<SignUpValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  /** Local data URL shown instantly while the ImgBB upload runs. */
  const [imagePreview, setImagePreview] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  /** Ignores responses from uploads the user replaced mid-flight. */
  const uploadIdRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function setField<K extends keyof SignUpValues>(
    field: K,
    value: SignUpValues[K],
  ) {
    setValues((previous) => ({ ...previous, [field]: value }));

    // Clear the error as soon as the user edits the field again.
    setErrors((previous) =>
      previous[field] ? { ...previous, [field]: undefined } : previous,
    );
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setField(name as keyof SignUpValues, value);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Allow picking the same file again after an error.
    event.target.value = "";

    if (!file) {
      return;
    }

    if (
      !SERVICE_IMAGE_TYPES.includes(
        file.type as (typeof SERVICE_IMAGE_TYPES)[number],
      )
    ) {
      setErrors((previous) => ({
        ...previous,
        image: "Use a PNG, JPEG, or WebP image.",
      }));
      return;
    }

    if (file.size > MAX_SERVICE_IMAGE_BYTES) {
      setErrors((previous) => ({
        ...previous,
        image: "The image must be 5 MB or smaller.",
      }));
      return;
    }

    setErrors((previous) => ({ ...previous, image: undefined }));
    setIsUploadingImage(true);

    const currentUploadId = ++uploadIdRef.current;

    // Show the picked file right away; the ImgBB URL replaces it below.
    const reader = new FileReader();

    reader.onload = () => {
      if (
        currentUploadId === uploadIdRef.current &&
        typeof reader.result === "string"
      ) {
        setImagePreview(reader.result);
      }
    };

    reader.readAsDataURL(file);

    uploadToImgBB(file)
      .then((url) => {
        if (currentUploadId !== uploadIdRef.current) {
          return;
        }
        // field te img ar url add hoche  imgbb.ts theke img url astese
        setField("image", url);
      })
      .catch((error: unknown) => {
        if (currentUploadId !== uploadIdRef.current) {
          return;
        }

        // Never leave a preview for an image that was not saved.
        setImagePreview("");
        setField("image", "");
        setErrors((previous) => ({
          ...previous,
          image:
            error instanceof Error
              ? error.message
              : "ImgBB couldn't upload that image. Please try again.",
        }));
        toast.add({
          type: "error",
          title: "Couldn't upload your image",
          description:
            "Please choose the image again, or continue without one.",
        });
      })
      .finally(() => {
        if (currentUploadId === uploadIdRef.current) {
          setIsUploadingImage(false);
        }
      });
  }

  function handleRemoveImage() {
    uploadIdRef.current += 1;
    setIsUploadingImage(false);
    setImagePreview("");
    setField("image", "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || isUploadingImage) {
      return;
    }

    const nextErrors = validateSignUp(values);
    setErrors(nextErrors);

    const firstInvalidField = Object.keys(nextErrors)[0];

    if (firstInvalidField) {
      document.getElementById(firstInvalidField)?.focus();
      return;
    }

    setIsSubmitting(true);

    const { error } = await signUp.email({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      role: values.role,
      image: values.image || undefined,
    });

    if (error) {
      setIsSubmitting(false);
      toast.add({
        type: "error",
        title: "Couldn't create your account",
        description: error.message ?? "Something went wrong. Please try again.",
      });
      return;
    }

    toast.add({
      type: "success",
      title: "Account created",
      description: "Welcome to FixMate! Taking you to your dashboard.",
    });

    router.push(DASHBOARD_PATHS[values.role]);
    router.refresh();
  }

  return (
    <AuthPageShell
      title="Create your FixMate account"
      description="Sign up to book trusted technicians for your devices or start taking repair jobs of your own."
      footer={
        <>
          Already have an account?
          <Link
            href="/sign-in"
            className="font-medium text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={handleSubmit}>
        <FieldGroup>
          <Field data-invalid={Boolean(errors.image)}>
            <FieldLabel htmlFor="image">Profile photo</FieldLabel>

            <div className="flex items-center gap-4">
              <div
                aria-hidden="true"
                className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-slate-50 bg-cover bg-center text-muted-foreground dark:bg-slate-900"
                style={
                  imagePreview
                    ? { backgroundImage: `url(${imagePreview})` }
                    : undefined
                }
              >
                {imagePreview ? null : isUploadingImage ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <ImagePlus className="size-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="h-9 rounded-lg px-3"
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="animate-spin" aria-hidden="true" />
                        Uploading…
                      </>
                    ) : imagePreview ? (
                      "Change image"
                    ) : (
                      "Choose image"
                    )}
                  </Button>

                  {imagePreview && !isUploadingImage ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="h-9 rounded-lg px-3 text-muted-foreground hover:text-foreground"
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>

                <input
                  ref={fileInputRef}
                  id="image"
                  name="image-file"
                  type="file"
                  accept={SERVICE_IMAGE_TYPES.join(",")}
                  onChange={handleImageChange}
                  disabled={isUploadingImage}
                  aria-invalid={Boolean(errors.image)}
                  aria-describedby="image-description"
                  className="hidden"
                />

                <FieldDescription id="image-description">
                  Optional. PNG, JPEG, or WebP up to 5 MB — uploaded to ImgBB.
                </FieldDescription>
              </div>
            </div>

            <FieldError id="image-error">{errors.image}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Ayesha Rahman"
              value={values.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="h-10 px-3"
            />
            <FieldError id="name-error">{errors.name}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="h-10 px-3"
            />
            <FieldError id="email-error">{errors.email}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.password)}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={values.password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : "password-description"
                }
                className="h-10 pr-10 pl-3"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                aria-controls="password"
                className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </Button>
            </div>
            <FieldDescription id="password-description">
              At least {PASSWORD_MIN_LENGTH} characters, including one uppercase
              and one lowercase letter.
            </FieldDescription>
            <FieldError id="password-error">{errors.password}</FieldError>
          </Field>

          <FieldSet>
            <FieldLegend variant="label">I want to join as</FieldLegend>
            <RadioGroup
              value={values.role}
              onValueChange={(value) => setField("role", value as SignUpRole)}
            >
              {ROLE_OPTIONS.map((option) => {
                const Icon = option.icon;

                return (
                  <FieldLabel
                    key={option.value}
                    htmlFor={`role-${option.value}`}
                    className="cursor-pointer"
                  >
                    <Field orientation="horizontal">
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>

                      <FieldContent>
                        <FieldTitle>{option.title}</FieldTitle>
                        <FieldDescription>
                          {option.description}
                        </FieldDescription>
                      </FieldContent>

                      <RadioGroupItem
                        id={`role-${option.value}`}
                        value={option.value}
                      />
                    </Field>
                  </FieldLabel>
                );
              })}
            </RadioGroup>
          </FieldSet>

          <Button
            type="submit"
            disabled={isSubmitting || isUploadingImage}
            className="h-11 w-full rounded-xl bg-blue-600 text-sm font-medium text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Creating account…
              </>
            ) : isUploadingImage ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Uploading image…
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </FieldGroup>
      </form>
    </AuthPageShell>
  );
}
