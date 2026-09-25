# Cookies et mesure d’audience

État actuel : aucun service d’audience ni publicité. Le panneau public enregistre uniquement la préférence dans le localStorage (cobalith.cookie-preferences), pour six mois, sans transmission serveur. Session Supabase distincte, strictement nécessaire à la connexion. Les pages administratives ne montrent pas le bandeau.

Le bouton Tout accepter ne préautorise pas un futur fournisseur : AUDIENCE_AVAILABLE est false, la catégorie reste false et mayMeasureAudience() refuse toujours l’activation actuelle. Fermer ou naviguer ne vaut pas accord. Les choix sont accessibles depuis le footer et le bouton Cookies. Refus et acceptation ont la même durée. Si le stockage est indisponible, seul l’état de la visite est conservé.

## Avant d’intégrer une mesure d’audience

- Confirmer le responsable de traitement, l’outil et ses prestataires, les finalités, données, destinataires, durées et éventuels transferts. Finaliser les documents juridiques encore en brouillon.
- Évaluer les conditions d’une éventuelle exemption CNIL. Par défaut, conserver le blocage avant accord explicite.
- Décrire le service réel dans le panneau et la politique ; changer CONSENT_VERSION et activer la catégorie seulement lorsque ces informations et l’intégration sont prêtes. Un changement de version invalide tous les anciens choix.
- Charger le SDK et envoyer les événements seulement si mayMeasureAudience(choice) retourne true. Aucun préchargement, pixel, requête ni stockage analytique avant ce contrôle. Revérifier au moment de chaque envoi.
- À la révocation (contexte React / événement cobalith:consent-change), arrêter immédiatement la collecte, annuler les envois et supprimer les traceurs propres à l’outil selon son API. Le panneau seul ne peut pas neutraliser un SDK chargé ailleurs.
- Définir la preuve de consentement adaptée au dispositif réel. Le présent enregistrement local n’est pas un registre serveur de preuve. Ne pas transmettre automatiquement des identifiants au panel admin.
- Tester les requêtes avant choix, après refus, après accord, après retrait, après expiration et dans plusieurs onglets ; tester le stockage bloqué et la mise à jour de version.

Références : https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite et https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/FAQ

Vérification locale : node --test tests/consent.test.mjs
