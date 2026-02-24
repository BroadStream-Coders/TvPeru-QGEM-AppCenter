import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col items-center gap-12 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Colector de datos
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Programa{" "}
            <span className="font-semibold text-red-600 dark:text-red-500">
              &quot;Que Gane el Mejor&quot;
            </span>{" "}
            - Tv Peru
          </p>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2">
          <Link
            href="/deletreo"
            className="flex h-24 items-center justify-center rounded-2xl border border-zinc-200 bg-white p-6 text-xl font-medium transition-all hover:border-red-500 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-red-500 dark:hover:bg-zinc-800"
          >
            Deletreo
          </Link>

          <Link
            href="/personajes"
            className="flex h-24 items-center justify-center rounded-2xl border border-zinc-200 bg-white p-6 text-xl font-medium transition-all hover:border-red-500 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-red-500 dark:hover:bg-zinc-800"
          >
            Personajes
          </Link>
        </div>

        <footer className="mt-8 text-sm text-zinc-500">
          BroadStream Coders &copy; {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
}
