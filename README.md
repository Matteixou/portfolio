# Chez Matthieu — portfolio

Le portfolio de Matthieu Feracho, co-fondateur de [Krylos](https://krylos.fr), se visite comme un appartement de
trois pièces, dessiné à la main en SVG : le **gymnase** à gauche, le **salon** où l'on arrive, le **studio** de stream
à droite. Chaque objet ouvre une partie du site.

| Pièce | Objet | Ce qu'il ouvre | Ancre |
|---|---|---|---|
| Gymnase | Le filet | Le volley (Efrei Volley, compétition universitaire) | `#volley` |
| Salon | La télé | Réalisations (une chaîne par projet, on zappe) | `#realisations` |
| Salon | L'affiche Krylos | L'agence | `#krylos` |
| Salon | Le mur de cadres | Les technologies | `#atelier` |
| Salon | Le portrait (selfie) | À propos | `#a-propos` |
| Salon | La lettre sur la table basse | Formulaire de contact | `#contact` |
| Studio | Les écrans | Le stream (Twitch, le week-end de 21 h à minuit) | `#stream` |
| Studio | La guitare et le clavier | La musique (8 ans de conservatoire, ce que j'écoute) | `#musique` |

Pour le plaisir : la fenêtre et l'interrupteur font tomber la nuit (lune, tour Eiffel, projecteurs du gymnase),
les lampes s'allument, les bougies se soufflent, le chat aime les caresses ; le joueur du gymnase saute et smashe
(un point pour l'Efrei à chaque fois) ; l'enseigne néon et la lampe du studio s'allument, le voyant « ON AIR »
s'éclaire pendant le créneau du live ; le panneau Musique joue un vrai accord de guitare, synthétisé en direct.

L'appartement vit aussi à l'heure de Villejuif :

- **Météo réelle** : s'il pleut, neige ou fait de l'orage à Villejuif, ça se voit aux fenêtres du salon et du
  gymnase ; l'interrupteur affiche la température.
- **La nuit tombe toute seule** de 20 h à 7 h (heure de Paris). L'interrupteur reste prioritaire.
- **La platine vinyle** (salon, sur le meuble à vinyles) joue sur Spotify les artistes qu'écoute Matthieu
  (Coldplay avec « A Sky Full of Stars », Alex Warren avec « Emerald Eyes », Alan Walker, Tayc) ; un mini-lecteur apparaît en bas à gauche pour changer de disque, et
  le panneau Musique a les mêmes disques. Sans compte Spotify connecté, Spotify ne donne que des extraits de 30 s.
  Si Spotify ne se charge pas, une boucle lo-fi composée en direct prend le relais.
- **Les cordes de la guitare** se grattent en passant la souris dessus (dans un sens puis dans l'autre), et le
  clavier se joue en cliquant ou en glissant sur les touches.

- **Le vrai statut Twitch** : le voyant « ON AIR », les écrans du studio et le panneau Stream s'allument quand le
  live est vraiment lancé, avec le jeu en cours ; une pastille « En live » apparaît sous l'interrupteur et un point
  rouge sur « Le stream » dans le plan. Sans clés Twitch (voir plus bas), le site se fie aux horaires.
- **Le calendrier** : tous les décors sont prêts à l'avance et s'activent seuls, d'après la date de Paris. Une saison
  de fond toute l'année, et par-dessus les temps forts :

  | Période | Ce qui change |
  |---|---|
  | Hiver (21 déc. → 19 mars) | Givre aux vitres, bonnet pour le chat |
  | Printemps (20 mars → 20 juin) | Pétales dehors, fleurs sur le balcon |
  | Été (21 juin → 21 sept.) | Lunettes de soleil pour le chat, fleurs, lucioles la nuit |
  | Automne (22 sept. → 20 déc.) | Feuilles mortes dehors |
  | 31 déc. → 2 janv. | Nouvel An : décor de Noël + feux d'artifice la nuit |
  | 3 → 15 janv. | Galette des rois sur la table basse, couronne pour le chat |
  | 10 → 14 févr. | Saint-Valentin : ballons cœurs, roses, guirlande rose, lunettes cœur |
  | Rameaux → lundi de Pâques | Pâques (date calculée chaque année) : lapin en chocolat, oreilles de lapin, chasse aux œufs (5 œufs cachés dans le salon, à ramasser dans le panier) |
  | 30 avr. → 1er mai | Brin de muguet sur la table basse |
  | 21 juin | Fête de la musique : notes qui montent de la rue, casque pour le chat |
  | 13 → 14 juil. | 14 juillet : fanions et feux d'artifice bleu-blanc-rouge, drapeau au balcon, béret |
  | 1er → 7 sept. | Rentrée : cartable, cahiers, lunettes d'étude |
  | 20 oct. → 2 nov. | Halloween : citrouilles (fenêtre, balcon, frigo), guirlande orange, toile d'araignée, chauves-souris, chapeau de sorcière |
  | 1er → 30 déc. | Noël : sapin à la place du ficus, cadeaux, neige en bombe sur les vitres, guirlandes, bonnet de Père Noël |

Pour tester sans attendre : `/?meteo=pluie` (`clair`, `nuageux`, `pluie`, `neige`, `orage`), `/?heure=22` (heure de
Paris simulée), `/?saison=noel` (`hiver`, `printemps`, `ete`, `automne`, `nouvel-an`, `galette`, `saint-valentin`, `paques`, `muguet`,
`fete-musique`, `14-juillet`, `rentree`, `halloween`) et
`/?live=Valorant` (live simulé sur ce jeu ; `?live=0` : hors ligne).

**L'ambiance sonore** (bouton haut-parleur à côté de l'interrupteur, coupée par défaut) : la pluie quand il pleut à
Villejuif et le tonnerre pendant l'orage, la rumeur de la ville (plus présente la nuit) et des voitures qui passent,
le crépitement des bougies dans le salon, quelques oiseaux par beau temps. Tout est synthétisé
(`components/appart/ambiance.ts`) ; le son suit la pièce à l'écran, baisse quand la platine joue et se coupe quand
l'onglet est caché.

**Le logo de Krylos** (affiche du salon, panneau Krylos, visite express) : le vrai logo, découpé en quatre pétales
(`public/images/krylos/`, composant `components/appart/LogoKrylos.tsx`). Au repos les pétales respirent ; au survol de
l'affiche ils s'écartent en tournant et le K se dessine entre eux ; la nuit, le logo s'éclaire comme un caisson
lumineux ; à l'ouverture du panneau, ils arrivent de quatre côtés et s'assemblent.

**L'horloge murale** du salon donne l'heure de Paris (aiguilles en CSS, calées une fois au chargement).

**Les 8 secrets** (compteur et indices sous l'interrupteur, progression gardée dans le navigateur du visiteur) :

| Secret | Comment le trouver |
|---|---|
| L'étoile filante | La nuit, cliquer sur la lune |
| Paris scintille | La nuit, cliquer sur la tour Eiffel |
| Le chat a l'œil | Approcher la souris du chat (sur mobile : le caresser 3 fois) : il se réveille et suit le pointeur des yeux |
| Le carillon | Cliquer sur l'horloge |
| Mode disco | Le code Konami (↑ ↑ ↓ ↓ ← → ← → B A), ou l'interrupteur actionné 5 fois d'affilée |
| Le roi du smash | Au gymnase, faire smasher le joueur 5 fois |
| Do, ré, mi, fa, sol | Au studio, jouer la gamme sur le clavier à partir d'un do |
| Le néon détraqué | Au studio, allumer et éteindre l'enseigne 4 fois très vite |

**La visite express** (`/en-bref`) : tout le portfolio sur une fiche, pour les visiteurs pressés (bouton « Pressé ? Le
résumé en 30 s » dans le mot d'accueil). Elle s'imprime proprement : « Enregistrer en PDF » en fait un CV.

## Commandes

```bash
npm run dev        # http://localhost:3000
npm run salon      # régénère les images du décor (après une retouche de decor*.tsx)
npm run lint
npm run typecheck
npm run build && npm run start
```

> Si une modification de `app/globals.css` ne s'affiche pas en développement, redémarrer `npm run dev`
> (le CSS de Turbopack reste parfois en cache).

## Où modifier quoi

- **Textes** : `data/` — `krylos.ts` (repris de krylos.fr), `projets.ts`, `technos.ts`, `moi.ts`, `stream.ts`,
  `volley.ts`, `musique.ts`.
- **La musique** : `data/musique.ts` — `artistes` (nom, identifiant Spotify pris dans `open.spotify.com/artist/…`,
  couleur de l'étiquette du disque, et `titre` pour jouer un morceau précis). Une playlist perso peut s'ajouter : coller son lien de partage dans `playlist`,
  elle devient le premier disque.
- **Photos** : `public/images/` — `moi-cadre.webp` (cadre du salon), `moi.webp` (À propos), `logo-efrei-volley.webp`.
- **Les coins à visiter** : `components/appart/lieux.ts` (pièce, étiquette, lueur, cadrage de la caméra).
- **Les panneaux** : `components/appart/pieces/`.
- **Le calendrier** : les dates dans `components/appart/saisons.ts` ; les dessins dans `components/appart/scene/saisons.tsx`
  (saisons, Halloween, Noël) et `scene/temps-forts.tsx` (table basse, sol, fanions).
- **La visite express** : `app/en-bref/page.tsx` (lit les mêmes fichiers `data/`).
- **Couleurs, animations** : `app/globals.css`.

## La scène, et pourquoi elle est construite ainsi

Repère de 1600 × 1000 par pièce (`components/appart/scene/`). Pour rester fluide, chaque pièce est un empilement
de calques :

- **Décor fixe** (`decor.tsx`, `decor-gymnase.tsx`, `decor-studio.tsx`) : transformé en images par `npm run salon`
  (dont `meubles-noel`, la version du salon avec le sapin, chargée seulement en décembre)
  (`public/salon/`, noms à empreinte, cache d'un an). Les calques détaillés deviennent des WebP en définition ×1,5 :
  la carte graphique les agrandit au zoom sans les redessiner. **À relancer après toute retouche de ces fichiers.**
- **Objets touchables** (`objets*.tsx`) : de vrais liens et boutons HTML avec leur petit SVG.
- **Ce qui bouge ou éclaire** (`vivants*.tsx`, et les animations des objets) : petits calques animés uniquement en
  `transform` / `opacity`, pris en charge par la carte graphique.
- Le survol et la parallaxe modifient le DOM directement (pas de re-rendu React) ; nuit, lampes, bougies passent
  par des attributs `data-*` sur l'appartement. Une pièce hors de l'écran arrête ses animations.

Règles de fluidité, apprises en mesurant (à respecter quand on ajoute quelque chose) :

- **Pas de boucle courte.** Même confiée à la carte graphique, une animation coûte ~6 images de travail au
  navigateur à chaque fin de cycle : des ailes qui battent toutes les 0,38 s l'empêchaient de dormir. Les boucles
  d'ambiance enchaînent donc plusieurs mouvements dans une seule animation longue (10 à 30 s).
- **Pas de `inert` sur la scène** : l'activer recalcule le style de chacun de ses éléments. Pendant une visite,
  l'arrière-plan est caché aux lecteurs d'écran (`aria-hidden`) et Tab tourne dans le panneau.
- **Attention aux règles en `*`** (`.panneau:not([data-ouvert="true"]) *`) : changer cet attribut sur n'importe
  quel élément fait recalculer tout son contenu. L'appartement utilise donc `data-cadre`, pas `data-ouvert`.
- **Ce qui ne se voit pas n'a pas d'animation** (`animation-name: none`, **jamais `animation-play-state:
  paused`**) : pièces hors écran (détection rognée de 4 px, sinon les pièces voisines comptent comme visibles),
  panneaux fermés, calques de jour la nuit et inversement, météo absente, lampes éteintes, lueurs après la
  première visite. Tant qu'une animation en pause existe, Chrome la remet en attente à chaque image pendant un
  mouvement de caméra, et le thread principal recalcule alors toute la scène 120 fois par seconde (mesuré : −70 %
  de travail à la fermeture d'un panneau, −60 % à l'ouverture, en les retirant).
- **Pendant une visite, le plateau ne bouge plus** : `data-zoom` (posé par `Appart.tsx`, pas par React) coupe
  le défilement et l'accroche des pièces, et ne s'enlève qu'une fois la caméra posée (`transitionend`).
  Réactivée pendant le dézoom, l'accroche faisait re-défiler le navigateur à chaque image. Même logique pour
  `data-visible` : figé pendant la visite (le zoom fait parfois entrer un liseré de la pièce voisine), et la
  parallaxe s'arrête net à l'ouverture (sinon elle continuait à bouger pendant le zoom).
- **Changer de pièce sans recalcul en plein mouvement** : la pièce qui arrive se réveille dès qu'elle entre à
  l'écran (ou avant le départ, avec les flèches et le plan), celle qui part n'est éteinte qu'une fois le
  défilement posé (`scrollend`, puis un moment de calme). L'éteindre en plein glissé recalculait ses ~700
  éléments et faisait sauter 1 à 4 images.
- **Pas de rebond au bout de l'appartement** (`overscroll-behavior: none` sur le plateau) : au pavé tactile,
  le rebond étirait le décor et laissait voir le fond presque noir de la page.
- **Rien d'écrit à chaque image depuis le JS.** Chaque mouvement de souris fait déjà refaire une image au
  navigateur (pour savoir ce qu'il y a sous le curseur), et à chaque image il recalcule le style de toutes les
  animations du décor. La parallaxe ne fixe donc qu'une destination ~12 fois par seconde (Web Animation jouée
  par la carte graphique) au lieu d'écrire la position 120 fois par seconde ; les yeux du chat suivent le
  curseur 25 fois par seconde. Mesuré : −29 % de travail du thread principal en bougeant la souris, survol
  d'un objet ~430 → ~160 ms de travail.
- **Chargement léger, pour les téléphones modestes** (mesuré avec un processeur ralenti ×6) :
  - seule la pièce d'arrivée est construite au chargement ; le gymnase et le studio viennent dès que le navigateur
    a un moment (`requestIdleCallback` + `startTransition`, en petits morceaux), ou tout de suite si l'on glisse
    vers eux ou qu'un lien partagé y mène (`montees` / `construite()` dans `Appart.tsx`) ;
  - le salon et les panneaux sont hydratés à part (`<Suspense>`) : la page répond plus tôt aux premiers gestes ;
  - un panneau fermé n'est pas mis en page (`content-visibility: hidden`, qui s'endort après la fin du glissement
    grâce à `transition … allow-discrete`) ;
  - résultat : thread bloqué 5,3 → 3,8 s, plus longue tâche 2,2 → 1,1 s au chargement ; à-coups à l'ouverture d'un
    panneau sur iPhone 105 → 26 ms.
- **Calques de parallaxe isolés seulement à la souris** (`will-change` sous `(hover: hover) and (pointer: fine)`) :
  au doigt ou en mode léger, ils ne servent à rien. Attention à l'effet d'avalanche : un calque isolé de la taille
  d'une pièce force à isoler tout ce qui le chevauche par-dessus. (Pour juger la mémoire graphique, mesurer les
  tuiles réellement dessinées — `memory-infra`, `cc/tile_memory` — pas la surface des calques : sur téléphone,
  ~35 Mo de tuiles pour ~90 Mpx de calques.)
- **Qualité adaptative** (`components/appart/qualite.ts`) : pendant les premiers gestes, on compte les images
  ratées ; si l'appareil décroche nettement (3 mesures sur 6 avec plus de 30 % d'images ratées), le site
  passe en « léger » pour la session : sans parallaxe, sans lueur floue au survol (léger soulèvement à la
  place), sans poussière, oiseaux, feuilles lointaines, lucioles ; nuages et lueurs figés. Rien n'est mesuré
  pendant l'arrivée ni dans les 3 s qui suivent. Un appareil modeste est en léger d'emblée et entre directement
  dans le salon, sans l'arrivée animée, décidé par le script du `<head>` (`app/layout.tsx`) avant le premier
  affichage, **sur tous les navigateurs** : un mini-test de vitesse de 6 ms (score sous 50, soit plus de ~3,5 fois
  plus lent qu'un PC portable récent, qui fait ~190), ou un appareil qui se déclare modeste
  (`navigator.deviceMemory` ≤ 2 Go, économie de données ; Chrome, Edge et Android seulement). Le score est gardé
  sur `<html data-vitesse>` : à demander à un visiteur qui signale un souci. Pour essayer : `?leger=1` (forcé)
  ou `?leger=0`.
- **Sans `scrollend`** (Safari avant la version 26) : aller dans une autre pièce s'arrête dès que le défilement
  atteint sa destination, au lieu d'attendre le délai de secours (ouvrir le volley depuis le salon : 1,5 → 0,7 s).
- **Pas de lecture de mise en page à chaque image** (largeur de la pièce, position du chat : gardées en mémoire).
- **Animations CSS toujours nommées en entier** : le CSS compilé vide un raccourci `animation:` sans nom.
- **La toute première ouverture d'un panneau** dans un navigateur neuf marque un temps (~150-250 ms sur une carte
  graphique intégrée) : Chrome prépare ses programmes de dessin et dessine la scène à 2,2× pour la première fois,
  puis garde tout en cache (ensuite : 0 à 30 ms, même après relance). Essais sans gain mesurable, donc retirés :
  figer la résolution pendant le zoom, isoler les images du décor dans leurs calques, figer les halos.
  Pour mesurer, utiliser un profil Chrome qui a déjà vu le site : un profil neuf recompile ces programmes à
  chaque fois (ex. ouvrir le volley depuis le salon : 67 images ratées à froid, 11 avec le cache).
- Le son (`components/appart/son.ts`) est synthétisé : corde pincée de Karplus-Strong, onde triangle pour le clavier,
  boucle lo-fi (accords, basse, batterie, craquements de vinyle). Spotify passe par son iFrame API (`spotify.ts`).
- La météo vient d'[Open-Meteo](https://open-meteo.com) (gratuit, sans clé) via `app/api/meteo/route.ts`, mise en
  cache 10 minutes : un seul appel par tranche de 10 minutes, quel que soit le nombre de visiteurs.

## Fonctionnement

- **L'arrivée** (`components/appart/Entree.tsx`) : on remonte le couloir jusqu'à la porte (tapis, cadre,
  applique, paillasson « bienvenue », plaque « M. Feracho », post-it « entrez, c'est ouvert ! », couronne à Noël,
  citrouille à Halloween) : quelques pas, la vue balance un peu puis se pose. La poignée s'abaisse, la porte
  s'ouvre sur le vrai salon, puis on entre : le palier grandit et s'efface. La marche démarre quand la page a
  pris vie (`data-marche`, posé à l'hydratation : lancée au premier affichage, elle s'écoulait pendant le
  chargement, où le navigateur ne dessine presque rien). La porte s'ouvre seule une fois arrivé devant
  (`animationend` de « approche ») et la page chargée, ou tout de suite au clic ou à une touche (on entend la
  sonnette). Le palier est dessiné plus large que la pièce (de -400 à 2000) pour la vue de loin. Une seule fois
  par visite ; jamais pour un lien direct (`#contact`…), sans JavaScript ou si le visiteur préfère moins
  d'animations (décidé par le script du `<head>`, avant le premier affichage).

- La pièce ouverte vit dans l'adresse (`#contact`…) : lien partageable, le bouton « retour » referme.
- À l'ouverture, la « caméra » (une transformation CSS de l'appartement) vient cadrer l'objet ; le panneau glisse
  depuis la gauche sur ordinateur, depuis le bas sur mobile. On change de pièce avec les flèches, les touches ← →
  ou en glissant sur mobile. Avant JavaScript, un décalage CSS montre déjà le salon.
- Sans JavaScript, les ancres ouvrent quand même les panneaux (`:target`).
- `prefers-reduced-motion` coupe toutes les animations ; la parallaxe ne s'active qu'avec une souris.

## Formulaire de contact

`app/api/contact/route.ts` envoie la lettre par [Resend](https://resend.com). Copier `.env.example` en `.env.local`
et renseigner `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` (et les mêmes variables sur Vercel).

## Statut Twitch

`app/api/twitch/route.ts` interroge l'API officielle de Twitch (au plus une fois par minute, quel que soit le nombre
de visiteurs). Créer une application sur [dev.twitch.tv/console](https://dev.twitch.tv/console) (gratuit, catégorie
« Website », URL de redirection `http://localhost`), puis renseigner `TWITCH_CLIENT_ID` et `TWITCH_CLIENT_SECRET` dans
`.env.local` et sur Vercel.

L'écran principal du studio suit ce statut (`EcransStudio`, `scene/vivants-studio.tsx`) : en direct, l'image du
jeu, la webcam et le jeu du moment ; sinon, un écran de pause de streamer (logo, prochain live avec compte à
rebours, planning du week-end avec le prochain jour en violet, jeux au programme) ; à l'heure du créneau sans live
détecté, la variante « Bientôt » (jour en cours en ambre). Pour essayer : `?live=Valorant` ou `?live=0`.

## Versions précédentes

Sauvegardées à côté du projet : `../_sauvegarde-avant-appart-2026-10-15/` et `../_sauvegarde-avant-cocooning-2026-10-15/`.
