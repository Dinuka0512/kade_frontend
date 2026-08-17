export function ErrorBanner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line-strong bg-surface px-6 py-10 text-center sm:px-12">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-8 text-ink-muted">
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
      </svg>
      <h3 className="mt-3 text-sm font-semibold text-ink">
        Unable to load data
      </h3>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">
        {message ?? "The server is currently unavailable. Please try again later."}
      </p>
    </div>
  );
}
