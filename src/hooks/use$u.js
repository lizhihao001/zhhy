import { defineComponent, reactive, ref, watch, getCurrentInstance, computed } from '@vue/composition-api'
import { debounce } from 'lodash'

export default function use$u() {
  const self = getCurrentInstance()

  return self?.proxy.$u
}
