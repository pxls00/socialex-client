export default {
  register: '/register',
  login: '/login',
  logOut: '/logout',
  home: '/',
  search: '/search',
  profile: '/profile',
  settings: '/settings',
  messanger: '/messanger',
  createPost: `/create`,
  editPost: (id) => `/edit/${id}`,
  user: (id) => `/user/${id}`,
  post: (id) => `/post/${id}`
}
