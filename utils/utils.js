export const delay = async (time) => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, time);
	});
}
