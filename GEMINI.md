## Context de Wikipatrouille (LiveRCv2)

### Objectifs
- Application web (Toolforge) pour la patrouille sur Wikipédia francophone et cross-wiki.
- Remplacer LiveRC (obsolète) avec une interface plus ergonomique et moderne (Golden-layout).
- Utilisation de l'API MediaWiki, OAuth et EventStream.

### Instructions Spécifiques (Memories)
- **Règle Absolue (JPL NASA)** : Suivre impérativement les 10 règles de codage du JPL :
    1. Éviter les constructions de flux complexes (pas de `goto`, pas de récursivité).
    2. Toutes les boucles doivent avoir des limites fixes (éviter les boucles infinies).
    3. Éviter d'allouer de la mémoire sur la heap (tas).
    4. Limiter les fonctions à une seule page affichable (environ 60 lignes).
    5. Utiliser un minimum de deux assertions par fonction.
    6. Limiter la portée des variables au plus petit possible.
    7. Vérifier la valeur de retour de toutes les fonctions non-void.
    8. Utiliser le préprocesseur avec parcimonie (macros limitées).
    9. Limiter l'utilisation des pointeurs (un seul déréférencement, pas de pointeurs de fonction).
    10. Compiler avec tous les avertissements actifs et les corriger tous avant publication.
- **Langue** : Toujours communiquer en français avec l'utilisateur.
- **Prepush Hook** : Avant chaque `push`, s'assurer que la version dans `package.json` est incrémentée et que les tests/stabilité sont vérifiés.


### Plan d'implémentation
Les tâches détaillées se trouvent dans `.kiro/specs/wikipedia-patrol-tool/tasks.md`.
