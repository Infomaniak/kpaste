export type ResponseData = {
    burn: boolean;
    expiratedAt: Date | null;
    destroy: boolean;
    message: string;
    vector: string;
    key: string;
    password: boolean;
    salt: string;
};

export type PasteData = {
    pasteId: string;
    key: string;
    destroy: boolean;
    period: string;
    message: string;
    enablePassword: boolean;
    password: string;
    showPassword: boolean;
};