export interface User {
    id: number;
    avatarUrl?: string
    fullName: string;
    role: string;
    latestMessage?: string;
}

export async function getUsers(): Promise<User[]> {
    const response = await fetch('http://localhost:7050/users');
    const data = await response.json();
    return data.filter((user: any) => user.role === 'CUSTOMER') // Only include users with the role "CUSTOMER"
        .map((user: any) => ({
            id: user.id,
            avatarUrl: user.avatarUrl ?? 'https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-479x512-n8sg74wg.png', // Replace with the path to your default avatar
            fullName: user.fullName,
            role: user.role,
        }));
}
