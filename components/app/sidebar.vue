<template>
  <div :class="['sidebar', { 'sidebar--close': closeSidebar }]">
    <button class="sidebar__btn" @click="sidebarTrigger">
      <b-icon icon="arrow-right-circle-fill" />
    </button>
    <div :class="['sidebar__logo', { 'sidebar__logo--close': closeSidebar }]">
      <nuxt-link :to="$getRoutePath('home')">
        <img
          v-if="!closeSidebar"
          src="~/assets/images/socialex_logo.png"
          height="30px"
          alt="Logo"
          class="logo"
        />
        <img
          v-else
          src="~/assets/images/logo_small.png"
          alt="Logo"
          width="45"
          class="logo"
        />
      </nuxt-link>
    </div>
    <b-nav
      vertical
      :class="[{ 'sidebar__list--close': closeSidebar }, 'sidebar__list']"
    >
      <b-nav-item
        v-for="(link, idx) in links"
        :key="idx"
        :class="[
          { 'sidebar__item--active': link.currentPage },
          'sidebar__item',
          { 'sidebar__item--close': closeSidebar },
        ]"
        :to="$getRoutePath(link.href)"
      >
        <span
          :class="[
            { 'sidebar__item-icon--close': closeSidebar },
            'sidebar__item-icon',
          ]"
          ><b-icon
            :icon="
              typeof link.icon === 'object'
                ? link.currentPage
                  ? link.icon?.active
                  : link.icon?.anactive
                : link.icon
            "
        /></span>
        <span
          class="sidebar__item-link"
          :class="{ 'sidebar__item-link--close': closeSidebar }"
          >{{ link.linkName }}</span
        >
      </b-nav-item>
    </b-nav>
    <div class="sidebar__more">
      <b-dropdown
        id="dropdown-dropup"
        :class="[
          { 'sidebar__item--close': closeSidebar },
          'sidebar__dropdown',
          'sidebar__item',
        ]"
        dropup
      >
        <template #button-content>
          <div>
            <span class="sidebar__item-icon"><b-icon icon="list" /></span>
            <span
              class="sidebar__item-link"
              :class="{ 'sidebar__item-link--close': closeSidebar }"
              >More</span
            >
          </div>
        </template>
        <b-dropdown-item
          v-for="(item, idx) in moreLinks"
          :key="idx"
          :to="$getRoutePath(item.href)"
        >
          <span class="sidebar__item-more-link">{{ item.linkName }}</span>
          <span class="sidebar__item-more-icon"
            ><b-icon :icon="item.icon"
          /></span>
        </b-dropdown-item>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarMain',
  props: {
    sidebarClose: {
      type: Boolean,
      sidebarClose: false,
    },
  },
  data() {
    return {
      links: [
        {
          linkName: 'Home',
          href: 'home',
          path: '/',
          icon: {
            active: 'house-door-fill',
            anactive: 'house-door',
          },
        },
        {
          linkName: 'Search',
          href: 'search',
          path: '/search',
          icon: 'search',
        },
        {
          linkName: 'Create',
          href: 'createPost',
          path: '/create',
          icon: {
            active: 'plus-circle-fill',
            anactive: 'plus-circle',
          },
        },
        {
          linkName: 'Profile',
          href: 'profile',
          path: '/profile',
          icon: {
            active: 'person-fill',
            anactive: 'person',
          },
        },
      ],
      moreLinks: [
        {
          linkName: 'Settings',
          href: 'settings',
          icon: 'gear-fill',
        },
        {
          linkName: 'Log out',
          href: 'logOut',
          icon: 'box-arrow-right',
        },
      ],
    }
  },

  computed: {
    closeSidebar() {
      return this.sidebarClose
    },
  },

  watch: {
    '$route.path'(path) {
      this.setCurrentPage(path)
    },
  },

  created() {
    this.setCurrentPage(this.$route.path)
  },

  methods: {
    setCurrentPage(path) {
      this.links.forEach((link) => {
        this.$set(link, 'currentPage', path === this.$getRoutePath(link.href))
        if ('close' in link && link.path === path) {
          this.$emit('open')
        } else if ('close' in link && link.path !== path.replace('/', '')) {
          this.$emit('close')
        }
      })
    },

    sidebarTrigger() {
      if (this.closeSidebar) {
        this.$emit('close')
      } else {
        this.$emit('open')
      }
    },
  },
}
</script>
