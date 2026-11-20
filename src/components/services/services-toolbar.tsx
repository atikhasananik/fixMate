"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RotateCcw, Search, X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  buildServicesSearchParams,
  readServiceParam,
  SERVICE_PARAMS,
  type ServiceParamPatch,
  type ServiceQueryKey,
} from "@/lib/services-query";
import type { ServicesToolbarProps } from "@/types/type";

type FilterOption = { value: string; label: string };

const MODE_OPTIONS: FilterOption[] = [
  { value: "all", label: "All modes" },
  { value: "home-visit", label: "Home visit" },
  { value: "shop-drop-off", label: "Shop drop-off" },
];

const AVAILABILITY_OPTIONS: FilterOption[] = [
  { value: "all", label: "All availability" },
  { value: "available", label: "Available now" },
  { value: "unavailable", label: "Unavailable" },
];

const SORT_OPTIONS: FilterOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "title-asc", label: "Title: A to Z" },
];

type FilterSelectProps = {
  label: string;
  value: string;
  options: FilterOption[];
  active: boolean;
  onChange: (value: string) => void;
};

function FilterSelect({
  label,
  value,
  options,
  active,
  onChange,
}: FilterSelectProps) {
  const selected =
    options.find((option) => option.value === value) ?? options[0];

  return (
    <Select
      value={selected.value}
      onValueChange={(next) => onChange(next ?? "")}
    >
      <SelectTrigger
        aria-label={label}
        className={cn(
          "h-9 w-full justify-between gap-2 lg:w-auto",
          active &&
            "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-300",
        )}
      >
        <SelectValue>{selected.label}</SelectValue>
      </SelectTrigger>
      <SelectContent align="start" alignItemWithTrigger={false}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ServicesToolbar({
  categories,
  searchParams,
}: ServicesToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const category = readServiceParam(searchParams, "category");
  const mode = readServiceParam(searchParams, "mode");
  const availability = readServiceParam(searchParams, "availability");
  const sort = readServiceParam(searchParams, "sort");

  const categoryOptions: FilterOption[] = [
    { value: "all", label: "All categories" },
    ...categories.map((item) => ({ value: item, label: item })),
  ];

  const hasActiveParams = (
    Object.keys(SERVICE_PARAMS) as ServiceQueryKey[]
  ).some((key) => Boolean(readServiceParam(searchParams, key)));

  /** Only job of this component: write params to the URL. */
  function setQueryParams(patch: ServiceParamPatch) {
    const searchString = buildServicesSearchParams(searchParams, patch);

    router.replace(searchString ? `${pathname}?${searchString}` : pathname, {
      scroll: false,
    });
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setQueryParams({ search: value || null });
  }

  function handleCategoryChange(value: string) {
    setQueryParams({ category: value === "all" ? null : value });
  }

  function handleModeChange(value: string) {
    setQueryParams({ mode: value === "all" ? null : value });
  }

  function handleAvailabilityChange(value: string) {
    setQueryParams({ availability: value === "all" ? null : value });
  }

  function handleSortChange(value: string) {
    setQueryParams({ sort: value === "newest" ? null : value });
  }

  function handleClear() {
    setSearch("");
    setQueryParams({
      search: null,
      category: null,
      mode: null,
      availability: null,
      sort: null,
    });
  }

  return (
    <section
      aria-label="Search, filter and sort services"
      className="rounded-2xl border border-border/70 bg-card p-3 shadow-sm sm:p-4"
    >
      <div className="flex flex-col gap-3">
        <InputGroup className="h-10 bg-background">
          <InputGroupAddon align="inline-start">
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search by service name or category…"
            aria-label="Search services"
            autoComplete="off"
          />
          {search ? (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label="Clear search"
                onClick={() => handleSearchChange("")}
              >
                <X aria-hidden="true" />
              </InputGroupButton>
            </InputGroupAddon>
          ) : null}
        </InputGroup>

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:items-center">
            <FilterSelect
              label="Filter by category"
              value={category}
              options={categoryOptions}
              active={Boolean(category)}
              onChange={handleCategoryChange}
            />
            <FilterSelect
              label="Filter by service mode"
              value={mode}
              options={MODE_OPTIONS}
              active={Boolean(mode)}
              onChange={handleModeChange}
            />
            <FilterSelect
              label="Filter by availability"
              value={availability}
              options={AVAILABILITY_OPTIONS}
              active={Boolean(availability)}
              onChange={handleAvailabilityChange}
            />
            <FilterSelect
              label="Sort services"
              value={sort}
              options={SORT_OPTIONS}
              active={Boolean(sort)}
              onChange={handleSortChange}
            />
          </div>

          {hasActiveParams ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="w-full text-muted-foreground lg:ml-auto lg:w-auto"
            >
              <RotateCcw aria-hidden="true" />
              Clear all
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
