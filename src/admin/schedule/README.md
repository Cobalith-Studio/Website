# Outil Planning Service

Module isole pour l'admin panel React/Vite.

## Flux

1. Copier le prompt depuis l'outil.
2. Envoyer ce prompt a ChatGPT avec la photo du planning.
3. ChatGPT renvoie uniquement un JSON.
4. Coller le JSON dans l'import texte.
5. Corriger les cellules marquees `UNDETECTED`.
6. Valider le planning.

## Stockage

Les plannings valides sont sauvegardes dans Supabase via `admin_records`, collection `service_schedules`.

## Aucun OCR

Le module ne contient plus d'OCR, Gemini, OpenAI, fonction Edge ou traitement image.
