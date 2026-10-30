import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-brand-bg">
      <div className="mx-auto max-w-xl px-5 text-center sm:px-8">
        <p className="eyebrow">404</p>
        <h1 className="mt-6 font-serif text-6xl font-medium tracking-tight text-brand-ink">
          Not found.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-brand-secondary">
          This page does not exist. Try the project archive to find what you
          were looking for.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/projects" className="btn-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
          <Link href="/" className="btn-outline">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}