interface Player {
    id: number;
    name: string;
    role: 'player';
    badges: number;
    password: string;
    balance: number;
    creatures: string;
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

export type ExtendedUser = Player | Reporter | Admin;