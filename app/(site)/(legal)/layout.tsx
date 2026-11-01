/** Mise en page des pages légales : colonne de lecture. */
export default function MiseEnPageLegale({ children }: { children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-8 lg:pt-32 [&_h1]:font-serif [&_h1]:text-titre [&_h1]:font-medium [&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:font-medium [&_li]:mt-2 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
      {children}
      <p className="!mt-16 text-sm text-encre-douce">Les mentions entre crochets [À COMPLÉTER] sont à renseigner avant la mise en ligne (voir README).</p>
    </article>
  );
}
