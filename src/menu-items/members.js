// assets
import { IconBrandChrome, IconDashboard, IconDeviceAnalytics } from '@tabler/icons';

// constant
const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics,
     IconBrandChrome: IconBrandChrome,
};

//-----------------------|| DASHBOARD MENU ITEMS ||-----------------------//

export const members = {
    id: 'members',
    title: 'Members',
    type: 'group',
    children: [
         {
            id: 'add-member',
            title: 'Register New Member',
            type: 'item',
            url: '/addmember-page',
            icon: icons['IconBrandChrome'],
            breadcrumbs: false
        },
              {
            id: 'view-members',
            title: 'View Members',
            type: 'item',
            url: '/viewmembers-page',
            icon: icons['IconBrandChrome'],
            breadcrumbs: false
        },
    ]
};
