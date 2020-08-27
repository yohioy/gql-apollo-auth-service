declare const _default: {
    server: {
        host: string | undefined;
        port: string | undefined;
    };
    register: {
        plugins: {
            plugin: string;
            options: {
                apiAuthKey: string | undefined;
                cognitoUserPoolId: string | undefined;
                cognitoClientId: string | undefined;
                dbRegion: string | undefined;
                dbEndpoint: string | undefined;
            };
        }[];
    };
};
export default _default;
