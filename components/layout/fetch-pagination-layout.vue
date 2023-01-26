<template>
  <div>
    <div class="search-form d-flex align-items-center justify-content-between mb-2">
      <FormSearh
        ref="formSearch"
        :search-val="searchVal"
        @submit="searchItems"
      />
      <b-pagination
        v-if="showPagination"
        v-model="page"
        :total-rows="count"
        :per-page="pageSize"
        first-number
        last-number
        class="ml-3"
        @change="changePage"
      >
        <template #prev-text>
          <div>
            <b-icon icon="arrow-left-square-fill" />
          </div>
        </template>
        <template #next-text>
          <div>
            <b-icon icon="arrow-right-square-fill" />
          </div>
        </template>
      </b-pagination>
    </div>
    <div class="my-2">
      <slot name="filter" />
    </div>
    <slot :items="items" />
  </div>
</template>

<script>
import FormSearh from '@/components/form/search.vue'
export default {
  name: 'FetchPaginationLayout',
  components: {
    FormSearh,
  },
  props: {
    getItems: {
      type: Function,
      default: () => [],
    },
  },
  data() {
    return {
      pageSize: 10,
      page: 1,
      items: [],
      count: 0,
      searchVal: '',
      next: true,
      getItemsFunc: this.getItems
    }
  },
  async fetch() {
    this.$route.query.page = 1
    this.$route.query.search = ''
    await this.fetchItems()
  },
  computed: {
    showPagination() {
      return this.count - this.pageSize > 0 || this.next || this.page > 1
    },
  },
  created() {
    this.$route.query.page = 1
    this.$route.query.search = ''
  },
  methods: {
    changePage(page) {
      this.$route.query.page = page
      this.$refs.formSearch.val = this.searchVal
      this.fetchItems()
    },
    async fetchItems() {
      try {
        this.$loader.show()
        const page = this.$route.query.page
        const search = this.$route.query.search
        const requestData = {
          params: {
            skip: this.pageSize * (page - 1),
            limit: this.pageSize,
          },
        }
        if (search) {
          requestData.params.search = search
        }
        const response = await this.getItemsFunc(requestData)
        this.items = await response.data
        this.count = await response.count
        this.next = await response.next
        this.page = page
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$loader.hide()
      }
    },
    async searchItems(val) {
      this.searchVal = val
      this.$route.query.search = this.searchVal
      this.$route.query.page = 1
      await this.fetchItems()
    },
  },
}
</script>
