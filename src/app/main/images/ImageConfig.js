import Image from './Image';

export const ImageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/photographer/images',
            component: Image
        }
    ]
};

/**
 * Lazy load Image
 */
/*
import FuseLoadable from '@fuse/components/FuseLoadable/FuseLoadable';

export const ImageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/Image',
            component: FuseLoadable({
                loader: () => import('./Image')
            })
        }
    ]
};
*/
