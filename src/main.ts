import { GoldenLayout, LayoutConfig } from 'golden-layout';
import { createApp } from 'vue';
import './style.css';
import ChangesList from './components/ChangesList.vue';
import DiffPreview from './components/DiffPreview.vue';
import UserInfo from './components/UserInfo.vue';
import StatusBar from './components/StatusBar.vue';

const container = document.getElementById('layout-container') as HTMLElement;

const layoutConfig: LayoutConfig = {
    root: {
        type: 'column',
        content: [{
            type: 'row',
            height: 95,
            content: [{
                type: 'stack',
                width: 40,
                content: [{
                    type: 'component',
                    componentType: 'ChangesList',
                    title: 'Modifications Récentes'
                }]
            }, {
                type: 'column',
                content: [{
                    type: 'component',
                    componentType: 'DiffPreview',
                    title: 'Prévisualisation Diff'
                }, {
                    type: 'component',
                    componentType: 'UserInfo',
                    title: 'Informations Utilisateur'
                }]
            }]
        }, {
            type: 'component',
            componentType: 'StatusBar',
            title: 'Barre d\'état',
            height: 5,
            header: { show: false }
        }]
    }
};

const layout = new GoldenLayout(container);

// Helper pour enregistrer un composant Vue
const registerVueComponent = (name: string, component: any) => {
    layout.registerComponentFactoryFunction(name, (container) => {
        const app = createApp(component);
        app.mount(container.element);
    });
};

registerVueComponent('ChangesList', ChangesList);
registerVueComponent('DiffPreview', DiffPreview);
registerVueComponent('UserInfo', UserInfo);
registerVueComponent('StatusBar', StatusBar);

layout.loadLayout(layoutConfig);

window.addEventListener('resize', () => {
    layout.updateSize(container.offsetWidth, container.offsetHeight);
});
