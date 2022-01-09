/*
 * @Descripttion:
 * @version:
 * @Author: 小白
 * @Date: 2021-06-25 13:42:48
 * @LastEditors: 小白
 * @LastEditTime: 2021-06-25 14:09:20
 */

import { BASE } from '@/services'

export const upLoadImage = () =>
  new Promise((resolve, reject) => {
    uni.chooseImage({
      count: 1,
      success: (chooseImageRes) => {
        uni.showLoading({
          title: '上传中',
        })
        const tempFilePaths = chooseImageRes.tempFilePaths
        uni.uploadFile({
          url: `${BASE}/api/common/upload`, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          header: {
            token: uni.getStorageSync('token'),
          },
          name: 'file',
          success: (uploadFileRes) => {
            const data = JSON.parse(uploadFileRes.data)
            if (data.code == 1) {
              resolve(data.data.fullurl)
            } else {
              reject(data.msg)
            }
            uni.hideLoading()
          },
          error: (e) => {
            resolve(e)
            uni.hideLoading()
            uni.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
        })
      },
      error: (e) => {
        resolve(e)
      },
    })
  })

export const realToast = (title = '', fun) => {
  uni.showToast({
    title,
    duration: 1500,
    mask: true,
  })
  const timouter = setTimeout(() => {
    clearTimeout(timouter)
    fun()
  }, 1500)
}
