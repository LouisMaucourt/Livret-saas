
export const infosApi = async (id: string | undefined, lang = 'fr'  ) => {
    const res = await fetch(`/api/infos?id=${id}&lang=${lang}`)
    return res.json()
}
export const userApi = async () => {
    const res = await fetch("/api/users")
    return res.json()
}
export const wifiApi = async (id: string | undefined) => {
    const res = await fetch(`/api/wifi?id=${id}`)
    return res.json()
}
export const stayDetailsApi = async (id: string | undefined) => {
    const res = await fetch(`/api/staydetails?id=${id}`)
    return res.json()
}
export const getRulesApi = async (id: string | undefined) => {
    const res = await fetch(`/api/rules?id=${id}`)
    return res.json()
}
export const getContactApi = async (id: string | undefined) => {
    const res = await fetch(`/api/contact?id=${id}`)
    return res.json()
}
export const getPlacesApi = async (id: string | undefined) => {
    const res = await fetch(`/api/places?id=${id}`)
    return res.json()
}
export const getSectionApi = async (id: string | undefined) => {
    const res = await fetch(`/api/sections?id=${id}`)
    return res.json()
}
export const checkinAllApi = async () => {
    const res = await fetch(`/api/checkinAll`)
    return res.json()
}
export const propertiesApi = async () => {
    const res = await fetch("/api/properties")
    return res.json()
}
export const BookletsApi = async (id: string | undefined) => {
    const res = await fetch(`/api/booklets?id=${id}`)
    return res.json()
}
export const BookletApi = async (id: string | undefined) => {
    const res = await fetch(`/api/booklet?id=${id}`)
    return res.json()
}
export const QrCodeApi = async (id: string | undefined) => {
    const res = await fetch(`/api/qrcode?id=${id}`)
    return res.json()
}
export const getClientsApi = async (id: string | undefined) => {
    const res = await fetch(`/api/clients?id=${id}`)
    return res.json()
}