export default function BrandPage() {
  return (
    <main className="min-h-screen pb-20">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">Plumbflow Brand</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-700">
          Guidelines, assets, and best practices for representing the Plumbflow brand.
        </p>

        {/* Logo Section */}
        <section className="mt-12 border-t border-slate-200 pt-12">
          <h2 className="text-3xl font-bold text-slate-900">Logo</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <article className="glass-card p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Full logo
              </p>
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-slate-50 p-4">
                <img
                  src="/images/plumbflowfavicon.png"
                  alt="Plumbflow icon"
                  className="h-8 w-8"
                />
                <span className="text-lg font-bold text-slate-900">Plumbflow</span>
              </div>
            </article>

            <article className="glass-card p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Icon only
              </p>
              <div className="mt-4 flex items-center justify-center rounded-lg bg-slate-50 p-8">
                <img
                  src="/images/plumbflowfavicon.png"
                  alt="Plumbflow icon"
                  className="h-12 w-12"
                />
              </div>
            </article>

            <article className="glass-card bg-slate-900 p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                Dark mode
              </p>
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-slate-800 p-4">
                <img
                  src="/images/plumbflowfavicon.png"
                  alt="Plumbflow icon"
                  className="h-8 w-8"
                />
                <span className="text-lg font-bold text-white">Plumbflow</span>
              </div>
            </article>

            <article className="glass-card p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Monochrome
              </p>
              <div className="mt-4 flex items-center justify-center rounded-lg bg-slate-100 p-8">
                <span className="text-2xl font-bold text-slate-700">PF</span>
              </div>
            </article>
          </div>
        </section>

        {/* Colors Section */}
        <section className="mt-12 border-t border-slate-200 pt-12">
          <h2 className="text-3xl font-bold text-slate-900">Colors</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <article className="glass-card p-6">
              <div className="h-24 rounded-lg bg-blue-600 shadow-md" />
              <p className="mt-3 font-mono text-sm font-semibold text-slate-900">#0f6ee8</p>
              <p className="text-xs text-slate-600">Primary Brand</p>
            </article>

            <article className="glass-card p-6">
              <div className="h-24 rounded-lg bg-emerald-600 shadow-md" />
              <p className="mt-3 font-mono text-sm font-semibold text-slate-900">#0eaf85</p>
              <p className="text-xs text-slate-600">Accent / CTA</p>
            </article>

            <article className="glass-card p-6">
              <div className="h-24 rounded-lg bg-slate-900 shadow-md" />
              <p className="mt-3 font-mono text-sm font-semibold text-slate-900">#0f1e33</p>
              <p className="text-xs text-slate-600">Ink / Text</p>
            </article>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="mt-12 border-t border-slate-200 pt-12">
          <h2 className="text-3xl font-bold text-slate-900">Usage Guidelines</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="glass-card p-6">
              <h3 className="mb-3 text-lg font-semibold text-green-700">✔ Do</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Maintain clear space around logo</li>
                <li>• Use approved colors only</li>
                <li>• Respect minimum size (32px)</li>
                <li>• Use on contrasting backgrounds</li>
              </ul>
            </article>

            <article className="glass-card p-6">
              <h3 className="mb-3 text-lg font-semibold text-red-700">✘ Don't</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Stretch or distort logo</li>
                <li>• Change colors without approval</li>
                <li>• Rotate or skew logo</li>
                <li>• Use logo as bullet points</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Typography */}
        <section className="mt-12 border-t border-slate-200 pt-12">
          <h2 className="text-3xl font-bold text-slate-900">Typography</h2>
          <div className="mt-6 space-y-4">
            <article className="glass-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Headlines
              </p>
              <p className="mt-2 font-geist-sans text-3xl font-bold text-slate-900">
                Sora (Google Fonts)
              </p>
            </article>

            <article className="glass-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Monospace
              </p>
              <p className="mt-2 font-geist-mono text-lg text-slate-900">
                JetBrains Mono (Google Fonts)
              </p>
            </article>
          </div>
        </section>

        {/* Voice & Tone */}
        <section className="mt-12 border-t border-slate-200 pt-12 pb-12">
          <h2 className="text-3xl font-bold text-slate-900">Voice & Tone</h2>
          <ul className="mt-6 space-y-3 text-slate-700">
            <li className="glass-card p-4">
              <strong className="text-slate-900">Friendly:</strong> We're approachable and helpful,
              never corporate or intimidating.
            </li>
            <li className="glass-card p-4">
              <strong className="text-slate-900">Clear:</strong> We explain complex features in plain
              language.
            </li>
            <li className="glass-card p-4">
              <strong className="text-slate-900">Action-focused:</strong> We emphasize results and
              value.
            </li>
            <li className="glass-card p-4">
              <strong className="text-slate-900">Professional:</strong> We respect our audience and
              their time.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
