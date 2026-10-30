export const withViewTransition = (update: () => void) => {
	if (!document.startViewTransition) {
		update();
		return;
	}
	const transition = document.startViewTransition(update);
	transition.ready.catch(() => {});
	transition.finished.catch(() => {});
};