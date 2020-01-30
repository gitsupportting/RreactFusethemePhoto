import React from 'react';
import { Redirect } from 'react-router-dom';
import { FuseUtils } from '@fuse/index';
import { LoginConfig } from 'app/main/login/LoginConfig';
import { RegisterConfig } from 'app/main/register/RegisterConfig';
import { ContactsAppConfig } from 'app/main/contacts/ContactsAppConfig';
import { ImageConfig } from 'app/main/images/ImageConfig';
import { GalleryConfig } from 'app/main/galleries/GalleryConfig';
import { ContentConfig } from 'app/main/content/ContentConfig';
import { ContentImageConfig } from 'app/main/contentimages/ContentImageConfig'

const routeConfigs = [
    LoginConfig,
    RegisterConfig,
    ContactsAppConfig,
    ImageConfig,
    GalleryConfig,
    ContentConfig,
    ContentImageConfig,
];

const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
    {
        path: '/photographer',
        component: () => <Redirect to="/photographer/login" />
    },
    {
        path: '/photographer/register',
        component: () => <Redirect to="/photographer/register" />
    },
    {
        path: '/photographer/apps/contacts/all',
        component: () => <Redirect to="/photographer/apps/contacts/all" />
    },
    {
        path: '/photographer/images',
        component: () => <Redirect to="/photographer/images" />
    },
    {
        path: '/photographer/galleries',
        component: () => <Redirect to="/photographer/galleries" />
    },
    {
        path: '/photographer/contents',
        component: () => <Redirect to="/photographer/contents" />
    },
    {
        path: '/photographer/content/images',
        component: () => <Redirect to="/photographer/content/images" />
    },
];

export default routes;
