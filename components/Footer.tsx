export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-cream">
      <div className="mx-auto flex max-w-container flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-stone-500 md:flex-row">
        <div>© 2026 M.A. Handyman Services. All rights reserved.</div>
        <div>
          Designed by{' '}
          <a
            href="https://www.linkedin.com/in/sheldon-pierce/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-ink underline-offset-4 hover:underline"
          >
            Sheldon Pierce
          </a>
        </div>
      </div>
    </footer>
  );
}
