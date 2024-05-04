export default [
    {
        path: '/',
        component: '../layouts/BasicLayout',
        layout: false,
        routes: [
            {
                path: '/',
                redirect: '/home',
            },
            {
                path: '/home',
                name: 'Home',
                component: './Home',
            },
            {
                path: '/industry',
                routes: [
                    {
                        path: '/industry',
                        name: 'Industry',
                        component: './Industry',
                    },
                    {
                        path: '/industry/:id',
                        name: 'IndustryDetail',
                        component: './IndustryDetail',
                    }
                ]
            }
        ]
    },
    
]