export default function ({ $axios, redirect, $toast, $auth }) {
    try {
        $axios.setToken(localStorage.getItem("TOKEN_KEY"));
        $axios.onRequest(config => {
        // console.log('Making request to ' + config.url)
        })
        $axios.onError(async error => {
            const code = parseInt(error.response && error.response.status)
            // if (code === 500) {
                $toast.error(error.response && error.response.data.message)
            // }
            if (code === 401) {
                if ($auth.loggedIn) {
                    await $auth.logout()
                    await $auth.fetchUser()
                }
                redirect('/login')
            }
        })
    } catch (error) {
        console.log(error);
        $toast.error(error)
    }
}