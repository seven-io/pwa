const pkg = require('../../package.json');

const controllerKey = 'action';

type SevenCustomEventData = {
    [key: string]: any
} & { [controllerKey]?: never };

export const dispatchCustomEvent = (action: string, data: SevenCustomEventData = {}): boolean => {
    const customEvent = new CustomEvent(pkg.seven.name, {
        detail: {...data, [controllerKey]: action}
    });

    return window.dispatchEvent(customEvent);
};
