"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RotateCcw, Search} from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
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
  hasActiveServiceFilters,
  readServiceParam,
  type ServiceParamPatch,
} from "@/lib/services-query";
import type { Categories, ServicesToolbarProps } from "@/types/type";

type FilterOption = { value: string; label: string };

const MODE_OPTIONS: FilterOption[] = [
  { value: "all", label: "All modes" },
  { value: "home-visit", label: "Home visit" },
  { value: "shop-drop-off", label: "Shop drop-off" },
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

const categories: Categories[] = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const SEARCH_DEBOUNCE_MS = 300;

export function ServicesToolbar({ searchParams }: ServicesToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const urlSearch = readServiceParam(searchParams, "search");
  const [search, setSearch] = useState(urlSearch);
  // The previous URL value, used to tell a real URL change (back/forward,
  // Clear all) apart from props that are still stale while our own debounced
  // navigation is in flight.
  const [previousUrlSearch, setPreviousUrlSearch] = useState(urlSearch);
  // The value this input last wrote to the URL, so its echo can be ignored.
  const [pushedSearch, setPushedSearch] = useState(urlSearch);

  if (urlSearch !== previousUrlSearch) {
    setPreviousUrlSearch(urlSearch);

    // Don't overwrite the box with the echo of what was just pushed — the
    // user may have typed more while the navigation was loading.
    if (urlSearch !== pushedSearch) {
      setPushedSearch(urlSearch);
      setSearch(urlSearch);
    }
  }

  const category = readServiceParam(searchParams, "category");
  const mode = readServiceParam(searchParams, "mode");
  const sort = readServiceParam(searchParams, "sort");

  const categoryOptions: FilterOption[] = [
    { value: "all", label: "All categories" },
    ...categories.map((item) => ({ value: item, label: item })),
  ];

  const hasActiveParams = hasActiveServiceFilters(searchParams);

  /** Only job of this component: write params to the URL. */
  const setQueryParams = useCallback(
    (patch: ServiceParamPatch) => {
      const searchString = buildServicesSearchParams(searchParams, patch);

      router.replace(searchString ? `${pathname}?${searchString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  // Debounce search typing so each keystroke doesn't trigger a request; the
  // API is only called once the user pauses.
  useEffect(() => {
    const next = search.trim();

    if (next === urlSearch) {
      return;
    }

    const timer = setTimeout(() => {
      setPushedSearch(next);
      setQueryParams({ search: next || null });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search, urlSearch, setQueryParams]);

  function handleSearchChange(value: string) {
    setSearch(value);
  }

  function handleCategoryChange(value: string) {
    setQueryParams({ category: value === "all" ? null : value });
  }

  function handleModeChange(value: string) {
    setQueryParams({ mode: value === "all" ? null : value });
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
