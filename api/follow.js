const baseUrl = '/follow'

export default (axios) => ({
  /**
   * Follow user
   *
   * @param {Object} requestData
   *
   * @param {Object} urlData
   * @param {Object} urlData.id
   *
   * @returns {Promise}
   */
  followUser(requestData = {}, urlData = {}) {
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
   * Un follow user
   *
   * @param {Object} requestData
   *
   * @param {Object} urlData
   * @param {Object} urlData.id
   *
   * @returns {Promise}
   */
  unFollowUser(requestData = {}, urlData = {}) {
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
