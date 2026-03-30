import { GoldenLayout, LayoutConfig } from 'golden-layout';
import { createApp } from 'vue';
// @ts-ignore
import cssStyles from './style.css?inline';
import ChangesList from './components/ChangesList.vue';
import DiffPreview from './components/DiffPreview.vue';
import UserInfo from './components/UserInfo.vue';
import StatusBar from './components/StatusBar.vue';

/**
 * Injection isolée du CSS
 */
const injectStyles = (target: HTMLElement) => {
    const styleTag = document.createElement('style');
    styleTag.id = 'liverc-v2-injected-styles';
    styleTag.textContent = cssStyles;
    target.appendChild(styleTag);
};

/**
 * Initialisation de l'interface LiveRC v2
 */
const startLiveRC = () => {
    const contentElement = document.getElementById('mw-content-text');
    if (!contentElement || document.getElementById('liverc-v2-main-container')) return;

    // Masquer les éléments perturbateurs de Wikipédia sur la page cible
    document.body.classList.add('liverc-active');
    const firstHeading = document.getElementById('firstHeading');
    if (firstHeading) firstHeading.style.display = 'none';
    const siteSub = document.getElementById('siteSub');
    if (siteSub) siteSub.style.display = 'none';
    const contentSub = document.getElementById('contentSub');
    if (contentSub) contentSub.style.display = 'none';

    // Création de la racine de l'application
    const appContainer = document.createElement('div');
    appContainer.id = 'liverc-v2-main-container';
    
    // Nettoyage et préparation
    contentElement.innerHTML = '';
    contentElement.appendChild(appContainer);

    injectStyles(appContainer);

    // Taille maximale : on occupe tout l'écran disponible
    appContainer.style.width = '100%';
    appContainer.style.height = 'calc(100vh - 120px)'; // Ajusté pour le header WP
    appContainer.style.minHeight = '700px';
    appContainer.style.border = '1px solid #a2a9b1';

    const layoutConfig: LayoutConfig = {
        root: {
            type: 'column',
            content: [{
                type: 'row',
                height: 95,
                content: [{
                    type: 'stack',
                    width: 35,
                    content: [{
                        type: 'component',
                        componentType: 'ChangesList',
                        title: 'Modifications'
                    }]
                }, {
                    type: 'column',
                    content: [{
                        type: 'component',
                        componentType: 'DiffPreview',
                        title: 'Aperçu'
                    }, {
                        type: 'component',
                        componentType: 'UserInfo',
                        title: 'Utilisateur'
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
        });
    };

    registerComp('ChangesList', ChangesList);
    registerComp('DiffPreview', DiffPreview);
    registerComp('UserInfo', UserInfo);
    registerComp('StatusBar', StatusBar);

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

        // Lien dans la barre latérale (toujours présent)
        // @ts-ignore
        mw.util.addPortletLink(
            'p-navigation', 
            // @ts-ignore
            mw.util.getUrl(targetPage), 
            'LiveRC v2', 
            'n-livercv2',
            'Lancer LiveRC v2'
        );

        if (pageName === targetPage || pageName === 'Wikipedia:LiveRC') {
            // @ts-ignore
            mw.hook('wikipage.content').add(() => {
                startLiveRC();
            });
        }
    });
}
