// assets
import { IconBrandChrome, IconDashboard, IconDeviceAnalytics } from '@tabler/icons';

// constant
const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics,
    IconBrandChrome: IconBrandChrome
};

//-----------------------|| DASHBOARD MENU ITEMS ||-----------------------//

export const attendance = {
    id: 'attendance',
    title: 'Attendance',
    type: 'group',
    children: [
        {
            id: 'mark-attendance',
            title: 'Mark Attendance',
            type: 'item',
            url: '/markattendance-page',
            icon: icons['IconBrandChrome'],
            breadcrumbs: false
        },
        {
            id: 'mark-picattendance',
            title: 'Mark Picture Attendance',
            type: 'item',
            url: '/markpicattendance-page',
            icon: icons['IconBrandChrome'],
            breadcrumbs: false
        },
        ,
        {
            id: 'view-attendance',
            title: 'View Attendance',
            type: 'item',
            url: '/viewattendance-page',
            icon: icons['IconBrandChrome'],
            breadcrumbs: false
        }
    ]
};
