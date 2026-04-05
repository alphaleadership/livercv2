import { GoldenLayout, LayoutConfig } from 'golden-layout';
import { createApp } from 'vue';
// @ts-ignore
import cssStyles from './style.css?inline';
import ChangesList from './components/ChangesList.vue';
import DiffPreview from './components/DiffPreview.vue';
import UserInfo from './components/UserInfo.vue';
import StatusBar from './components/StatusBar.vue';
import Sidebar from './components/Sidebar.vue';

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
 * Initialisation de l'interface LiveRC v2 intégrée
 */
const startLiveRC = () => {
    const contentElement = document.getElementById('mw-content-text');
    if (!contentElement || document.getElementById('liverc-v2-main-container')) return;

    // On ne masque RIEN du reste de Wikipédia
    // On crée juste notre conteneur dans la zone centrale
    const appContainer = document.createElement('div');
    appContainer.id = 'liverc-v2-main-container';
    
    // On remplace le contenu de la page par notre interface
    contentElement.innerHTML = '';
    contentElement.appendChild(appContainer);

    injectStyles();

    // On s'adapte à la largeur du parent et on fixe une hauteur confortable
    appContainer.style.width = '100%';
    appContainer.style.height = '75vh'; // Hauteur relative au viewport mais reste dans le flux
    appContainer.style.minHeight = '650px';
    appContainer.style.border = '1px solid #a2a9b1';
    appContainer.style.marginTop = '10px';

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
            container.element.style.overflow = 'auto';
            container.element.style.background = '#fff';
        });
    };

    registerComp('ChangesList', ChangesList);
    registerComp('DiffPreview', DiffPreview);
    registerComp('UserInfo', UserInfo);
    registerComp('StatusBar', StatusBar);
    registerComp('Sidebar', Sidebar);

    layout.loadLayout(layoutConfig);

    window.addEventListener('resize', () => {
        if (appContainer.offsetWidth > 0) {
            layout.updateSize(appContainer.offsetWidth, appContainer.offsetHeight);
        }
    });
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
        mw.util.addPortletLink(
            'p-navigation', 
            // @ts-ignore
            mw.util.getUrl(targetPage), 
            'LiveRC v2', 
            'n-livercv2',
            'Accéder à LiveRC v2'
        );

        if (pageName === targetPage || pageName === 'Wikipedia:LiveRC') {
            // @ts-ignore
            mw.hook('wikipage.content').add(() => {
                startLiveRC();
            });
        }
    });
}
