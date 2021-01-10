import React from 'react';

export const useLocation = () => {
    const [location, setLocation] = React.useState<string>('');

    React.useEffect(() => {
        window.addEventListener("hashchange", () => {
            console.log(location.hash);
        }, false);
    }, []);

    return location;
};

export const Link = ({
                         to,
                         children,
                         ...props
                     }: {
    to: string,
    children?: any,
    [key: string]: any
}) => <a href={`#${to}`} {...props}>{children}</a>;