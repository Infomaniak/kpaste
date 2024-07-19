export type User = {
    id: string;
    firstname: string;
    lastname: string;
    avatar: string;
    length: number;
 }
  
export type Session = {
    user: User;
    current_group: {
        id: string;
    };
}