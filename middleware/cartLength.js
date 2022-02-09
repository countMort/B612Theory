export default function ({store, redirect}) {
    if (store.getters.getCartLength == 0) {
        redirect ('/cart')
    }
}