const baseUrl = '/settings'

export default (axios) => ({
  /**
   * Get settings
   *
   * @param {Object} requestData
   *
   * @param {Object} urlData
   *
   * @returns {Promise}
   */
  getUsersSettings(requestData = {}, urlData = {}) {
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
   * Update settings
   *
   * @param {Object} requestData
   * @param {Object} requestData.name
   * @param {Object} requestData.username
   * @param {Object} requestData.email
   * @param {Object} requestData.bio
   * @param {Object} requestData.image
   *
   * @param {Object} urlData
   *
   * @returns {Promise}
   */
  updateUsersSettings(requestData = {}, urlData = {}) {
    const requestConfig = {
      method: 'patch',
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
})
