/* ───────────────────────────────────────────────────────────────────────
   La musique, dans le studio : la guitare et le clavier.
   D'après Matthieu (15/10/2026) : 8 ans de piano et de guitare au
   conservatoire, à l'EMA de Vitry-sur-Seine.
   Sur la platine du salon : les artistes qu'il écoute (Spotify). Une
   playlist perso peut s'y ajouter : coller son lien de partage
   (https://open.spotify.com/playlist/…), elle passe en premier.
   ─────────────────────────────────────────────────────────────────────── */

export const musique = {
  annees: 8,
  instruments: ["Piano", "Guitare"],
  ecole: "l'EMA de Vitry-sur-Seine",
  /** Les artistes qu'il écoute : identifiant Spotify (open.spotify.com/artist/…) et couleur de l'étiquette du disque.
      Avec `titre` (open.spotify.com/track/…), le disque joue ce titre au lieu des titres phares de l'artiste. */
  artistes: [
    {
      nom: "Coldplay",
      spotify: "4gzpq5DPGxSnKTe4SA8HAU",
      etiquette: "#e0a43c",
      titre: { nom: "A Sky Full of Stars", spotify: "0FDzzruyVECATHXKHFs9eJ" },
    },
    {
      nom: "Alex Warren",
      spotify: "0fTSzq9jAh4c36UVb4V7CB",
      etiquette: "#c2562f",
      titre: { nom: "Emerald Eyes", spotify: "6Bd6dcMIg6EPfF7cYTWa36" },
    },
    { nom: "Alan Walker", spotify: "7vk5e3vY1uw9plTHJAMwjN", etiquette: "#5cbcf2" },
    { nom: "Tayc", spotify: "7gU9VyFRN3JWPJ5oHOil60", etiquette: "#8f5bd6" },
  ],
  /** Lien de partage d'une playlist Spotify (vide : pas de playlist) */
  playlist: "",
};

export interface Disque {
  nom: string;
  /** le titre joué, s'il y en a un précis */
  titre?: string;
  /** identifiant pour le lecteur Spotify (spotify:artist:…, spotify:track:… ou spotify:playlist:…) */
  uri: string;
  etiquette: string;
}

interface Artiste {
  nom: string;
  spotify: string;
  etiquette: string;
  titre?: { nom: string; spotify: string };
}

const idPlaylist = musique.playlist.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?playlist\/([A-Za-z0-9]+)/)?.[1];

/** Les disques de la platine, dans l'ordre */
export const disques: Disque[] = [
  ...(idPlaylist ? [{ nom: "Ma playlist", uri: `spotify:playlist:${idPlaylist}`, etiquette: "#59623a" }] : []),
  ...(musique.artistes as Artiste[]).map((a) => ({
    nom: a.nom,
    titre: a.titre?.nom,
    uri: a.titre ? `spotify:track:${a.titre.spotify}` : `spotify:artist:${a.spotify}`,
    etiquette: a.etiquette,
  })),
];
