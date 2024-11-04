declare module 'next' {
    interface NextApiRequest {
        user?: { username: string };
    }
}