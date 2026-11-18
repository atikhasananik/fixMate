import type { PagePlaceholderProps } from "@/types/type";

export function PagePlaceholder({
  title,
  description,
  children,
}: PagePlaceholderProps) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <span className="mb-5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold tracking-widest text-blue-700 uppercase dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-300">
        FixMate
      </span>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>
      {children}
    </section>
  );
}
