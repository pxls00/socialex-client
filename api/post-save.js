const baseUrl = '/saved-posts'
export default (axios) => ({
  /**
   * Get saved post
   *
   * @param {Object} requestData
   *
   * @param {Object} urlData
   *
   * @returns {Promise}
   */
  getSavedPosts(requestData = {}, urlData = {}) {
    const requestConfig = {
      method: 'get',
      url: `${baseUrl}`,
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
   * Save post
   *
   * @param {Object} requestData
   *
   * @param {Object} urlData
   * @param {Object} urlData.id
   *
   * @returns {Promise}
   */
  savePost(requestData = {}, urlData = {}) {
    const requestConfig = {
      method: 'post',
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
   * Remove saved post
   *
   * @param {Object} requestData
   *
   * @param {Object} urlData
   * @param {Object} urlData.id
   *
   * @returns {Promise}
   */
  removeSavedPost(requestData = {}, urlData = {}) {
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
  },
})
