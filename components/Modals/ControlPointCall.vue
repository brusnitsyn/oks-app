<script setup lang="ts">
const props = defineProps({
  refresh: {
    type: Function
  },
  controlPointId: {
    type: Number,
    required: true,
    default: 1
  },
})

// const controlPointId = defineModel('controlPointId')
// const { $api } = useNuxtApp()

const show = defineModel('show')
const model = ref({})

const { pending, rules, reset, onSubmit, edited, apiErrors, formRef } = useNaiveForm(model)

rules.value = {
  control_point: {
    control_point_option_id: [
      {
        type: 'number',
        required: true,
        message: 'Результат обязателен!',
        trigger: ['blur', 'change']
      }
    ]
  },
  call: {
    result_call_id: [
      {
        type: 'number',
        required: true,
        message: 'Результат разговора обязателен!',
        trigger: ['blur', 'change']
      }
    ],
  }
}

const { data: controlPoint, status } = await useAPI(`/api/control-point/${props.controlPointId}`, {
  server: false,
})
model.value = {
  control_point: { ...controlPoint?.value.data?.control_point },
  call: { ...controlPoint?.value.data?.call } ?? { call: {} },
}

function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const { data, status } = await useAPI(`/api/control-point/${props.controlPointId}`, {
        method: 'PUT',
        body: model.value,
      })

      if (status.value === 'success') {
        show.value = false
        reset()
        props.refresh()
      }
    }
  })
}

const resultCall = computed({
  get() {
    return model.value.call.result_call_id
  },
  set(value) {
    if (value === 2) { model.value.control_point.control_point_option_id = 1 }
    else { model.value.control_point.control_point_option_id = null }
    model.value.call.result_call_id = value
  }
})

function handleClose() {
  show.value = false
  reset()
}
</script>

<template>
  <NModal v-model:show="show" :mask-closable="false" preset="card" class="w-2/5" :title="controlPoint.data.control_point.point">
    <NForm ref="formRef" :disabled="controlPoint.data.call !== {} && !useSanctumAuth().isAdmin" :rules="rules" :model="model" @submit.prevent="() => onSubmit(handleSubmit)">
      <NGrid cols="2" x-gap="8">
        <NFormItemGi label="Результат" path="control_point_option_id">
          <SelectControlPointOption
            v-model:value="model.control_point.control_point_option_id"
            :disabled="model.control_point.control_point_option_id === 1"
          />
        </NFormItemGi>
        <NFormItemGi label="Результат разговора" path="result_call_id">
          <SelectResultCall
            v-model:value="resultCall"
          />
        </NFormItemGi>
        <NFormItemGi span="2" label="Примечание" path="info">
          <NInput
            v-model:value="model.call.info"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 6 }"
            placeholder=""
          />
        </NFormItemGi>
      </NGrid>
    </NForm>

    <template v-if="controlPoint.data.call === {} || useSanctumAuth().isAdmin" #action>
      <NFlex justify="space-between" align="center">
        <NButton secondary @click="handleClose">
          Отмена
        </NButton>
        <NButton type="primary" :loading="pending" :disabled="pending || !edited" attr-type="submit" @click="handleSubmit">
          Обновить контрольную точку
        </NButton>
      </NFlex>
    </template>
  </NModal>
</template>

<style scoped>

</style>
