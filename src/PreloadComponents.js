import React from "react";
import { routes } from "./Routes";

const PreloadComponents = () => {
    const [ actPreload, setActPreload ] = React.useState(true);
    React.useEffect(() => {
        const t = setTimeout(() => {
            setActPreload(false);
        }, 500);
        return () => {
            clearTimeout(t);
        }
    });
    if(actPreload) {
        return (
            <React.Fragment>
                {
                    routes.map(route => {
                        return (
                            <route.component preload key={route.path} />
                        )
                    })
                }
            </React.Fragment>
        )
    }
}

export default React.memo(PreloadComponents);