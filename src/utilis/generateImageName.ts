export function generateImageName(extension?: string): string {
    const uuid = crypto.randomUUID();
    const ext = extension ?? 'jpg';
    return `${uuid}.${ext}`;
}

export function getFileExtension(file: File): string {
    return file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
}
