const baseUrl = '/users'
export default (axios) => ({
  /**
   * Fetch users list
   *
   * @param {Object} requestData
   * @param {Object} requestData.params
   * @param {Object} requestData.params.search
   * @param {Object} requestData.params.limit
   * @param {Object} requestData.params.skip
   *
   * @param {Object} urlData
   *
   * @returns {Promise}
   */
  getUsersList(requestData = {}, urlData = {}) {
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
   * Get user by Id
   *
   * @param {Object} requestData
   *
   * @param {Object} urlData
   * @param {Object} urlData.id
   *
   * @returns {Promise}
   */
  getUserById(requestData = {}, urlData = {}) {
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
})
