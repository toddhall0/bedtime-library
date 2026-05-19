import { Logo } from "@/components/brand/Logo";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-background px-6 py-24">
      <div className="flex max-w-xl flex-col items-center gap-8 text-center">
        <Logo size="md" variant="light" />
        <p className="text-balance font-sans text-base text-brand-muted-cream sm:text-lg">
          Coming soon. Personalized bedtime stories starring your kid.
        </p>
      </div>
    </main>
  );
}
