// import { Component } from 'react';
var navigationConfig = [
    {
        'id': 'applications',
        'title': 'Applications',
        'type': 'group',
        'icon': 'apps',
        'children': [

            {
                'id': 'contacts',
                'title': 'Users',
                'type': 'item',
                'icon': 'account_box',
                'url': '/photographer/apps/contacts/all'
            },
            {
                'id': 'content',
                'title': 'Contents',
                'type': 'item',
                'icon': 'account_box',
                'url': '/photographer/contents'
            },
        ],
    }
];
var selectedLan = localStorage.getItem('language');
if (selectedLan === '1') {
    navigationConfig = [
        {
            'id': 'applications',
            'title': 'יישומים',
            'type': 'group',
            'icon': 'apps',
            'children': [

                {
                    'id': 'contacts',
                    'title': 'משתמשים',
                    'type': 'item',
                    'icon': 'account_box',
                    'url': '/photographer/apps/contacts/all'
                },
                {
                    'id': 'content',
                    'title': 'תוכן',
                    'type': 'item',
                    'icon': 'account_box',
                    'url': '/photographer/contents'
                },
            ],
        }
    ];
}
if (selectedLan === '2') {
    navigationConfig = [
        {
            'id': 'applications',
            'title': 'تطبيقات',
            'type': 'group',
            'icon': 'apps',
            'children': [

                {
                    'id': 'contacts',
                    'title': 'المستخدمين',
                    'type': 'item',
                    'icon': 'account_box',
                    'url': '/photographer/apps/contacts/all'
                },
                {
                    'id': 'content',
                    'title': 'محتويات',
                    'type': 'item',
                    'icon': 'account_box',
                    'url': '/photographer/contents'
                },
            ],
        }
    ];
}


export default navigationConfig;

