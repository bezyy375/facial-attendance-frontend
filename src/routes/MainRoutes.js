import React, { lazy } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

// project imports
import MainLayout from './../layout/MainLayout';
import Loadable from '../ui-component/Loadable';
import AuthGuard from './../utils/route-guard/AuthGuard';
// import MarkAttendance from '../views/1_AttendanceViews/markattendance-page';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('../views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('../views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('../views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('../views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('../views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('../views/sample-page')));

const AddMember = Loadable(lazy(() => import('../views/0_MemberViews/addmember-page')));
const ViewMembers = Loadable(lazy(() => import('../views/0_MemberViews/viewmembers-page')));
const MarkAttendance = Loadable(lazy(() => import('../views/1_AttendanceViews/markattendance-page')));
const ViewAttendance = Loadable(lazy(() => import('../views/1_AttendanceViews/viewattendance-page')));

//-----------------------|| MAIN ROUTING ||-----------------------//

const MainRoutes = () => {
    const location = useLocation();

    return (
        <Route
            path={[
                '/dashboard/default',

                '/utils/util-typography',
                '/utils/util-color',
                '/utils/util-shadow',
                '/icons/tabler-icons',
                '/icons/material-icons',

                '/sample-page',

                '/addmember-page',
                '/viewmembers-page',
                '/markattendance-page',
                '/viewattendance-page'
            ]}
        >
            <MainLayout>
                <Switch location={location} key={location.pathname}>
                    <AuthGuard>
                        <Route path="/dashboard/default" component={DashboardDefault} />

                        <Route path="/utils/util-typography" component={UtilsTypography} />
                        <Route path="/utils/util-color" component={UtilsColor} />
                        <Route path="/utils/util-shadow" component={UtilsShadow} />
                        <Route path="/icons/tabler-icons" component={UtilsTablerIcons} />
                        <Route path="/icons/material-icons" component={UtilsMaterialIcons} />

                        <Route path="/sample-page" component={SamplePage} />
                        <Route path="/addmember-page" component={AddMember} />
                        <Route path="/viewmembers-page" component={ViewMembers} />
                        <Route path="/markattendance-page" component={MarkAttendance} />
                        <Route path="/viewattendance-page" component={ViewAttendance} />
                    </AuthGuard>
                </Switch>
            </MainLayout>
        </Route>
    );
};

export default MainRoutes;
