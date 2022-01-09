/*
 * @Descripttion:
 * @version:
 * @Author: 小白
 * @Date: 2021-06-25 12:05:07
 * @LastEditors: 小白
 * @LastEditTime: 2021-06-25 17:46:00
 */
import request from '@/utils/request'

export const BASE = typeof window === 'undefined' || process.env.NODE_ENV === 'production' ? 'http://v2-zhi-hui.qixiuu.com' : ''
// const BASE = 'https://zhschool.qixiuu.com'
console.log('base===',BASE)
const GET = (api) => request.get.bind(request, `${BASE}${api}`)
const POST = (api) => request.post.bind(request, `${BASE}${api}`)

export default {
  // 示例接口
  测试名称: POST('/api/demo/test/id/{id}/name/{name}'),
  无需登录的接口: GET('/api/demo/test1'),
  需要登录的接口: GET('/api/demo/test2'),
  需要登录且需要验证有相应组的权限: GET('/api/demo/test3'),
  // Token接口
  检测Token是否过期: GET('/api/token/check'),
  刷新Token: GET('/api/token/refresh'),
  // 支付异步通知
  notify: GET('/api/callback/notify'),
  cnotify: GET('/api/callback/cnotify'),
  // 资讯接口
  '获取资讯列表（发现）': GET('/api/news/news_list'),
  获取资讯详情: GET('/api/news/news_detail'),
  关于我们: GET('/api/news/about_us'),
  // 邮箱验证码接口
  发送邮箱验证码: GET('/api/ems/send'),
  // 检测邮箱验证码: GET('/api/ems/check'),
  // 会员接口
  会员中心: GET('/api/user/index'),
  会员登录: GET('/api/user/login'),
  手机验证码登录: GET('/api/user/mobilelogin'),
  设置密码: GET('/api/user/set_pwd'),
  重置密码: GET('/api/user/resetpwd'),
  发送手机验证码: GET('/api/user/login_send'),
  注册会员: GET('/api/user/register'),
  退出登录: GET('/api/user/logout'),
  第三方登录: GET('/api/user/third'),
  绑定手机号: GET('/api/user/bind_mobile'),
  用户设置: GET('/api/user/user_set_up'),
  修改会员个人信息: POST('/api/user/profile'),
  获取会员个人信息: GET('/api/user/profile'),
  收货地址: GET('/api/user/user_address'),
  修改收货地址: POST('/api/user/user_address'),
  修改手机号: GET('/api/user/changemobile'),
  修改密码验证手机号: GET('/api/user/update_pwd_mobile_check'),
  修改密码: GET('/api/user/update_pwd'),
  标签列表: GET('/api/user/label_list'),
  设置用户标签: GET('/api/user/set_user_label'),
  // 证书中心
  我的证书: GET('/api/user_certificate/my_certificate'),
  我的证书详情: GET('/api/user_certificate/my_certificate_detail'),
  未办理证书: GET('/api/user_certificate/not_handled_certificate'),
  证书详情: GET('/api/user_certificate/certificate_detail'),
  证书订单预览: GET('/api/user_certificate/order_preview'),
  确认证书订单: GET('/api/user_certificate/confirm_order'),
  办理中证书列表: GET('/api/user_certificate/handled_certificate_list'),
  办理中证书详情: GET('/api/user_certificate/handled_certificate_detail'),
  // 公共接口
  加载初始化: GET('/api/common/init'),
  上传文件: POST('/api/common/upload'),
  // 培训计划管理
  获取培训计划分类: GET('/api/training_plan/get_training_type_list'),
  获取培训计划列表: GET('/api/training_plan/get_plan_list'),
  获取培训计划详情: GET('/api/training_plan/get_plan_detail'),
  收藏培训计划: GET('/api/training_plan/collection_plan'),
  培训计划收藏列表: GET('/api/training_plan/collection_plan_list'),
  取消收藏培训计划: GET('/api/training_plan/del_collection_plan'),
  // 在线学习
  获取在线学习列表: GET('/api/course_video/get_video_list'),
  学习资料详情: GET('/api/course_video/get_video_detail'),
  // 验证接口
  // 检测邮箱: GET('/api/validate/check_email_available'),
  检测用户名: GET('/api/validate/check_username_available'),
  检测昵称: GET('/api/validate/check_nickname_available'),
  检测手机有效: GET('/api/validate/check_mobile_available'),
  检测手机存在: GET('/api/validate/check_mobile_exist'),
  检测邮箱: GET('/api/validate/check_email_exist'),
  检测手机验证码: GET('/api/validate/check_sms_correct'),
  检测邮箱验证码: GET('/api/validate/check_ems_correct'),
  // 手机短信接口
  // 发送手机验证码: GET('/api/sms/send'),
  // 检测手机验证码: GET('/api/sms/check'),
  // 课程管理接口
  课程管理列表: GET('/api/course_plan/get_user_plan_list'),
  课程管理详情: GET('/api/course_plan/get_user_plan_detail'),
  获取课程表: GET('/api/course_plan/get_course_plan_list'),
  教材列表: GET('/api/course_plan/get_textbooks_list'),
  获取教材详细信息: GET('/api/course_plan/get_textbooks_detail'),
  // 订单相关操作
  订单预览: POST('/api/Order/preview'),
  提交订单: POST('/api/Order/orderSubmit'),
  订单列表: POST('/api/Order/orderList'),
  订单详情: POST('/api/Order/orederDetail'),
  订单取消: POST('/api/Order/cancelOrder'),
  订单再次支付: POST('/api/Order/awaitPay'),
  订单退款原因: POST('/api/Order/refundReason'),
  申请退款: POST('/api/Order/applyRefund'),
  撤销申请退款: POST('/api/Order/revocationRefund'),
  // Certificate
  index: GET('/api/certificate/index'),
  // 首页接口
  首页: GET('/api/index/index'),
  // 首页-当前-进度详情
  进度详情:GET('/api/index/process_detail'),
  // 消息中心接口
  消息首页: POST('/api/Message/homePage'),
  消息列表: POST('/api/Message/list'),
  消息详情: POST('/api/Message/detail'),
  查询成绩接口: GET('/api/user_result/get_user_result'),

  推荐职位列表: POST('/api/Job/index'),
  推荐职位详情: POST('/api/Job/detail'),
  添加职位收藏: POST('/api/Job/addCollect'),
  取消职位收藏: POST('/api/Job/cancelCollect'),
  职位收藏列表: POST('/api/Job/collectList'),
  客服接口: POST('/api/index/customer'),

  用户注销: GET('/api/user/delete_user'),

  学校简介: GET('/api/news/school_synopsis'),
  退款说明: GET('/api/order/get_refund_explain'),

  获取用户协议: GET('/api/user/get_user_treaty'),
  获取培训协议: GET('/api/order/get_plan_treaty'),

  身份证验证: POST('/api/Job/verifyIdentity'),

  全部已读: POST('/api/Message/readMsg'),
  删除消息: POST('/api/Message/delMsg'),

  推荐就业分类: GET('/api/job/get_job_type'),
}
