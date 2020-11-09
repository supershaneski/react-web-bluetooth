import React from "react";
import { Route, withRouter } from "react-router-dom";

const Home = React.lazy(() => import('./Home'));
const LEScan = React.lazy(() => import('./components/LEScan'));
const ReadBattery = React.lazy(() => import('./components/ReadBattery'));
const WriteHeart = React.lazy(() => import('./components/WriteHeart'));
const Notification = React.lazy(() => import('./components/Notification'));

export const routes = [
    {
        component: Home,
        path: "/"
    },
    {
        component: LEScan,
        path: "/scan"
    },
    {
        component: ReadBattery,
        path: "/battery"
    },
    {
        component: WriteHeart,
        path: "/heart"
    },
    {
        component: Notification,
        path: "/notify"
    }
]

const Routes = withRouter(({ location }) => {
    console.log(location);
    return (
        <React.Fragment>
            {
                routes.map(route => {
                    return (
                        <Route exact 
                        key={route.path} 
                        path={route.path} 
                        component={route.component}
                        />
                    )
                })
            }
        </React.Fragment>
    )
})

export default Routes;