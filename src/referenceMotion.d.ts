export function mountTyping(canvas: HTMLCanvasElement): Promise<() => void>;
export function mountWand(canvas: HTMLCanvasElement, getProgress: () => number): Promise<() => void>;
