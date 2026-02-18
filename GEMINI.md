## Context de Wikipatrouille (LiveRCv2)

### Objectifs
- Application web (Toolforge) pour la patrouille sur Wikipédia francophone et cross-wiki.
- Remplacer LiveRC (obsolète) avec une interface plus ergonomique et moderne (Golden-layout).
- Utilisation de l'API MediaWiki, OAuth et EventStream.

### Instructions Spécifiques (Memories)
- **Langue** : Toujours communiquer en français avec l'utilisateur.
- **Prepush Hook** : Avant chaque `push`, s'assurer que la version dans `package.json` est incrémentée et que les tests/stabilité sont vérifiés.
- **Localisation** : Si aucune coordonnée n'est précisée, utiliser la première ville mentionnée comme point de repère.
- **Workflow** : Proposer proactivement la création d'une pull request après des modifications de code.

### Plan d'implémentation
Les tâches détaillées se trouvent dans `.kiro/specs/wikipedia-patrol-tool/tasks.md`.
