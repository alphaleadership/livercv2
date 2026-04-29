import { GoldenLayout, LayoutConfig } from 'golden-layout';
import { createApp } from 'vue';
// @ts-ignore
import cssStyles from './style.css?inline';
import ChangesList from './components/ChangesList.vue';
import DiffPreview from './components/DiffPreview.vue';
import UserInfo from './components/UserInfo.vue';
import StatusBar from './components/StatusBar.vue';
import Sidebar from './components/Sidebar.vue';
import History from './components/History.vue';
import Settings from './components/Settings.vue';

/**
 * Injection du CSS dans le document
 */
const injectStyles = () => {
    if (document.getElementById('liverc-v2-styles')) return;
    const styleTag = document.createElement('style');
    styleTag.id = 'liverc-v2-styles';
    styleTag.textContent = cssStyles;
    document.head.appendChild(styleTag);
};

/**
 * Initialisation de l'interface LiveRC v2 dans une modale
 */
const startLiveRC = () => {
    if (document.getElementById('liverc-v2-modal')) return;

    injectStyles();

    // Création de l'overlay de la modale
    const overlay = document.createElement('div');
    overlay.id = 'liverc-v2-modal';
    overlay.className = 'liverc-modal-overlay';

    // Création du conteneur de la modale
    const modalContainer = document.createElement('div');
    modalContainer.className = 'liverc-modal-container';

    // Header de la modale
    const header = document.createElement('div');
    header.className = 'liverc-modal-header';
    header.innerHTML = `
        <h2>LiveRC v2 - Patrouille en temps réel</h2>
        <button class="liverc-modal-close" title="Fermer">&times;</button>
    `;

    // Conteneur pour Golden Layout
    const appContainer = document.createElement('div');
    appContainer.id = 'liverc-v2-main-container';

    modalContainer.appendChild(header);
    modalContainer.appendChild(appContainer);
    overlay.appendChild(modalContainer);
    document.body.appendChild(overlay);

    // Fonction de fermeture
    const closeLiveRC = () => {
        document.body.removeChild(overlay);
        // On pourrait aussi détruire l'instance Golden Layout ici si nécessaire
    };

    header.querySelector('.liverc-modal-close')?.addEventListener('click', closeLiveRC);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeLiveRC();
    });

    const layoutConfig: LayoutConfig = {
        root: {
            type: 'column',
            content: [{
                type: 'row',
                height: 95,
                content: [{
                    type: 'component',
                    componentType: 'Sidebar',
                    title: 'Menu',
                    width: 15,
                    header: { show: false }
                }, {
                    type: 'component',
                    componentType: 'ChangesList',
                    title: 'Modifications',
                    width: 25
                }, {
                    type: 'stack',
                    width: 60,
                    content: [{
                        type: 'component',
                        componentType: 'DiffPreview',
                        title: 'Aperçu Diff'
                    }, {
                        type: 'component',
                        componentType: 'UserInfo',
                        title: 'Contributeur'
                    }]
                }]
            }, {
                type: 'component',
                componentType: 'StatusBar',
                title: 'Stats',
                height: 5,
                header: { show: false }
            }]
        }
    };

    const layout = new GoldenLayout(appContainer);

    const registerComp = (name: string, component: any) => {
        layout.registerComponentFactoryFunction(name, (container) => {
            const app = createApp(component);
            app.mount(container.element);
            // On laisse le composant Vue gérer son propre défilement
            container.element.style.background = '#fff';
        });
    };

    registerComp('ChangesList', ChangesList);
    registerComp('DiffPreview', DiffPreview);
    registerComp('UserInfo', UserInfo);
    registerComp('StatusBar', StatusBar);
    registerComp('Sidebar', Sidebar);
    registerComp('History', History);
    registerComp('Settings', Settings);

    // Initialisation du layout
    layout.loadLayout(layoutConfig);

    // Gestionnaire global pour ouvrir des composants depuis les vues Vue
    // @ts-ignore
    window.livercOpenComponent = (componentType: string, title: string) => {
        if (!layout.rootItem) return;

        // Recherche récursive simplifiée d'un composant par son type
        const findComponent = (item: any): any => {
            if (item.isComponent && item.componentType === componentType) return item;
            if (item.contentItems) {
                for (const child of item.contentItems) {
                    const found = findComponent(child);
                    if (found) return found;
                }
            }
            return null;
        };

        const existing = findComponent(layout.rootItem);
        
        if (existing) {
            existing.parentItem.setActiveComponentItem(existing);
        } else {
            // Ajouter au stack central
            try {
                // @ts-ignore
                const root = layout.rootItem;
                // Dans notre config, on cherche le premier stack disponible pour accueillir le nouveau composant
                const findFirstStack = (item: any): any => {
                    if (item.isStack) return item;
                    if (item.contentItems) {
                        for (const child of item.contentItems) {
                            const found = findFirstStack(child);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const targetStack = findFirstStack(root);
                if (targetStack) {
                    targetStack.addComponent(componentType, undefined, title);
                }
            } catch (e) {
                console.error("Impossible d'ajouter le composant au layout", e);
            }
        }
    };

    // Forcer un premier rendu correct
    setTimeout(() => {
        if (appContainer.offsetWidth > 0 && appContainer.offsetHeight > 0) {
            layout.updateSize(appContainer.offsetWidth, appContainer.offsetHeight);
        }
    }, 0);

    // Utilisation d'un ResizeObserver pour gérer le redimensionnement du conteneur de la modale
    const resizeObserver = new ResizeObserver(() => {
        if (appContainer.offsetWidth > 0 && appContainer.offsetHeight > 0) {
            layout.updateSize(appContainer.offsetWidth, appContainer.offsetHeight);
        }
    });
    resizeObserver.observe(appContainer);

    // Nettoyage lors de la fermeture
    const originalClose = closeLiveRC;
    const cleanupClose = () => {
        resizeObserver.disconnect();
        originalClose();
    };
    header.querySelector('.liverc-modal-close')?.removeEventListener('click', closeLiveRC);
    header.querySelector('.liverc-modal-close')?.addEventListener('click', cleanupClose);
};

// Point d'entrée sécurisé pour MediaWiki
// @ts-ignore
if (typeof mw !== 'undefined') {
    // @ts-ignore
    mw.loader.using(['mediawiki.util', 'mediawiki.api']).then(() => {
        // @ts-ignore
        const pageName = mw.config.get('wgPageName');
        const targetPage = 'Wikipédia:LiveRC';

        // Toujours ajouter le lien dans la sidebar de WP
        // @ts-ignore
        const portletLink = mw.util.addPortletLink(
            'p-navigation', 
            '#', 
            'LiveRC v2', 
            'n-livercv2',
            'Accéder à LiveRC v2'
        );

        if (portletLink) {
            portletLink.addEventListener('click', (e: MouseEvent) => {
                e.preventDefault();
                startLiveRC();
            });
        }

        if (pageName === targetPage || pageName === 'Wikipedia:LiveRC') {
            // @ts-ignore
            mw.hook('wikipage.content').add(() => {
                startLiveRC();
            });
        }
    });
}
