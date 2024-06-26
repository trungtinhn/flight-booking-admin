import Avatar from '../assets';

export interface User {
    id: number;
    avatarUrl: string | null;
    fullName: string;
}

export async function getUsers(): Promise<User[]> {
    const response = await fetch('http://localhost:7050/users');
    const data = await response.json();
    return data.map((user: any) => ({
        id: user.id,
        avatarUrl: user.avatarUrl || '', // Replace with the path to your default avatar
        fullName: user.fullName,
    }));
}
