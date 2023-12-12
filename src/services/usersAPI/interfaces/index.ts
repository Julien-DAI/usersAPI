interface Player {
    id: number;
    name: string;
    role: 'player';
    badges: number;
    password: string;
}

interface Reporter {
    id: number;
    name: string;
    role: 'reporter';
    password: string;

}

interface Admin {
    id: number;
    name: string;
    role: 'admin';
    password: string;

}

export type UserRole = 'player' | 'reporter' | 'admin';

export interface IUser {
    id: number;
    name: string;
    role: UserRole;
    badges?: number; // Badges are optional for non-players

}

export type ExtendedUser = Player | Reporter | Admin;