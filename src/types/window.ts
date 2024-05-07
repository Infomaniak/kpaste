export {};

declare global {
    interface Window { 
        WEB_COMPONENT_API_ENDPOINT: URL;
        CONST_LANG: string;
        location: Location;
     }
}