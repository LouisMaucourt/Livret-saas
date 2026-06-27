export function getCookieServer(req: Request, name: string): string | undefined {
    return req.headers
        .get("cookie")
        ?.split(";")
        .find((c) => c.trim().startsWith(`${name}=`))
        ?.split("=")[1];
}

export const getCookie = (name: string): string | undefined => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : undefined;
}
export function addCookie(name:string, id: string) { 
    document.cookie = `${name}=${id} ; path=/`
}