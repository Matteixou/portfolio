/* ───────────────────────────────────────────────────────────────────────
   Le lecteur Spotify intégré, piloté depuis la platine du salon
   (API officielle « iFrame API » de Spotify : play / pause, changement
   de disque, et un événement quand la lecture démarre ou s'arrête, pour
   faire tourner le disque au bon moment). Chargé seulement quand on
   lance la platine.
   ─────────────────────────────────────────────────────────────────────── */

export interface ControleurSpotify {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  loadUri: (uri: string) => void;
  destroy: () => void;
  addListener: {
    (evenement: "ready", rappel: () => void): void;
    (evenement: "playback_update", rappel: (e: { data: { isPaused: boolean } }) => void): void;
  };
}

interface ApiSpotify {
  createController: (
    element: HTMLElement,
    options: { uri: string; width?: string | number; height?: number },
    pret: (controleur: ControleurSpotify) => void,
  ) => void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: ApiSpotify) => void;
  }
}

let chargement: Promise<ApiSpotify> | null = null;

export function chargerSpotify() {
  chargement ??= new Promise<ApiSpotify>((pret, echec) => {
    window.onSpotifyIframeApiReady = pret;
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    script.onerror = () => {
      chargement = null;
      echec(new Error("Lecteur Spotify indisponible"));
    };
    document.body.appendChild(script);
  });
  return chargement;
}
