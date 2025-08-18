export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const url = (p: string) => (BASE_PATH ? `${BASE_PATH}${p}` : p);