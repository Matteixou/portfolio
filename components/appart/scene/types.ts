import type { LieuId } from "../lieux";
import type { DecorSaison } from "../saisons";
import type { IdSecret } from "../secrets";

export type Lampe = "lanterne" | "champignon" | "chevet";

/** Ce que la scène peut demander à l'appartement (fonctions stables) */
export interface ActionsScene {
  ouvrir: (id: LieuId) => void;
  /** Met un objet en avant (survol, focus clavier, plan) sans re-rendu React */
  survoler: (id: LieuId | null) => void;
  basculerLampe: (l: Lampe) => void;
  basculerNuit: () => void;
  souffler: () => void;
  caresser: () => void;
  basculerNeon: () => void;
  basculerLampeStudio: () => void;
  /** Jouer dans la scène : gratter la guitare, une touche du clavier, la platine */
  gratter: (sens: 1 | -1) => void;
  jouerTouche: (touche: number) => void;
  basculerPlatine: () => void;
  /** Un des huit secrets de l'appart vient d'être trouvé */
  trouverSecret: (id: IdSecret) => void;
}

export interface EtatScene {
  nuit: boolean;
  lampes: Record<Lampe, boolean>;
  bougies: boolean;
  /** Projet affiché à la télé */
  chaine: number;
  /** Incrémenté à chaque zapping (relance la neige) */
  zap: number;
  /** Nombre de caresses au chat (relance les cœurs) */
  caresses: number;
  /** Incrémenté quand on souffle les bougies (relance la fumée) */
  souffle: number;
  /** Studio : l'enseigne néon et la lampe de studio */
  neon: boolean;
  lampeStudio: boolean;
  /** Accords grattés, arpèges joués (relancent cordes et notes) */
  accords: number;
  touches: number;
  /** La platine du salon tourne */
  platine: boolean;
  /** Le décor de la période : saison + temps fort de l'année (null côté serveur) */
  decor: DecorSaison | null;
}
