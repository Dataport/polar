declare const _default: import("vue").DefineComponent<{
    /**
     * Defines when the current session expires (UNIX timestamp in seconds)
     */
    expirationTime: {
        type: NumberConstructor;
        required: true;
    };
    /**
     * Defines how many minutes before the logout the alert should be visible
     * @default 3
     */
    threshold: {
        type: NumberConstructor;
        default: number;
        required: false;
    };
}, any, {
    interval: null;
    minutesToLogout: null;
}, {
    showLogoutAlert(): boolean;
}, {
    startInterval(): void;
    setMinutesToLogout(): void;
    handleClick(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "click"[], "click", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Defines when the current session expires (UNIX timestamp in seconds)
     */
    expirationTime: {
        type: NumberConstructor;
        required: true;
    };
    /**
     * Defines how many minutes before the logout the alert should be visible
     * @default 3
     */
    threshold: {
        type: NumberConstructor;
        default: number;
        required: false;
    };
}>> & {
    onClick?: ((...args: any[]) => any) | undefined;
}, {
    threshold: number;
}, {}>;
export default _default;
