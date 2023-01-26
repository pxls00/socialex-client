const baseUrl = '/posts'
export default (axios) => ({
  /**
   * Fetch posts list
   *
   * @param {Object} requestData
   * @param {Object} requestData.params
   * @param {Object} requestData.params.skip
   * @param {Object} requestData.params.limit
   * @param {Object} requestData.params.user
   * @param {Object} requestData.params.search
   *
   * @param {Object} urlData
   *
   * @returns {Promise}
   */
  getPostsList(requestData = {}, urlData = {}) {
    const requestConfig = {
      method: 'get',
      url: `${baseUrl}/`,
      ...requestData,
    }

    return new Promise((resolve, reject) => {
      axios(requestConfig)
        .then((data) => {
          resolve(data.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  /**
   * Get Post by Id
   *
   * @param {Object} requestData
   *
   * @param {Object} urlData
   * @param {Object} urlData.id
   *
   * @returns {Promise}
   */
  getPostItem(requestData = {}, urlData = {}) {
    const requestConfig = {
      method: 'get',
      url: `${baseUrl}/${urlData.id}`,
      ...requestData,
    }

    return new Promise((resolve, reject) => {
      axios(requestConfig)
        .then((data) => {
          resolve(data.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  /**
   * Create post item
   *
   * @param {Object} requestData
   * @param {Object} requestData.data
   * @param {Object} requestData.data.title
   * @param {Object} requestData.data.description
   * @param {Array} requestData.data.images
   *
   * @param {Object} urlData
   *
   * @returns {Promise}
   */
  craetePostsItem(requestData = {}, urlData = {}) {
    const requestConfig = {
      method: 'post',
      url: `${baseUrl}/`,
      ...requestData,
    }

    return new Promise((resolve, reject) => {
      axios(requestConfig)
        .then((data) => {
          resolve(data.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  /**
   * Edit post item
   *
   * @param {Object} requestData
   * @param {Object} requestData.data
   * @param {Object} requestData.data.title
   * @param {Object} requestData.data.description
   *
   * @param {Object} urlData
   * @param {Object} urlData.id
   *
   * @returns {Promise}
   */
  editPostsItem(requestData = {}, urlData = {}) {
    const requestConfig = {
      method: 'patch',
      url: `${baseUrl}/${urlData.id}`,
      ...requestData,
    }

    return new Promise((resolve, reject) => {
      axios(requestConfig)
        .then((data) => {
          resolve(data.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  /**
   * Delete post item
   *
   * @param {Object} requestData
   *
   * @param {Object} urlData
   * @param {Object} urlData.id
   *
   * @returns {Promise}
   */
  deletePostsItem(requestData = {}, urlData = {}) {
    const requestConfig = {
      method: 'delete',
      url: `${baseUrl}/${urlData.id}`,
      ...requestData,
    }

    return new Promise((resolve, reject) => {
      axios(requestConfig)
        .then((data) => {
          resolve(data.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
})
