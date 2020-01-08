const navigationConfig = [
    {
        'id'      : 'applications',
        'title'   : 'Applications',
        'type'    : 'group',
        'icon'    : 'apps',
        'children': [          
            
            {
                'id'   : 'contacts',
                'title': 'Users',
                'type' : 'item',
                'icon' : 'account_box',
                'url'  : '/photographer/apps/contacts/all'
            },
            {
                'id'   : 'content',
                'title': 'Contents',
                'type' : 'item',
                'icon' : 'account_box',
                'url'  : '/photographer/content'
            },
            // {
            //     'id'   : 'galleries',
            //     'title': 'Galleries',
            //     'type' : 'item',
            //     'icon' : 'account_box',
            //     'url'  : '/photographer/galleries'
            // },            
        ],
    }
];

export default navigationConfig;
