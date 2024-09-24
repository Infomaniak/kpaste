export type User = {
    id: string;
    firstname: string;
    lastname: string;
    avatar: string;
    length: number;
    email: string;
    display_name: string;
 }

export type Session = {
    user: User;
    current_group: {
        id: string;
    };
}