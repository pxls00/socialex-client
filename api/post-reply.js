const baseUrl = '/reply-comment'

export default (axios) => ({
  /**
   * Add post reply
   *
   * @param {Object} requestData
   * @param {Object} requestData.body
   *
   * @param {Object} urlData
   * @param {Object} urlData.postId
   * @param {Object} urlData.replyId
   *
   * @returns {Promise}
   */
  addPostReply(requestData = {}, urlData = {}) {
    const requestConfig = {
      method: 'post',
      url: `${baseUrl}/${urlData.postId}/${urlData.replyId}`,
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
   * Edit post reply
   *
   * @param {Object} requestData
   * @param {Object} requestData.body
   *
   * @param {Object} urlData
   * @param {Object} urlData.postId
   * @param {Object} urlData.replyId
   *
   * @returns {Promise}
   */
  editPostReply(requestData = {}, urlData = {}) {
    const requestConfig = {
      method: 'patch',
      url: `${baseUrl}/${urlData.postId}/${urlData.replyId}`,
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
   * Delete post comment
   *
   * @param {Object} requestData
   *
   * @param {Object} urlData
   * @param {Object} urlData.postId
   * @param {Object} urlData.replyId
   *
   * @returns {Promise}
   */
  deletePostReply(requestData = {}, urlData = {}) {
    const requestConfig = {
      method: 'delete',
      url: `${baseUrl}/${urlData.postId}/${urlData.replyId}`,
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
