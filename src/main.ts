import { GoldenLayout, LayoutConfig } from 'golden-layout';
import { createApp } from 'vue';
// @ts-ignore
import cssStyles from './style.css?inline';
import ChangesList from './components/ChangesList.vue';
import DiffPreview from './components/DiffPreview.vue';
import UserInfo from './components/UserInfo.vue';
import StatusBar from './components/StatusBar.vue';
import Sidebar from './components/Sidebar.vue';

const injectStyles = () => {
    if (document.getElementById('liverc-v2-styles')) return;
    const styleTag = document.createElement('style');
    styleTag.id = 'liverc-v2-styles';
    styleTag.textContent = cssStyles;
    document.head.appendChild(styleTag);
};

const startLiveRC = () => {
    const contentElement = document.getElementById('mw-content-text');
    if (!contentElement || document.getElementById('liverc-v2-main-container')) return;

    // Plein écran : on cache tout le superflu
    const elementsToHide = ['firstHeading', 'siteSub', 'contentSub', 'left-navigation', 'right-navigation', 'p-cactions', 'p-views'];
    elementsToHide.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const appContainer = document.createElement('div');
    appContainer.id = 'liverc-v2-main-container';
    contentElement.innerHTML = '';
    contentElement.appendChild(appContainer);

    injectStyles();

    // Dimensions plein écran dynamique
    appContainer.style.width = '100%';
    appContainer.style.height = 'calc(100vh - 50px)'; // On garde juste une marge pour le header WP
    appContainer.style.background = 'white';

    const layoutConfig: LayoutConfig = {
        root: {
            type: 'column',
            content: [{
                type: 'row',
                height: 96,
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
                title: 'StatusBar',
                height: 4,
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
        });
    };

    registerComp('ChangesList', ChangesList);
    registerComp('DiffPreview', DiffPreview);
    registerComp('UserInfo', UserInfo);
    registerComp('StatusBar', StatusBar);
    registerComp('Sidebar', Sidebar);

    layout.loadLayout(layoutConfig);

    window.addEventListener('resize', () => {
        layout.updateSize(appContainer.offsetWidth, appContainer.offsetHeight);
    });
};

// @ts-ignore
if (typeof mw !== 'undefined') {
    // @ts-ignore
    mw.loader.using(['mediawiki.util', 'mediawiki.api']).then(() => {
        // @ts-ignore
        const pageName = mw.config.get('wgPageName');
        const targetPage = 'Wikipédia:LiveRC';
        // @ts-ignore
        mw.util.addPortletLink('p-navigation', mw.util.getUrl(targetPage), 'LiveRC v2', 'n-livercv2');

        if (pageName === targetPage || pageName === 'Wikipedia:LiveRC') {
            // @ts-ignore
            mw.hook('wikipage.content').add(() => startLiveRC());
        }
    });
}
