export const request = (config = {}) =>
  new Promise((resolve, reject) => {
    uni.request({
      ...config,
      success: (response) => {
        const { data } = response
        resolve({
          ...data,
          success: response?.data?.code === 1,
          response,
          error: null,
        })
      },
      fail: (error) => {
        resolve({
          success: false,
          response: null,
          error,
        })
      },
    })
  })

export const get = (url, data, config = {}) =>
  request({
    ...config,
    url,
    data,
    method: 'GET',
  })

export const post = (url, data, config = {}) =>
  request({
    ...config,
    url,
    data,
    method: 'POST',
  })

request.get = get
request.post = post

function obj2formdata(obj) {
  return Object.entries(obj).reduce((formData, [key, value]) => {
    formData.set(key, value)

    return formData
  }, new FormData())
}

uni.addInterceptor('request', {
  invoke(args) {
    args.header = args.header ?? {
      'content-type': 'application/x-www-form-urlencoded',
    }

    args.data = args.data ?? {}
    // if (args.header?.['content-type'] === 'multipart/form-data') {
    //   args.requestType = 'form'
    //   // args.data = obj2formdata(args.data)
    // }

    // console.log(args)

    args.header['token'] = uni.getStorageSync('token')
  },
  // success(args) {
  //   // 请求成功后，修改code值为1
  //   args.data.code = 1
  // },
  // fail(err) {
  //   console.log('interceptor-fail',err)
  // },
  complete(res) {
    // console.log('interceptor-complete', res)
    if (res?.statusCode === 401) {
      uni.reLaunch({
        url: '/pages/auth/login-type',
      })
    }
  },
})

export default request
