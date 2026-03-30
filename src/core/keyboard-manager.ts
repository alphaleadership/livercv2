export type ShortcutHandler = (event: KeyboardEvent) => void;

interface Shortcut {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    description: string;
    handler: ShortcutHandler;
}

export class KeyboardManager {
    private shortcuts: Shortcut[] = [];

    constructor() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    public register(shortcut: Shortcut): void {
        this.shortcuts.push(shortcut);
    }

    private handleKeyDown(event: KeyboardEvent): void {
        // Éviter les raccourcis quand on tape dans un champ de texte
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
        }

        const match = this.shortcuts.find(s => 
            s.key.toLowerCase() === event.key.toLowerCase() &&
            !!s.ctrl === event.ctrlKey &&
            !!s.shift === event.shiftKey &&
            !!s.alt === event.altKey
        );

        if (match) {
            event.preventDefault();
            match.handler(event);
        }
    }

    public unregisterAll(): void {
        this.shortcuts = [];
    }
}

export const keyboardManager = new KeyboardManager();
