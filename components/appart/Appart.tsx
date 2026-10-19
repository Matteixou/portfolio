"use client";

import { MoveHorizontal } from "lucide-react";
import { memo, startTransition, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { projets } from "@/data/projets";
import { AnnonceSecret, Accueil, BoutonSon, CompteurSecrets, EnDirect, Interrupteur, Passage, Plan } from "./Hud";
import Disco, { DUREE_DISCO } from "./Disco";
import Entree from "./Entree";
import { arreterAmbiance, demarrerAmbiance, reglerAmbiance, type ReglagesAmbiance } from "./ambiance";
import { trouverSecret } from "./secrets";
import { LIEUX, lieux, PIECES, type LieuId, type PieceId } from "./lieux";
import { fermer, lireLieu, lireLieuServeur, ouvrir, sAbonner } from "./navigation";
import Panneau from "./Panneau";
import { estLeger, surveillerFluidite } from "./qualite";
import APropos from "./pieces/APropos";
import Atelier from "./pieces/Atelier";
import Contact from "./pieces/Contact";
import Krylos from "./pieces/Krylos";
import Musique from "./pieces/Musique";
import Realisations from "./pieces/Realisations";
import Stream from "./pieces/Stream";
import Volley from "./pieces/Volley";
import Gymnase from "./scene/Gymnase";
import Scene from "./scene/Scene";
import Studio from "./scene/Studio";
import type { ActionsScene, EtatScene, Lampe } from "./scene/types";
import Lecteur, { type Ecoute } from "./Lecteur";
import { arreterLofi, basculerLofi, gratterAccord, jouerArpege, jouerDisco, jouerFanfare, jouerTouche as jouerToucheSon, preparerSon } from "./son";
import { estLaNuit, useHeureParis, useMeteo } from "./useAmbiance";
import { useEtatStream } from "./useEtatStream";
import { usePeriode } from "./saisons";

/* ───────────────────────────────────────────────────────────────────────
   L'appartement : trois pièces côte à côte (le gymnase à gauche, le salon
   où l'on arrive, le studio de stream à droite), la « caméra » qui
   s'approche de l'objet qu'on ouvre, les panneaux, et ce qui flotte au-dessus.

   Fluidité : le survol et la parallaxe modifient le DOM directement
   (attribut data-actif, transform) au lieu de passer par l'état React,
   pour ne jamais re-rendre la scène pendant qu'on bouge la souris.
   ─────────────────────────────────────────────────────────────────────── */

const LARGE = 900;

/* Pendant une visite, la scène, l'en-tête et le plan sont cachés aux
   lecteurs d'écran (aria-hidden), Tab tourne dans le panneau ouvert et le
   voile empêche de cliquer derrière. On n'utilise pas `inert` : l'activer
   recalcule le style de chaque élément concerné (~1 800 au total), ce qui
   faisait sauter l'ouverture et la fermeture des panneaux. */
const FOCUSABLES = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function gardeLeFocus(e: KeyboardEvent, id: LieuId) {
  const panneau = document.getElementById(id);
  if (!panneau) return;
  const liste = [...panneau.querySelectorAll<HTMLElement>(FOCUSABLES)].filter((el) => el.getClientRects().length > 0);
  if (!liste.length) return;
  const premier = liste[0];
  const dernier = liste[liste.length - 1];
  const actif = document.activeElement as HTMLElement | null;
  const dedans = !!actif && panneau.contains(actif);
  if (!dedans || (e.shiftKey && (actif === premier || !liste.includes(actif)))) {
    e.preventDefault();
    (e.shiftKey ? dernier : premier).focus();
  } else if (!e.shiftKey && actif === dernier) {
    e.preventDefault();
    premier.focus();
  }
}
/** Zoom maximal de la caméra (au-delà, la carte graphique peine à suivre) */
const ZOOM_MAX = 2.2;
/** Où l'on regarde en arrivant dans chaque pièce sur un écran étroit */
const CENTRE_PIECE: Record<PieceId, number> = { gymnase: 560, salon: 1180, studio: 820 };

function borner(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

/** Largeur d'une pièce à l'écran (la moitié de l'appartement) */
function largeurPiece(appart: HTMLElement) {
  return appart.offsetWidth / PIECES.length;
}

/** Position de défilement qui montre une pièce */
function defilementPour(plateau: HTMLElement, appart: HTMLElement, piece: PieceId) {
  const W = largeurPiece(appart);
  const vw = plateau.clientWidth;
  const debut = PIECES.indexOf(piece) * W;
  if (W <= vw + 1) return debut;
  return borner(debut + (CENTRE_PIECE[piece] / 1600) * W - vw / 2, debut, debut + W - vw);
}

/** La pièce la plus visible à l'écran */
function pieceVisible(plateau: HTMLElement, appart: HTMLElement): PieceId {
  const W = largeurPiece(appart);
  const milieu = plateau.scrollLeft + plateau.clientWidth / 2;
  return PIECES[borner(Math.floor(milieu / W), 0, PIECES.length - 1)];
}

/** Reporte sur les pièces ce que l'observateur a vu (data-visible), sans
    réécrire un attribut inchangé (chaque écriture recalcule toute la pièce).
    « allumerSeulement » : pendant un défilement, on réveille la pièce qui
    arrive mais on n'éteint celle qui part qu'une fois le défilement posé
    (la recalculer en plein mouvement fait sauter des images). */
function marquerVisibles(etats: Map<Element, boolean>, allumerSeulement = false) {
  etats.forEach((visible, piece) => {
    if (allumerSeulement && !visible) return;
    if (piece.getAttribute("data-visible") !== String(visible)) piece.setAttribute("data-visible", String(visible));
  });
}

/** Calcule la transformation qui amène l'objet au centre de la zone libre */
function cadrer(plateau: HTMLElement, appart: HTMLElement, id: LieuId | null) {
  if (!id) {
    appart.style.transform = "";
    return;
  }
  const W = largeurPiece(appart);
  const H = appart.offsetHeight;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const k = W / 1600;
  const lieu = lieux[id];
  const c = lieu.cadrage;
  const cx = PIECES.indexOf(lieu.piece) * W + c.x * k;

  // Zone laissée libre par le panneau (à gauche sur ordinateur, tiroir en bas
  // sur mobile, de hauteur fixe : voir .panneau dans globals.css)
  const large = vw >= LARGE;
  const zoneX = large ? Math.min(500, vw * 0.42) + 32 : 0;
  const zoneW = vw - zoneX;
  const zoneH = large ? vh : vh - Math.min(vh * 0.72, 720);
  // Hauteur que l'appartement doit couvrir (sous le tiroir, rien ne se voit)
  const couvreH = large ? vh : zoneH + 40;

  const s = borner(Math.min((zoneW * 0.62) / (c.w * k), (zoneH * 0.72) / (c.h * k)), 1, ZOOM_MAX);

  // Position de l'appartement à l'écran, sans transformation
  const baseX = -plateau.scrollLeft;
  const baseY = appart.offsetTop;

  // translate(T) scale(s), origine en haut à gauche : écran = base + T + s·p
  // (bornée pour que l'appartement couvre toujours la partie visible de l'écran)
  const tx = borner(zoneX + zoneW / 2 - baseX - s * cx, vw - baseX - s * appart.offsetWidth, -baseX);
  const ty = borner(zoneH / 2 - baseY - s * c.y * k, couvreH - baseY - s * H, -baseY);
  appart.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${s})`;
}

export default function Appart() {
  const ouvert = useSyncExternalStore(sAbonner, lireLieu, lireLieuServeur);
  const etatStream = useEtatStream();
  const periode = usePeriode();
  const liveReel = etatStream.reel && etatStream.enDirect;

  // la nuit suit l'heure de Paris (20 h – 7 h), tant qu'on ne touche pas à l'interrupteur
  const heure = useHeureParis();
  const nuitAuto = estLaNuit(heure);
  const [choixNuit, setChoixNuit] = useState<boolean | null>(null);
  const nuit = choixNuit ?? nuitAuto;
  const meteo = useMeteo();
  const [lampes, setLampes] = useState<Record<Lampe, boolean>>({ lanterne: true, champignon: true, chevet: true });
  const [bougies, setBougies] = useState(true);
  const [neon, setNeon] = useState(true);
  const [lampeStudio, setLampeStudio] = useState(true);
  const [chaine, setChaine] = useState(0);
  const [zap, setZap] = useState(0);
  const [caresses, setCaresses] = useState(0);
  const [souffle, setSouffle] = useState(0);
  const [visite, setVisite] = useState(false);
  const [aGlisse, setAGlisse] = useState(false);
  const [plie, setPlie] = useState(false);
  const [pieceVue, setPieceVue] = useState<PieceId>("salon");
  const [accords, setAccords] = useState(0);
  const [touches, setTouches] = useState(0);
  // la platine du salon : boucle lo-fi, ou la playlist Spotify quand elle sera là
  const [ecoute, setEcoute] = useState<Ecoute>("off");
  const [spotifyJoue, setSpotifyJoue] = useState(false);
  const [basculeSpotify, setBasculeSpotify] = useState(0);
  const [disque, setDisque] = useState(0);
  // l'ambiance sonore (bouton près de l'interrupteur) et les secrets
  const [son, setSon] = useState(false);
  const [disco, setDisco] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const gammeRef = useRef<number[]>([]);
  const neonRef = useRef<number[]>([]);
  const lumiereRef = useRef<number[]>([]);
  const discoRef = useRef(0);
  const glitchRef = useRef(0);

  const plateauRef = useRef<HTMLDivElement>(null);
  const appartRef = useRef<HTMLDivElement>(null);
  const declencheurRef = useRef<Element | null>(null);
  const visibles = useRef(new Map<Element, boolean>());
  const defile = useRef(false);

  /* ─── Mettre un objet en avant : directement dans le DOM ─── */
  const survoler = useCallback((id: LieuId | null) => {
    const appart = appartRef.current;
    if (!appart) return;
    appart.querySelectorAll("[data-actif]").forEach((el) => el.removeAttribute("data-actif"));
    if (id && !lireLieu()) {
      appart.querySelectorAll(`[data-lieu="${id}"]`).forEach((el) => el.setAttribute("data-actif", ""));
    }
  }, []);

  /* ─── Les pièces construites ───
     Au chargement, seulement celle où l'on arrive (le salon, ou celle d'un
     lien partagé) : sur un téléphone modeste, construire les trois pièces
     d'un coup gelait la page plusieurs secondes. Les autres viennent dès que
     le navigateur a un moment (par petits morceaux, startTransition), ou tout
     de suite si l'on se dirige vers elles. Le contenant de chaque pièce, lui,
     existe toujours (taille, défilement, détection de visibilité). */
  const [montees, setMontees] = useState<readonly PieceId[]>(["salon"]);
  const monter = useCallback((pieces: readonly PieceId[] = PIECES) => {
    setMontees((m) => (pieces.every((p) => m.includes(p)) ? m : PIECES.filter((p) => m.includes(p) || pieces.includes(p))));
  }, []);
  useEffect(() => {
    const tout = () => startTransition(() => monter());
    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(tout, { timeout: 2500 });
      return () => cancelIdleCallback(id);
    }
    const id = window.setTimeout(tout, 1200);
    return () => window.clearTimeout(id);
  }, [monter]);

  /* ─── Aller d'une pièce à l'autre (défilement doux) ─── */
  const allerA = useCallback((piece: PieceId, instantane = false) => {
    const plateau = plateauRef.current;
    const appart = appartRef.current;
    if (!plateau || !appart) return Promise.resolve();
    monter([piece]);
    const cible = defilementPour(plateau, appart, piece);
    if (Math.abs(plateau.scrollLeft - cible) < 2) return Promise.resolve();
    // la pièce d'arrivée se réveille avant le départ, pas en plein mouvement
    const arrivee = appart.querySelector(`.piece.${piece}`);
    if (arrivee) {
      visibles.current.set(arrivee, true);
      marquerVisibles(visibles.current, true);
    }
    if (instantane || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      plateau.scrollLeft = cible;
      return Promise.resolve();
    }
    plateau.scrollTo({ left: cible, behavior: "smooth" });
    // on attend la fin du défilement (arrivé à destination, scrollend, ou un
    // délai de secours), puis on se cale exactement sur la pièce : la caméra
    // en dépend. (Safari avant la version 26 ne connaît pas scrollend : sans
    // le test de position, il attendait toujours le secours, 1,4 s.)
    return new Promise<void>((fini) => {
      const finir = () => {
        plateau.removeEventListener("scrollend", finir);
        plateau.removeEventListener("scroll", arrive);
        window.clearTimeout(secours);
        plateau.scrollLeft = cible;
        fini();
      };
      const arrive = () => {
        if (Math.abs(plateau.scrollLeft - cible) < 1) finir();
      };
      const secours = window.setTimeout(finir, 1400);
      plateau.addEventListener("scrollend", finir);
      plateau.addEventListener("scroll", arrive, { passive: true });
    });
  }, [monter]);

  /* ─── Ouvrir / fermer un coin de l'appartement ─── */
  const ouvrirLieu = useCallback(
    async (id: LieuId) => {
      // On ne retient l'objet que s'il a été atteint au clavier
      const actif = document.activeElement;
      if (!lireLieu()) declencheurRef.current = actif?.matches(":focus-visible") ? actif : null;
      setVisite(true);
      survoler(null);
      // Objet dans l'autre pièce : on y va d'abord, puis la caméra s'approche
      const plateau = plateauRef.current;
      const appart = appartRef.current;
      if (plateau && appart && !lireLieu() && pieceVisible(plateau, appart) !== lieux[id].piece) {
        await allerA(lieux[id].piece);
      }
      // l'arrière-plan va être caché aux lecteurs d'écran : il ne doit pas garder
      // le focus (le panneau le prend, et il revient au déclencheur à la fermeture)
      if (actif instanceof HTMLElement && !actif.closest(".panneau")) actif.blur();
      ouvrir(id);
    },
    [survoler, allerA],
  );
  const ouvrirStream = useCallback(() => void ouvrirLieu("stream"), [ouvrirLieu]);

  /* ─── Arrivée ───
     Avant JavaScript, le CSS décale l'appartement pour montrer le salon
     (voir .appartement). Ici, avant le premier rendu à l'écran, on remplace
     ce décalage par un défilement : même image, mais on peut aller à gauche.
     Un lien partagé vers un autre coin (#stream, #volley) y mène directement. */
  const defilementAuto = useRef(false);
  useLayoutEffect(() => {
    const plateau = plateauRef.current;
    const appart = appartRef.current;
    if (!plateau || !appart) return;
    appart.setAttribute("data-pret", "");
    const id = lireLieu();
    const piece = id ? lieux[id].piece : "salon";
    defilementAuto.current = true;
    plateau.scrollLeft = defilementPour(plateau, appart, piece);
    setPieceVue(piece);
  }, []);

  // La caméra suit la pièce ouverte (y compris avec « retour » ou un lien partagé)
  useEffect(() => {
    const plateau = plateauRef.current;
    const appart = appartRef.current;
    if (!plateau || !appart) return;
    // Pendant une visite, le plateau ne défile plus et n'accroche plus les
    // pièces (data-zoom). En revenant, on attend que la caméra soit posée :
    // réactiver l'accroche pendant le dézoom ferait re-défiler le navigateur
    // à chaque image (et travailler le thread principal tout du long).
    let poser = 0;
    const poserLaCamera = (e?: TransitionEvent) => {
      if (e && (e.target !== appart || e.propertyName !== "transform")) return;
      window.clearTimeout(poser);
      appart.removeEventListener("transitionend", poserLaCamera);
      delete plateau.dataset.zoom;
      marquerVisibles(visibles.current);
    };
    if (ouvert) {
      plateau.dataset.zoom = "true";
      survoler(null);
      // via l'historique, l'objet peut être dans l'autre pièce : on s'y place
      if (pieceVisible(plateau, appart) !== lieux[ouvert].piece) {
        defilementAuto.current = true;
        plateau.scrollLeft = defilementPour(plateau, appart, lieux[ouvert].piece);
      }
    }
    cadrer(plateau, appart, ouvert);
    if (!ouvert && plateau.dataset.zoom) {
      appart.addEventListener("transitionend", poserLaCamera);
      poser = window.setTimeout(poserLaCamera, 1200);
    }
    const surRedim = () => cadrer(plateau, appart, ouvert);
    window.addEventListener("resize", surRedim);
    // En refermant, le focus clavier revient sur l'objet qui avait ouvert le panneau
    if (!ouvert) {
      const el = declencheurRef.current;
      declencheurRef.current = null;
      if (el instanceof HTMLElement) window.setTimeout(() => el.focus({ preventScroll: true }), 50);
    }
    return () => {
      window.removeEventListener("resize", surRedim);
      appart.removeEventListener("transitionend", poserLaCamera);
      window.clearTimeout(poser);
    };
  }, [ouvert, survoler]);

  // Échap referme le panneau ; Tab reste dans le panneau ouvert ; ← → changent de pièce
  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lireLieu()) {
        fermer();
        return;
      }
      if (e.key === "Tab" && lireLieu()) {
        gardeLeFocus(e, lireLieu()!);
        return;
      }
      if (lireLieu() || e.altKey || e.ctrlKey || e.metaKey) return;
      const cible = e.target as HTMLElement;
      if (cible.closest("input, textarea, select, [contenteditable]")) return;
      const plateau = plateauRef.current;
      const appart = appartRef.current;
      if (!plateau || !appart || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
      const i = PIECES.indexOf(pieceVisible(plateau, appart)) + (e.key === "ArrowRight" ? 1 : -1);
      if (i >= 0 && i < PIECES.length) allerA(PIECES[i]);
    };
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [allerA]);

  /* ─── Parallaxe à la souris : deux calques déplacés en transform seul ───
     (pas sur tactile, pas en mouvement réduit, pas pendant une visite).
     Le JS ne fixe qu'une destination, au plus ~12 fois par seconde ; le
     glissement jusqu'à elle est une Web Animation, jouée par la carte
     graphique. Avant, le JS écrivait la position à chaque image : le thread
     principal refaisait alors une image complète 120 fois par seconde (en
     recalculant au passage toutes les animations du décor), et le survol
     des objets ramait dès que le navigateur avait autre chose à faire. */
  const ouvertRef = useRef(ouvert);
  useEffect(() => {
    ouvertRef.current = ouvert;
  }, [ouvert]);

  useEffect(() => {
    const appart = appartRef.current;
    if (!appart) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // le ciel recule, le premier plan avance (px par unité de souris, repère 1600)
    const calques = [
      ...Array.from(appart.querySelectorAll<HTMLElement>(".prl-ciel"), (el) => ({ el, fx: -10, fy: -5 })),
      ...Array.from(appart.querySelectorAll<HTMLElement>(".prl-avant"), (el) => ({ el, fx: 16, fy: 8 })),
    ];
    const cible = { x: 0, y: 0 };
    let de = { x: 0, y: 0 };
    let vers = { x: 0, y: 0 };
    let enCours: Animation[] = [];
    let minuterie = 0;
    let dernier = -Infinity;
    // l'échelle de la pièce ne change qu'au redimensionnement : la relire à
    // chaque fois forcerait le navigateur à recalculer la mise en page
    let k = largeurPiece(appart) / 1600;
    const surRedim = () => (k = largeurPiece(appart) / 1600);
    window.addEventListener("resize", surRedim);

    // où en est le glissement en cours, d'après son avancement (sans lire le
    // style, ce qui forcerait un recalcul) ; annulé par une visite : au centre
    const position = () => {
      const a = enCours[0];
      if (!a || a.playState === "idle") return { x: 0, y: 0 };
      const t = a.effect?.getComputedTiming().progress ?? 1;
      return { x: de.x + (vers.x - de.x) * t, y: de.y + (vers.y - de.y) * t };
    };
    const decalage = (p: { x: number; y: number }, fx: number, fy: number) =>
      `translate3d(${(p.x * fx * k).toFixed(2)}px, ${(p.y * fy * k).toFixed(2)}px, 0)`;
    const viser = () => {
      minuterie = 0;
      if (ouvertRef.current) return;
      dernier = performance.now();
      const ici = position();
      if (Math.abs(cible.x - ici.x) + Math.abs(cible.y - ici.y) < 0.004) return;
      de = ici;
      vers = { ...cible };
      const precedentes = enCours;
      enCours = calques.map(({ el, fx, fy }) =>
        el.animate([{ transform: decalage(de, fx, fy) }, { transform: decalage(vers, fx, fy) }], {
          duration: 650,
          easing: "cubic-bezier(0.25, 0.6, 0.3, 1)",
          fill: "forwards",
          id: "parallaxe",
        }),
      );
      precedentes.forEach((a) => a.cancel());
    };
    const surBouge = (e: PointerEvent) => {
      if (ouvertRef.current || estLeger()) return;
      cible.x = (e.clientX / window.innerWidth) * 2 - 1;
      cible.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!minuterie) minuterie = window.setTimeout(viser, Math.max(0, 80 - (performance.now() - dernier)));
    };
    // passage en mode léger (qualite.ts) : la parallaxe s'arrête, au centre
    const surLeger = () => {
      window.clearTimeout(minuterie);
      minuterie = 0;
      enCours.forEach((a) => a.cancel());
    };
    window.addEventListener("pointermove", surBouge, { passive: true });
    window.addEventListener("appart:leger", surLeger);
    return () => {
      window.removeEventListener("pointermove", surBouge);
      window.removeEventListener("appart:leger", surLeger);
      window.removeEventListener("resize", surRedim);
      window.clearTimeout(minuterie);
      enCours.forEach((a) => a.cancel());
    };
  }, []);

  // Qualité adaptative : si l'appareil peine, mode léger (voir qualite.ts)
  useEffect(() => surveillerFluidite(), []);

  // Pendant une visite, la parallaxe revient au centre (et s'arrête net :
  // sinon elle bougerait encore pendant le zoom)
  useEffect(() => {
    if (!ouvert) return;
    appartRef.current?.querySelectorAll<HTMLElement>(".prl-ciel, .prl-avant").forEach((el) => {
      el.getAnimations().forEach((a) => {
        if (a.id === "parallaxe") a.cancel();
      });
      el.style.transform = "";
    });
  }, [ouvert]);

  /* ─── Une pièce hors de l'écran arrête ses animations ─── */
  useEffect(() => {
    const appart = appartRef.current;
    const plateau = plateauRef.current;
    if (!appart || !plateau) return;
    // la zone est rognée de 4 px à gauche et à droite : une pièce qui touche
    // seulement le bord de l'écran (la voisine) ne compte pas comme visible.
    // Pendant une visite, on ne touche à rien : le zoom fait parfois entrer
    // un liseré de la pièce voisine dans l'écran, et la réveiller en plein
    // mouvement de caméra recalculerait toute la pièce (deux fois).
    const observateur = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((e) => visibles.current.set(e.target, e.isIntersecting));
        if (!plateau.dataset.zoom) marquerVisibles(visibles.current, defile.current);
      },
      { root: plateau, rootMargin: "0px -4px 0px -4px" },
    );
    appart.querySelectorAll(".piece").forEach((p) => observateur.observe(p));
    // le défilement se pose (scrollend, ou rien depuis 250 ms) : on éteint
    // les pièces sorties de l'écran, quand le navigateur a un moment (si une
    // visite commence juste après, ce sera en revenant : voir poserLaCamera)
    let minuterie = 0;
    let repos = 0;
    const eteindre = () => {
      repos = 0;
      if (!defile.current && !plateau.dataset.zoom) marquerVisibles(visibles.current);
    };
    const pose = () => {
      window.clearTimeout(minuterie);
      defile.current = false;
      if (repos) return;
      repos = typeof requestIdleCallback === "function" ? requestIdleCallback(eteindre, { timeout: 600 }) : window.setTimeout(eteindre, 120);
    };
    const bouge = () => {
      defile.current = true;
      window.clearTimeout(minuterie);
      minuterie = window.setTimeout(pose, 250);
    };
    plateau.addEventListener("scroll", bouge, { passive: true });
    plateau.addEventListener("scrollend", pose);
    return () => {
      observateur.disconnect();
      plateau.removeEventListener("scroll", bouge);
      plateau.removeEventListener("scrollend", pose);
      window.clearTimeout(minuterie);
      if (typeof cancelIdleCallback === "function") cancelIdleCallback(repos);
      window.clearTimeout(repos);
    };
  }, []);

  // Le défilement dit dans quelle pièce on est, et replie le mot d'accueil
  const surDefilement = () => {
    const plateau = plateauRef.current;
    const appart = appartRef.current;
    // on glisse vers une pièce pas encore construite : on la construit
    if (montees.length < PIECES.length) monter();
    if (plateau && appart) {
      const p = pieceVisible(plateau, appart);
      if (p !== pieceVue) setPieceVue(p);
    }
    if (defilementAuto.current) {
      defilementAuto.current = false;
      return;
    }
    if (!aGlisse) {
      setAGlisse(true);
      setPlie(true);
    }
  };

  /* ─── Ce qu'on peut faire dans la pièce (fonctions stables) ─── */
  const zapper = useCallback((sens: 1 | -1) => {
    setChaine((c) => (c + sens + projets.length) % projets.length);
    setZap((z) => z + 1);
  }, []);

  // le coin musique : le son est synthétisé (son.ts), la scène fait vibrer les cordes
  const gratter = useCallback((sens: 1 | -1 = 1) => {
    gratterAccord(sens);
    setAccords((a) => a + 1);
  }, []);
  const jouerTouche = useCallback((touche: number) => {
    jouerToucheSon(touche);
    setTouches((t) => t + 1);
    // secret : do, ré, mi, fa, sol à la suite, à partir d'un do
    const g = [...gammeRef.current, touche].slice(-5);
    gammeRef.current = g;
    if (g.length === 5 && g[0] % 7 === 0 && g.every((t, i) => t === g[0] + i)) {
      gammeRef.current = [];
      window.setTimeout(jouerFanfare, 380);
      trouverSecret("gamme");
    }
  }, []);

  /* ─── Les secrets qui touchent toute la page ─── */
  // le mode disco : 12 secondes de boule à facettes et de groove
  const lancerDisco = useCallback(() => {
    if (discoRef.current) return;
    discoRef.current = window.setTimeout(() => {
      discoRef.current = 0;
      setDisco(0);
    }, DUREE_DISCO);
    setDisco(Date.now());
    jouerDisco(DUREE_DISCO / 1000);
    trouverSecret("disco");
  }, []);

  /** Vrai si l'action a été répétée `fois` fois en moins de `ms` millisecondes */
  const repetee = (historique: { current: number[] }, fois: number, ms: number) => {
    const t = performance.now();
    historique.current = [...historique.current.filter((x) => t - x < ms), t];
    if (historique.current.length < fois) return false;
    historique.current = [];
    return true;
  };

  // le code Konami : ↑ ↑ ↓ ↓ ← → ← → B A
  useEffect(() => {
    const CODE = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
    let i = 0;
    const surTouche = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest?.("input, textarea, select, [contenteditable]")) return;
      const k = e.key.toLowerCase();
      if (k === CODE[i]) i++;
      else i = k === "arrowup" ? (i === 2 ? 2 : 1) : 0;
      if (i === CODE.length) {
        i = 0;
        lancerDisco();
      }
    };
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [lancerDisco]);
  // la platine du salon : Spotify (data/musique.ts), ou la boucle lo-fi si Spotify ne répond pas
  const basculerPlatine = useCallback(() => {
    if (ecoute === "spotify") {
      setBasculeSpotify((b) => b + 1);
    } else if (ecoute === "lofi") {
      arreterLofi();
      setEcoute("off");
    } else {
      preparerSon();
      setEcoute("spotify");
    }
  }, [ecoute]);
  const ecouterDisque = useCallback(
    (i: number) => {
      if (ecoute === "spotify" && i === disque) {
        setBasculeSpotify((b) => b + 1);
        return;
      }
      preparerSon();
      arreterLofi();
      setDisque(i);
      setEcoute("spotify");
    },
    [ecoute, disque],
  );
  const spotifyIndisponible = useCallback(() => {
    setSpotifyJoue(false);
    setEcoute(basculerLofi() ? "lofi" : "off");
  }, []);
  const fermerLecteur = useCallback(() => {
    arreterLofi();
    setEcoute("off");
    setSpotifyJoue(false);
  }, []);
  const platine = ecoute === "lofi" || (ecoute === "spotify" && spotifyJoue);
  const arpege = useCallback(() => {
    jouerArpege();
    setTouches((t) => t + 1);
  }, []);
  const grattageDuPanneau = useCallback(() => gratter(1), [gratter]);

  const actions = useMemo<ActionsScene>(
    () => ({
      ouvrir: ouvrirLieu,
      survoler,
      basculerLampe: (l) => setLampes((ls) => ({ ...ls, [l]: !ls[l] })),
      basculerNuit: () => {
        setChoixNuit((c) => !(c ?? nuitAuto));
        // secret : cinq allers-retours de lumière d'affilée lancent le mode disco
        if (repetee(lumiereRef, 5, 4000)) lancerDisco();
      },
      souffler: () => {
        setBougies((b) => !b);
        setSouffle((s) => s + 1);
      },
      caresser: () => setCaresses((c) => c + 1),
      basculerNeon: () => {
        setNeon((n) => !n);
        // secret : l'enseigne malmenée se détraque
        if (repetee(neonRef, 4, 3000)) {
          setGlitch(true);
          window.clearTimeout(glitchRef.current);
          glitchRef.current = window.setTimeout(() => setGlitch(false), 3200);
          trouverSecret("neon");
        }
      },
      basculerLampeStudio: () => setLampeStudio((l) => !l),
      gratter,
      jouerTouche,
      basculerPlatine,
      trouverSecret,
    }),
    [ouvrirLieu, survoler, nuitAuto, gratter, jouerTouche, basculerPlatine, lancerDisco],
  );

  /* ─── L'ambiance sonore : elle suit la météo, la nuit, la pièce, la musique ─── */
  const pluieSon = meteo?.temps === "orage" ? 2 : meteo?.temps === "pluie" ? 1 : 0;
  const oiseaux = !meteo || meteo.temps === "clair" || meteo.temps === "nuageux";
  const musiqueSon = platine || disco > 0;
  const reglagesSon: ReglagesAmbiance = { pluie: pluieSon, nuit, bougies, piece: pieceVue, musique: musiqueSon, oiseaux };
  useEffect(() => {
    if (son) reglerAmbiance({ pluie: pluieSon, nuit, bougies, piece: pieceVue, musique: musiqueSon, oiseaux });
  }, [son, pluieSon, nuit, bougies, pieceVue, musiqueSon, oiseaux]);
  useEffect(() => () => arreterAmbiance(), []);
  const basculerSon = () => {
    if (son) arreterAmbiance();
    else demarrerAmbiance(reglagesSon);
    setSon(!son);
  };

  // mémorisé : ouvrir un panneau ou défiler ne redessine pas les trois pièces
  const decor = periode?.decor ?? null;
  const etat = useMemo<EtatScene>(
    () => ({ nuit, lampes, bougies, chaine, zap, caresses, souffle, neon, lampeStudio, accords, touches, platine, decor }),
    [nuit, lampes, bougies, chaine, zap, caresses, souffle, neon, lampeStudio, accords, touches, platine, decor],
  );
  const visiteEnCours = ouvert !== null;
  // une pièce est construite si elle l'a déjà été, si on la regarde, ou si
  // l'objet ouvert s'y trouve (lien partagé vers #stream, #volley…)
  const construite = (p: PieceId) => montees.includes(p) || pieceVue === p || (ouvert !== null && lieux[ouvert].piece === p);

  return (
    <>
      <a href="#plan" className="lien-evitement">
        Aller au plan de l&apos;appartement
      </a>

      {/* Mot d'accueil (le titre de la page) et interrupteur */}
      <header aria-hidden={visiteEnCours || undefined}>
        <Accueil cache={visiteEnCours || pieceVue !== "salon"} plie={plie} setPlie={setPlie} />
        {/* le coin en haut à droite : interrupteur, son, live, secrets */}
        <div
          className="hud pointer-events-none fixed top-3 right-3 z-10 flex flex-col items-end gap-2 min-[900px]:top-5 min-[900px]:right-5"
          data-cache={visiteEnCours}
        >
          <div className="flex flex-col items-end gap-2 min-[900px]:flex-row min-[900px]:items-start">
            <Interrupteur nuit={nuit} meteo={meteo} onBasculer={actions.basculerNuit} className="min-[900px]:order-2" />
            <BoutonSon actif={son} onBasculer={basculerSon} className="min-[900px]:order-1" />
          </div>
          <EnDirect live={liveReel} jeu={etatStream.jeu} onOuvrir={ouvrirStream} />
          <CompteurSecrets />
        </div>
      </header>

      <main>
        <div
          ref={plateauRef}
          className="plateau"
          aria-hidden={visiteEnCours || undefined}
          onScroll={surDefilement}
        >
          <div
            ref={appartRef}
            className="appartement"
            data-nuit={nuit}
            data-meteo={meteo?.temps ?? "clair"}
            data-lanterne={lampes.lanterne}
            data-champignon={lampes.champignon}
            data-chevet={lampes.chevet}
            data-bougies={bougies}
            data-neon={neon}
            data-studio={lampeStudio}
            data-live={etatStream.enDirect}
            data-saison={periode?.saison}
            data-evenement={periode?.evenement ?? undefined}
            data-cadre={visiteEnCours}
            data-visite={visite}
            data-glitch={glitch}
          >
            <div className="piece gymnase" role="group" aria-label="Le gymnase">
              {construite("gymnase") && (
                <>
                  <Gymnase actions={actions} />
                  <Reperes piece="gymnase" />
                </>
              )}
            </div>
            <div className="piece salon" role="group" aria-label="Le salon">
              {/* hydraté à part : la page répond aux premiers gestes plus tôt */}
              <Suspense fallback={null}>
                <Scene etat={etat} actions={actions} />
                <Reperes piece="salon" />
              </Suspense>
            </div>
            <div className="piece studio" role="group" aria-label="Le studio de stream">
              {construite("studio") && (
                <>
                  <Studio etat={etat} actions={actions} etatStream={etatStream} />
                  <Reperes piece="studio" />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Le plan de l'appartement (navigation) et le passage d'une pièce à l'autre */}
        <div aria-hidden={visiteEnCours || undefined}>
          <Passage piece={pieceVue} sens="gauche" onAller={allerA} cache={visiteEnCours} />
          <Passage piece={pieceVue} sens="droite" onAller={allerA} cache={visiteEnCours} />
          <div id="plan">
            <Plan cache={visiteEnCours} live={liveReel} onOuvrir={ouvrirLieu} onSurvoler={survoler} />
          </div>
          {!aGlisse && (
            <p
              className="hud pointer-events-none fixed inset-x-0 bottom-[5.5rem] z-10 mx-auto flex w-max items-center gap-2 rounded-full bg-espresso/85 px-3.5 py-1.5 text-xs font-medium text-creme min-[900px]:hidden"
              data-cache={visiteEnCours}
            >
              <MoveHorizontal className="size-4" aria-hidden />
              Glissez pour faire le tour de l&apos;appart
            </p>
          )}
        </div>

        {/* l'arrivée : la porte du palier s'ouvre sur le salon */}
        <Entree />
        {disco > 0 && <Disco key={disco} />}
        <AnnonceSecret />

        <Lecteur
          ecoute={ecoute}
          disque={disque}
          joue={platine}
          bascule={basculeSpotify}
          onLecture={setSpotifyJoue}
          onChoisir={ecouterDisque}
          onEchec={spotifyIndisponible}
          onFermer={fermerLecteur}
        />

        {/* Cliquer à côté du panneau ramène au salon */}
        {ouvert && (
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={fermer}
            className="fixed inset-0 z-20 cursor-zoom-out bg-transparent"
          />
        )}

        {/* les panneaux (fermés au chargement) sont hydratés à part, eux aussi */}
        <Suspense fallback={null}>
        <Panneau id="realisations" ouvert={ouvert === "realisations"} surtitre="à la télé ce soir" titre="Mes réalisations" onFermer={fermer}>
          <Realisations chaine={chaine} zapper={zapper} />
        </Panneau>
        <Panneau id="krylos" ouvert={ouvert === "krylos"} surtitre="l'affiche du salon" titre="Krylos, mon agence" onFermer={fermer}>
          <Krylos />
        </Panneau>
        <Panneau id="atelier" ouvert={ouvert === "atelier"} surtitre="le mur de cadres" titre="Mon atelier" onFermer={fermer}>
          <Atelier />
        </Panneau>
        <Panneau id="a-propos" ouvert={ouvert === "a-propos"} surtitre="le portrait au mur" titre="Enchanté !" onFermer={fermer}>
          <APropos />
        </Panneau>
        <Panneau id="contact" ouvert={ouvert === "contact"} surtitre="la lettre sur la table" titre="Écrivez-moi" onFermer={fermer}>
          <Contact />
        </Panneau>
        <Panneau id="volley" ouvert={ouvert === "volley"} surtitre="le gymnase, à gauche du salon" titre="Le volley, mon autre terrain" onFermer={fermer}>
          <Volley />
        </Panneau>
        <Panneau id="musique" ouvert={ouvert === "musique"} surtitre="le coin musique du studio" titre="La musique" onFermer={fermer}>
          <Musique
            gratter={grattageDuPanneau}
            arpege={arpege}
            enCours={ecoute === "spotify" ? disque : -1}
            joue={platine}
            ecouter={ecouterDisque}
          />
        </Panneau>
        <Panneau id="stream" ouvert={ouvert === "stream"} surtitre="le studio, au fond à droite" titre="En live le week-end" onFermer={fermer}>
          <Stream etat={etatStream} />
        </Panneau>
        </Suspense>
      </main>
    </>
  );
}

/** Étiquettes manuscrites et petites lueurs, posées sur les objets d'une pièce */
const Reperes = memo(function Reperes({ piece }: { piece: PieceId }) {
  return (
    <>
      {LIEUX.filter((id) => lieux[id].piece === piece).map((id) => {
        const { repere, indice, etiquette } = lieux[id];
        return (
          <div key={id} aria-hidden>
            <span className="indice" style={{ left: `${indice.x / 16}%`, top: `${indice.y / 10}%` }} />
            <span className="etiquette" data-lieu={id} style={{ left: `${repere.x / 16}%`, top: `${repere.y / 10}%` }}>
              <span className="papier block rounded-md px-3 py-1 font-main text-xl leading-tight whitespace-nowrap text-espresso">
                {etiquette}
              </span>
            </span>
          </div>
        );
      })}
    </>
  );
});
