export default async function (callback,vue = {}, loading = 'loading') {
    try {
        vue[loading] = true;
        await callback()
        vue[loading] = false;
    } catch (error) {
        vue.$toast.error(error.message)
        console.log(error);
        vue[loading] = false;
        vue.$axios.$post('/api/logs', {error})
    }
}