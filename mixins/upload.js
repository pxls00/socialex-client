export default {
  methods: {
    async uploadFiles(file, folderName, files) {
      this.$loader.show()
      const imgItem = files.find((item) => item.file.name === file.name)
      try {
        const ref = this.$fire.storage.ref(
          `/posts${folderName ? `/${folderName}` : ''}`
        )
        const req = await ref.listAll()
        const resultItems = await req.items
        if (!resultItems.find((item) => item.name === file.name)) {
          const refImg = ref.child(file.name)
          const req = refImg.put(file)
          req.on(
            'state_changed',
            (snapshot) => {
              const percentage = (
                (snapshot.bytesTransferred / snapshot.totalBytes) *
                100
              ).toFixed(0)
              imgItem.uploadedPercent = percentage
            },
            (error) => {
              this.handleError(error)
            },
            () => {
              imgItem.uploaded = true
            }
          )
        } else {
          this.$notify({
            message:
              'You are trying to upload already uploaded image' + file.name,
            variant: 'danger',
          })
        }
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$loader.hide()
      }
    },
    uploadProfileFile(file, folderName) {
      try {
        const ref = this.$fire.storage.ref(
          `/profile${folderName ? `/${folderName}` : ''}`
        )
        const refImage = ref.child(file.file.name)
        // const imageLink = await refImage.putString(file.result.split(',')[1], 'base64', {
        //   contentType: file.file.type,
        // })
        return new Promise((resolve, reject) => {
          const imageLink = refImage.putString(
            file.result.split(',')[1],
            'base64',
            {
              contentType: file.file.type,
            }
          )
          resolve(imageLink)
        })
      } catch (error) {
        this.handleError(error)
      }
    },
    async getUploadedProfileFile(folderName) {
      const postImageLinks = []
      try {
          const ref = this.$fire.storage.ref(`/profile/${folderName}`)
          const req = await ref.listAll()
          const resultItems = await  req.items
          resultItems.forEach(async (item) => {
            const urlItem = await item.getDownloadURL()
            postImageLinks.push(await urlItem)
          })

      } catch (error) {
        this.handleError(error)
      } finally {
        setTimeout(() => {
          this.formFields.image = postImageLinks[postImageLinks.length - 1]
        }, 2000)
      }
    },

    async getUploadedPostImages(postName) {
      this.$loader.show()
      const postImageLinks = []
      try {
        const ref = this.$fire.storage.ref(`/posts/${postName}`)
        const req = await ref.listAll()
        const resultItems = await req.items
        resultItems.forEach(async (item) => {
          const urlItem = await item.getDownloadURL()
          postImageLinks.push(await urlItem)
        })
      } catch (error) {
        this.handleError(error)
      } finally {
        this.$loader.hide()
        // eslint-disable-next-line no-unsafe-finally
        return await postImageLinks
      }
    },
  },
}
