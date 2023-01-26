import Auth from '@/api/auth'
import Users from '@/api/users'
import Posts from '@/api/posts'
import Settings from '@/api/settings'
import PostLike from '@/api/post-like'
import PostSave from '@/api/post-save'
import PostComment from '@/api/post-comment'
import PostReply from '@/api/post-reply'
import Follow from '@/api/follow'

export default ({ $axios }, inject) => {
  const api = {
    auth: Auth($axios),
    users: Users($axios),
    settings: Settings($axios),
    posts: Posts($axios),
    postLike: PostLike($axios),
    postSave: PostSave($axios),
    follow: Follow($axios),
    postComment: PostComment($axios),
    postReply: PostReply($axios)
  }

  // Inject $api
  inject('api', api)
}
