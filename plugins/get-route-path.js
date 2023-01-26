import { getRoutePath } from '~/routes/getRoutePath'

export default function (ctx, inject) {
  inject('getRoutePath', getRoutePath)
}
