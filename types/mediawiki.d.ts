declare namespace mw {
    interface Api {
        get(params: object): Promise<any>;
        post(params: object): Promise<any>;
    }
    var Api: {
        new (): Api;
    };
    var loader: {
        using(modules: string[]): Promise<void>;
    };
    var util: {
        addPortletLink(
            portletId: string,
            href: string,
            text: string,
            id?: string,
            tooltip?: string,
            accesskey?: string,
            nextnode?: HTMLElement
        ): HTMLElement | null;
    };
}
