"use client";

import type { ChangeEvent, RefObject } from "react";
import { ImagePlus } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getInitials } from "@/lib/nav";
import type { ProfileFormData } from "@/components/profile/profile-utils";

type ProfileFormFieldsProps = {
  values: ProfileFormData;
  preview: string;
  error?: string;
  disabled: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onChooseImage: () => void;
};

export function ProfileFormFields({
  values,
  preview,
  error,
  disabled,
  fileInputRef,
  onChange,
  onImageChange,
  onChooseImage,
}: ProfileFormFieldsProps) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel>Profile photo</FieldLabel>
        <div className="flex items-center gap-4">
          <Avatar size="lg" className="size-16">
            {preview ? <AvatarImage src={preview} alt="Profile photo preview" /> : null}
            <AvatarFallback>{getInitials(values.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <Button
              type="button"
              variant="outline"
              onClick={onChooseImage}
              disabled={disabled}
              className="h-9"
            >
              <ImagePlus aria-hidden="true" />
              Choose photo
            </Button>
            <FieldDescription className="mt-2">
              PNG, JPEG, or WebP. Maximum file size: 5 MB.
            </FieldDescription>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onImageChange}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
          aria-label="Choose a profile photo"
        />
        {error ? <FieldError>{error}</FieldError> : null}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="profile-name">Full name</FieldLabel>
          <Input
            id="profile-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={onChange}
            placeholder="Your full name"
            maxLength={100}
            required
            disabled={disabled}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="profile-email">Email address</FieldLabel>
          <Input
            id="profile-email"
            value={values.email}
            readOnly
            aria-readonly="true"
            autoComplete="email"
            disabled
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="profile-phone">Phone number</FieldLabel>
          <Input
            id="profile-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={values.phone}
            onChange={onChange}
            placeholder="Add your phone number"
            pattern="[0-9]{6,15}"
            disabled={disabled}
          />
          <FieldDescription>Use 6 to 15 digits.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="profile-area">Area / Location</FieldLabel>
          <Input
            id="profile-area"
            name="area"
            autoComplete="address-level2"
            value={values.area}
            onChange={onChange}
            placeholder="Add your area or city"
            maxLength={120}
            disabled={disabled}
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
        <Textarea
          id="profile-bio"
          name="bio"
          value={values.bio}
          onChange={onChange}
          placeholder="Tell us a little about yourself"
          maxLength={500}
          rows={4}
          disabled={disabled}
        />
        <FieldDescription>
          {values.bio.length}/500 characters
        </FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="profile-role">Account role</FieldLabel>
        <Input
          id="profile-role"
          value={values.role}
          readOnly
          aria-readonly="true"
          disabled
        />
      </Field>
    </FieldGroup>
  );
}
