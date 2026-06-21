export interface Toast {
	id: number;
	type: 'success' | 'error';
	message: string;
}

let toasts = $state<Toast[]>([]);
let counter = 0;

/** Reactive accessor — read inside a template to subscribe. */
export function getToasts(): Toast[] {
	return toasts;
}

export function pushToast(type: Toast['type'], message: string): void {
	const id = ++counter;
	toasts.push({ id, type, message });
	setTimeout(() => dismissToast(id), 4000);
}

export function dismissToast(id: number): void {
	toasts = toasts.filter((toast) => toast.id !== id);
}
