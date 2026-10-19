import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Geist } from "next/font/google";
import "./globals.css";
import { ogDescription, siteDescription, siteName, siteTitle, siteUrl } from "@/lib/site";

/* Trois familles : Fraunces (titres chaleureux), Geist (texte courant),
   Caveat (les mots écrits à la main : étiquettes, notes, lettre). */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  keywords: ["Matthieu Feracho", "Krylos", "co-fondateur", "agence web", "Villejuif", "portfolio", "développeur web", "Next.js"],
  authors: [{ name: "Matthieu Feracho", url: siteUrl }],
  creator: "Matthieu Feracho",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: siteTitle,
    description: ogDescription,
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: ogDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1c140f",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${geist.variable} ${fraunces.variable} ${caveat.variable}`} suppressHydrationWarning>
      <head>
        {/* Avec JavaScript, l'appartement prend la main sur les ancres #lieu.
            Pas d'animation d'entrée (le palier) pour un lien direct, une deuxième
            visite dans la session ou si le visiteur préfère moins d'animations :
            décidé ici, avant le premier affichage, pour ne rien voir clignoter.
            Un appareil modeste passe aussi en mode léger dès maintenant et entre
            directement dans le salon (voir components/appart/qualite.ts) :
            - il le déclare (2 Go de mémoire ou moins, économie de données :
              Chrome, Edge, Android seulement) ;
            - ou, sur tous les navigateurs, un mini-test de vitesse de 6 ms le
              trouve plus de ~3,5 fois plus lent qu'un PC portable récent
              (score sous 50 ; ~190 sur un Ryzen de 2025). Le score est gardé
              sur <html data-vitesse> pour comprendre un retour de visiteur. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement;d.classList.add('js');try{var n=navigator,q=location.search,t=performance.now(),k=0,x=0;while(performance.now()-t<6){for(var i=0;i<400;i++)x+=Math.sqrt(i*k+1)%7;k++}d.setAttribute('data-vitesse',k);var l=k<50||(n.deviceMemory&&n.deviceMemory<=2)||(n.connection&&n.connection.saveData)||/[?&]leger=1/.test(q);if(/[?&]leger=0/.test(q))l=false;if(l)d.setAttribute('data-leger','true');if(l||location.pathname!=='/'||location.hash.length>1||sessionStorage.getItem('appart:entree')||matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('sans-entree')}catch(e){d.classList.add('sans-entree')}",
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
