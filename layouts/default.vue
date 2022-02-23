<template>
  <v-app class="mini_scroll_bar">
    <navigation-drawer v-model="drawer" />
    <v-app-bar :clipped-right="true" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title
        class="pr-0"
        :class="$vuetify.breakpoint.xsOnly ? 'subtitle-1' : ''"
      >
        <nuxt-link to="/">
          <v-avatar :size="$vuetify.breakpoint.xsOnly ? 40 : 60">
            <v-img src="/logo-insta.png" />
          </v-avatar>
          {{ title }}
        </nuxt-link>
      </v-toolbar-title>
      <!-- <template #extension>
        <client-only>
          <template v-for="menu in menus">
            <v-menu :key="menu.text" v-if="menu.menus && (!menu.auth || ($auth.user && menu.auth.indexOf($auth.user.role) > -1))" bottom>
              <template #activator="{attrs, on}">
                <v-btn
                text
                :x-small="$vuetify.breakpoint.xsOnly"
                v-on="on" v-bind="attrs"
                tile
                class="mt-2">
                  <v-icon color="black">
                    {{menu.icon}}
                  </v-icon>
                  &nbsp;{{menu.text}}
                  <v-icon>
                    mdi-chevron-down
                  </v-icon>
                </v-btn>
              </template>
              <v-card class="d-flex" style="flex-direction: column;">
                <v-btn class="px-2" :class="$vuetify.breakpoint.xsOnly && 'caption'" v-for="menuItem in menu.menus" :key="menuItem.text" tile :large="!$vuetify.breakpoint.xsOnly" nuxt :to="menuItem.to">
                  {{menuItem.text}}
                  <v-spacer></v-spacer>
                  <v-icon>
                    {{menuItem.icon}}
                  </v-icon>
                </v-btn>
              </v-card>
            </v-menu>
            <v-btn text :key="menu.text" tile v-else-if="!menu.auth || ($auth.user && menu.auth.indexOf($auth.user.role) > -1)" :x-small="$vuetify.breakpoint.xsOnly" nuxt :to="menu.to" class="mt-2">
              <v-icon>{{menu.icon}}</v-icon>
              &nbsp;{{menu.text}}
            </v-btn>
          </template>
          <v-btn v-if="!$auth.loggedIn" :class="$vuetify.breakpoint.xsOnly ? 'caption' : ''" class="pr-0 pl-1 mt-2" text nuxt to="/Login" :x-small="$vuetify.breakpoint.xsOnly">
            <v-icon :small="$vuetify.breakpoint.xsOnly">
              mdi-account
            </v-icon>
            ورود/عضویت
          </v-btn>
        </client-only>
      </template> -->
      <v-spacer />
      <v-tooltip bottom>
        <template #activator="{ attrs, on }">
          <v-btn
            icon
            to="/cart"
            :small="$vuetify.breakpoint.xsOnly"
            :class="getCartLength > 0 && 'buzz'"
            class="mx-auto"
            v-bind="attrs"
            v-on="on"
          >
            <v-badge overlap :badge="getCartLength" left>
              <template #badge>
                {{ getCartLength | number }}
              </template>
              <v-icon
                :small="$vuetify.breakpoint.xsOnly"
              >
                mdi-cart-outline
              </v-icon>
            </v-badge>
          </v-btn>
        </template>
        <span> سبد خرید </span>
      </v-tooltip>
    </v-app-bar>
    <v-main>
      <nuxt />
      <v-snackbar
        v-model="snackbar_show"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
        :top="snackbar.top"
        :bottom="snackbar.bottom"
        :left="snackbar.left"
        :right="snackbar.right"
        :multi-line="snackbar.multiLine"
        :vertical="snackbar.vertical"
      >
        <v-btn block text class="ma-0">
          <v-icon left>
            {{ snackbar.icon }}
          </v-icon>
          <span v-text="snackbar.text" />
        </v-btn>
      </v-snackbar>
    </v-main>
    <v-footer app absolute inset class="mt-2">
      <v-row class="mx-0 align-center my-0">
        <span>B612&nbsp;&copy; {{ new Date().getFullYear() }}</span>
        <v-spacer />
        <a
          :title="title"
          target="_blank"
          href="https://www.instagram.com/b612theory/"
        >
          <address :class="$vuetify.breakpoint.smAndDown ? 'caption' : ''">
            <v-avatar :size="$vuetify.breakpoint.smAndDown ? '30' : '40'">
              <v-img src="/logo-insta.png" />
            </v-avatar>
            ارتباط با ما در اینستاگرام تئوری B612
          </address>
        </a>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import { EventBus } from '@/utils/event-bus'
import NavigationDrawer from '@/components/layout/Navigation.vue'

let interval
// import routeGenerator from '@/routes'
// import menuGeneretor from '@/menus'
export default {
  name: 'Layout',
  components: {
    NavigationDrawer
  },
  data () {
    return {
      drawer: false,
      snackbar: {
        text: '',
        bottom: true,
        top: false,
        right: true,
        left: false,
        icon: '',
        timeout: 5000,
        miltiLine: false,
        vertical: false
      },
      snackbar_show: false,
      routes: [],
      title: 'تئوری‌بی‌ششصدودوازده'
    }
  },
  computed: {
    ...mapGetters(['getCartLength', 'getCart'])
  },
  watch: {
    '$auth.user': {
      immediate: true,
      deep: true,
      handler (nv) {
        // this.routes = routeGenerator(nv && nv.role)
        this.menus = this.menuGeneretor({ $auth: this.$auth })
      }
    }
  },
  mounted () {
    this.setupTimer()
    EventBus.$on('setSnack', (data) => {
      if (typeof data === 'string') {
        this.snackbar.text = data
      } else {
        this.snackbar.text = data.text
        this.snackbar.color = data.color
        this.snackbar.multiLine = data.multiLine
        this.snackbar.vertical = data.vertical
        if (data.color == 'red') {
          this.snackbar.icon = 'mdi-alert'
        } else if (data.color == 'green' || data.color == 'success') {
          this.snackbar.icon = 'mdi-check'
        }
      }
      this.snackbar_show = true
    })
    EventBus.$on('openNav', () => {
      this.drawer = true
    })
    // this.menuGeneretor()
    // this.routes = routeGenerator(this.$auth.user && this.$auth.user.role)
  },
  methods: {
    setupTimer () {
      clearInterval(interval)
      let time
      interval = setInterval(() => {
        time = this.$store.getters.getTimer
        this.$store.getters.getTimer >= 1000 &&
          this.$store.commit('SET_TIMER', time - 1000)
      }, 1000)
      if (this.$store.getters.getTimer >= 1000) {
        this.panel = 0
      }
    },
    menuGeneretor (context) {
      return [
        {
          text: 'محصولات سفارشی',
          icon: 'mdi-pallete',
          auth: false,
          menus: [
            {
              text: 'کارت صدا',
              icon: 'mdi-image',
              to: '/products/VoiceCard/60a80142d6a7bbb590a2fc98'
            },
            {
              text: 'کتاب خاطره',
              icon: 'mdi-book-open-page-variant',
              to: '/products/DiaryBook/60a801f5d6a7bbb590a2fc9d'
            },
            {
              text: 'پولاروید',
              icon: 'mdi-polaroid',
              to: '/products/Polaroid/60a7ff3cd6a7bbb590a2fc94'
            }
          ]
        },
        {
          text:
            context.$auth.user && context.$auth.user.address
              ? context.$auth.user.address.firstName
              : 'به کجا ارسال شود',
          icon: 'mdi-truck-delivery-outline',
          auth: ['user', 'admin'],
          to: '/Address'
        }
      ]
    }
  }
}
</script>
