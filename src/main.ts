import { GoldenLayout, LayoutConfig } from 'golden-layout';
import { createApp } from 'vue';
import './style.css';
import ChangesList from './components/ChangesList.vue';
import DiffPreview from './components/DiffPreview.vue';
import UserInfo from './components/UserInfo.vue';

const container = document.getElementById('layout-container') as HTMLElement;

const layoutConfig: LayoutConfig = {
    root: {
        type: 'row',
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

layout.loadLayout(layoutConfig);

window.addEventListener('resize', () => {
    layout.updateSize(container.offsetWidth, container.offsetHeight);
});
