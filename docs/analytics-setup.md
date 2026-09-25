# Mesure d’audience Cobalith

1. Finaliser `docs/supabase-setup.md` et vérifier que le premier compte administrateur est approuvé.
2. Exécuter `docs/analytics-supabase.sql` dans Supabase SQL Editor.
3. Si `pg_cron` n’est pas disponible, activer **Cron** dans Supabase puis rejouer les trois dernières instructions SQL. Sans cela, appeler périodiquement `purge_expired_analytics_events()` depuis un job serveur.
4. Déployer avec `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` (ou `VITE_SUPABASE_ANON_KEY`). Ne jamais exposer de clé `service_role`.
5. Accepter la catégorie « Mesure d’audience interne » sur le site, naviguer entre plusieurs pages, puis ouvrir `/equipe/audience` avec un compte administrateur.

La collecte est déclenchée uniquement après consentement et s’arrête dès le retrait. La table n’est jamais lisible publiquement. Les insertions passent par une fonction SQL qui valide les champs, interdit les routes internes et impose l’horodatage serveur. Les identifiants sont pseudonymes et ne sont jamais reliés au compte connecté.

Les URL complètes, paramètres libres, adresses IP, agents utilisateurs bruts, contenus saisis et identifiants de compte ne sont pas enregistrés dans `analytics_events`. Supabase peut néanmoins traiter des données techniques dans ses journaux d’infrastructure selon sa propre politique et la configuration du projet.

Le tableau de bord charge au maximum 10 000 événements pour la période sélectionnée. Pour un trafic supérieur, déplacer les agrégations vers des fonctions SQL avant d’augmenter cette limite.
