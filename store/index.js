export const state = () => ({
    type : "charmi",
    front: {},
    back: {},
    top: {},
    bottom: {},
    cart : [],
    cartLength : 0,
    shippingPrice : 0,
    shippingEstimatedDelivery : "",
    createdTime : "",
    deliverTo : "",
    cartWatched : [],
    timer: 0,
    hash: "",
    redirectTo: ""

})

export const mutations = {
    SET_TYPE(state, type) {
        state.type = type
    },
    SET_FRONT(state, front) {
        state.front = front
    },
    SET_BACK(state, back) {
        state.back = back
    },
    SET_TOP(state, top) {
        state.top = top
    },
    SET_BOTTOM(state, bottom) {
        state.bottom = bottom
    },
    pushProductToCart(state, {product, quantity}) {
        let totalPrice = quantity*product.price
        product.quantity = Number(quantity)
        product.totalPrice = totalPrice
        state.cart.push(product)
    },
    changeProductQty(state, {cartProduct, quantity}) {
        cartProduct.quantity = cartProduct.quantity + Number(quantity)
        let changedTotalPrice = cartProduct.quantity*cartProduct.price
        let indexOfProduct = state.cart.indexOf(cartProduct)
        cartProduct.totalPrice = changedTotalPrice
        state.cart.splice(indexOfProduct, 1, cartProduct)
    },
    incrementCartLength(state) {
        state.cartLength = 0 ;
        if(state.cart.length > 0) {
            state.cart.map(product => {
                state.cartLength += Number(product.quantity)
            })
        }
    },
    REMOVE_PRODUCT(state, product) {
        let indexOfProduct = state.cart.indexOf(product)
        if (indexOfProduct === -1) return
        state.cartLength -= product.quantity
        state.cart.splice(indexOfProduct, 1)
    },
    setShipping(state, {price, estimatedDelivery, createdTime, deliverTo}) {
        state.shippingPrice = price,
        state.shippingEstimatedDelivery = estimatedDelivery
        state.createdTime = createdTime
        state.deliverTo = deliverTo
    },
    clearCart(state) {
        state.cart = [] ;
        state.cartLength = 0 
        state.shippingPrice = 0 
        state.shippingEstimatedDelivery = ""
        state.createdTime = null
        state.deliverTo = null
    },
    cartWatchedPush (state, product) {
        state.cartWatched = state.cartWatched.filter(prod => prod._id !== product._id )
        state.cartWatched.unshift(product)
    },
    SET_TIMER(state, time) {
        state.timer = time
    },
    SET_HASH(state, hash) {
        state.hash = hash
    },
    SET_REDIRECT(state, redirectTo) {
        state.redirectTo = redirectTo
    }
}

export const actions = {
    addProductToCart({state, commit}, {product, quantity}) {
        const cartProduct = state.cart.find(prod => prod._id === product._id)
        if(!cartProduct || cartProduct.custom){
            commit("pushProductToCart", {product, quantity}) ;
        }else {
            commit("changeProductQty", {cartProduct, quantity})
        }
        commit("incrementCartLength")
    },
    async checkCartAvailablity({state, commit, $axios}) {
        try {
            const {result} = $axios.$post('/cart/validation')
        } catch (error) {
            console.log(error);
        }
    }
}

export const getters = {
    getImages (state) {
        const images = {
            front: state.front,
            back: state.back,
            top: state.top,
            bottom: state.bottom
        }
        return images
    },
    getType (state) {
        return state.type
    },
    getCartLength(state) {
        return state.cartLength
    },
    getCart(state) {
        return state.cart
    },
    getCartTotalPrice(state) {
        let total = 0
        state.cart.map(product => {
            total += product.totalPrice
        })
        return total
    },
    getCartTotalPriceWithShipping(state) {
        let total = 0
        state.cart.map(product => {
            total += product.totalPrice
        })
        return total + state.shippingPrice
    },
    getEstimatedDelivery(state) {
        return state.shippingEstimatedDelivery
    },
    // getNavigation(state) {
    //     return state.navigation ;
    // },
    getPopShow(state) {
        return state.popShow
    },
    getCartWatched(state) {
        return state.cartWatched
    },
    getTimer(state) {
        return state.timer
    },
    getHash(state) {
        return state.hash
    }
}