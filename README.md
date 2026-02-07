# Marial RV Adventure – Site vitrine (multi-pages + Avis)

Pages:
- index.html (Accueil)
- vehicules.html (Véhicules)
- avis.html (Avis)
- faq.html (FAQ)
- contact.html (Contact)

## Email (déjà configuré)
Le formulaire envoie vers: info@marialrv.com

Si vous voulez changer plus tard:
- ouvrez `assets/main.js` et modifiez `DEST_EMAIL`.

## Lien RVezy
Profil:
https://www.rvezy.com/profile/219489?cta=header-nav-avatar

## Mise en ligne gratuite
- Netlify : glissez-déposez le dossier (ou le zip décompressé).
- GitHub Pages : mettez tout à la racine d’un repo et activez Pages.

## Photos
Dans `vehicules.html`, vous pouvez remplacer le `<svg>` par:
<img src="URL_DE_VOTRE_PHOTO" alt="Photo de la roulotte" style="width:100%;height:160px;object-fit:cover" />


## Logo
Le logo est inclus dans `assets/logo-*.png` et affiché dans l'en-tête.


## Réservation Google Calendar (à configurer)
Dans `assets/main.js` :
- `- `CALENDAR_URL` : https://calendar.google.com/calendar/u/0/r?pli=1
- `CALENDAR_EMBED_URL` : (optionnel) mettez le lien "embed" si vous voulez afficher le calendrier dans `reservation.html`

## Crédit photo (fond de la page d’accueil)
Photo de fond: "Summer at Hungry Mother (22520835034).jpg" (CC BY 2.0) – auteur: vastateparksstaff.
Source et licence: Wikimedia Commons (voir la page du fichier) + Creative Commons BY 2.0.

Note : ce lien ouvre la page Google Calendar (connexion requise). Pour une vraie prise de rendez-vous publique, utilisez plutôt un lien "Appointment schedule".


## Pages de roulottes (sans lien externe)
Les pages suivantes ont été ajoutées :
- roulotte-jayco-287bhs.html
- roulotte-forest-river-23dbh.html
- roulotte-crossroads-253rb.html
- roulotte-zinger-330bh.html

### Ajouter des photos dans la galerie
Dans chaque page de roulotte, remplacez un bloc :
`<div class="g-item"></div>`
par une image, exemple :

`<img class="g-item-img" src="assets/mes-photos/jayco-1.jpg" alt="Jayco 287BHS" />`

Astuce : créez un dossier `assets/mes-photos/` et mettez vos images dedans.

Les photos de la Jayco ont été ajoutées dans `assets/mes-photos/jayco-287bhs/`.


## Photos Zinger
Les photos de la Zinger ont été ajoutées dans `assets/mes-photos/zinger-330bh/`.


## Photos Sunset
Les photos de la Sunset Trail 253RB ont été ajoutées dans `assets/mes-photos/sunset-253rb/`.


## Photos Forest River
Les photos de la Forest River 23DBH ont été ajoutées dans `assets/mes-photos/forest-23dbh/`.


## Description Forest River
La description personnalisée a été ajoutée dans `roulotte-forest-river-23dbh.html`.


## Description Zinger
La description personnalisée a été ajoutée dans `roulotte-zinger-330bh.html`.


## Description Jayco
La description personnalisée a été ajoutée dans `roulotte-jayco-287bhs.html`.


## Description Sunset
La description personnalisée a été ajoutée dans `roulotte-crossroads-253rb.html`.


## Calculateur de prix
Une page `calculateur.html` a été ajoutée : 150 $/nuit, livraison 3 $/km depuis 319 Massenet J3B 8V9 (aller seulement), et options propane/literie/installation.
