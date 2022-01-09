import { defineComponent, reactive, ref, getCurrentInstance, computed } from '@vue/composition-api'
import { pick, uniqueId } from 'lodash'

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))

export default function useForm({ data: initialData, rules, ...restConfig } = {}) {
  const formName = `form_${uniqueId()}`
  const { proxy: self } = getCurrentInstance()
  const data = reactive(initialData)
  const formRef = computed(() => self?.$refs?.[formName])

  const validate = (validateKeys) =>
    // eslint-disable-next-line no-async-promise-executor
    new Promise(async (resolve) => {
      await delay(100)
      if (validateKeys) {
        formRef?.value?.setRules(pick(rules, validateKeys))
      } else {
        formRef?.value?.setRules(rules)
      }

      formRef?.value?.validate((valid) => {
        resolve(valid)
      })
    })

  return {
    name: formName,
    config: {
      model: data,
      ref: formName,
      ...restConfig,
    },
    data,
    validate,
  }
}
