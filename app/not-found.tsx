import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-20 text-center">
      <div className="mx-auto max-w-md">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="display-md mb-2 text-[var(--black)]">Page Not Found</h1>
        <p className="mb-6 text-[var(--black)]">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
        <Link href="/" className="btn btn-primary inline-flex">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
