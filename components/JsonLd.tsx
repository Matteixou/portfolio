import { krylos } from "@/data/krylos";
import { liens, moi } from "@/data/moi";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

/* Données structurées schema.org : Matthieu (Person), relié à Krylos,
   et le site lui-même. Rien d'inventé : tout vient de data/. */

const personId = `${siteUrl}/#person`;

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: moi.name,
        jobTitle: moi.title,
        description: siteDescription,
        url: siteUrl,
        email: moi.email,
        sameAs: liens.filter((l) => l.url.startsWith("http")).map((l) => l.url),
        worksFor: {
          "@type": "Organization",
          name: krylos.name,
          url: krylos.url,
          email: krylos.email,
          slogan: krylos.tagline,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Villejuif",
            addressRegion: "Île-de-France",
            addressCountry: "FR",
          },
        },
        address: { "@type": "PostalAddress", addressRegion: "Île-de-France", addressCountry: "FR" },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        inLanguage: "fr-FR",
        publisher: { "@id": personId },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
