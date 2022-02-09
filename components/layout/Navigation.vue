<template>
    <v-navigation-drawer
        v-model="drawer"
        fixed
        app
        clipped
        right
        :mobile-breakpoint="1100"
        class="mini_scroll_bar"
        >
        <client-only>
            <v-divider class="pt-sm-0 mt-sm-3 mt-12"></v-divider>
            <v-list rounded dense nav>
                <v-list-item
                v-if="!$auth.loggedIn"
                to="/Login"
                link>
                    <v-list-item-title>ورود/عضویت</v-list-item-title>
                    <v-list-item-icon>
                        <v-icon>mdi-account</v-icon>
                    </v-list-item-icon>
                </v-list-item>
                <template v-for="(menu) in menuGeneretor">
                    <v-list-group
                    v-if="menu.menus && (!menu.auth || ($auth.user && menu.auth.indexOf($auth.user.role) > -1))"
                    :key="menu.text"
                    :value="false"
                    :prepend-icon="menu.icon"
                    >
                        <template v-slot:activator>
                            <v-list-item-content>
                                <v-list-item-title>{{menu.text}}</v-list-item-title>
                            </v-list-item-content>
                        </template>
                        <template v-for="(submenu) in menu.menus">
                            <v-list-item
                                v-if="!submenu.auth || ($auth.user && submenu.auth.indexOf($auth.user.role) > -1)"
                                :key="submenu.text"
                                :link="!!submenu.to"
                                :to="submenu.to"
                                @click="!submenu.to && submenu.func()"
                            >
                                <v-list-item-title v-text="submenu.text"></v-list-item-title>
                                <v-list-item-icon>
                                    <v-icon v-text="submenu.icon"></v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                        </template>
                    </v-list-group>
                    <v-list-item
                    v-else-if="!menu.auth || ($auth.user && menu.auth.indexOf($auth.user.role) > -1)"
                    :to="menu.to"
                    :link="!!menu.to"
                    @click="!menu.to && menu.func()"
                    :key="menu.text">
                        <v-list-item-title v-text="menu.text"></v-list-item-title>
                        <v-list-item-icon>
                            <v-icon v-text="menu.icon"></v-icon>
                        </v-list-item-icon>
                    </v-list-item>
                </template>
            </v-list>
            <v-divider></v-divider>
        </client-only>
    </v-navigation-drawer>
</template>

<script>
    export default {
        props: {
            value: {
                type: Boolean,
                default: false
            },
        },
        computed: {
            drawer: {
                get () {
                    return this.value
                },
                set (val) {
                    this.$emit('input', val)
                }
            },
            menuGeneretor(context) {
                return [
                    {
                        text: "سبد خرید",
                        icon: "mdi-cart-outline",
                        auth: false,
                        to: "/cart"
                    },
                    {
                        text: (context.$auth.user && context.$auth.user.address) ? `ارسال به: ${context.$auth.user.address.firstName}` : 'به کجا ارسال شود',
                        icon: 'mdi-truck-delivery-outline',
                        auth: ['user', 'admin'],
                        to: '/Address'
                    },
                    {
                        text: "پروفایل",
                        icon: "mdi-account-cog",
                        auth: ['user', 'admin'],
                        to: "/Profile"
                    },
                    {
                        text: "سفارشات من",
                        icon: "mdi-newspaper-variant",
                        auth: ['user', 'admin'],
                        to: "/orders"
                    },
                    {
                        text: 'نحوه ثبت سفارش',
                        icon: "mdi-help-circle-outline",
                        auth: false,
                        to: '/HowToSubmit'
                    },
                    {
                        text: 'بخش ادمین',
                        // icon: 'mdi-account-plus',
                        auth: ['admin'],
                        menus: [
                            {
                                text: 'سفارشات',
                                icon: 'mdi-format-list-checks',
                                to: '/admin/orders?status=pending'
                            },
                            {
                                icon: 'mdi-poll',
                                text: "آمار",
                                to: "/admin/stats"
                            },
                            {
                                icon: 'mdi-cart-variant',
                                text: "مدیریت محصولات",
                                to: "/admin/products"
                            },
                            {
                                icon: 'mdi-feature',
                                text: "مدیریت فیچر ها",
                                to: "/admin/features"
                            },
                            {
                                icon: 'mdi-shape-outline',
                                text: "مدیریت دسته‌بندی ها",
                                to: "/admin/categories"
                            },
                            {
                                icon: 'mdi-view-dashboard-variant-outline',
                                text: "UI BABY",
                                to: "/admin/ui"
                            },
                            {
                                icon: 'mdi-spa-outline',
                                text: "دیجی",
                                to: "/admin/voicecard"
                            },
                        ]
                    },
                    {
                        text: "خروج",
                        icon: "mdi-door-closed",
                        auth: ['user', 'admin'],
                        func: () => this.$auth.logout()
                    },
                ]
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>