const baseUrl = '/auth'
export default (axios) => ({
  /**
   * Register User
   *
   * @param {Object} requestData
   * @param {Object} requestData.data
   * @param {String} requestData.data.password
   * @param {String} requestData.data.email
   * @param {String} requestData.data.name
   *
   * @param {Object} urlData
   *
   * @returns {Promise}
   */
  register(requestData = {}, urlData = {}) {
    const requestConfig = {
      method: 'post',
      url: `${baseUrl}/register`,
      ...requestData,
    }

    return new Promise((resolve, reject) => {
      axios(requestConfig)
        .then((data) => {
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
})
