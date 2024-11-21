<script setup lang="ts">
const props = defineProps(['refresh'])
const controlPointId = defineModel('controlPointId')
const { $api } = useNuxtApp()
console.log(controlPointId)
const { data: controlPoint } = await useAsyncData(() => $api(`/api/control-point/${controlPointId.value}`))
const show = defineModel('show')
const model = ref({
  control_point: { ...controlPoint.value.data.control_point },
  call: { ...controlPoint.value.data.call } ?? { call: {} },
})

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

function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const { data, status } = await useAPI(`/api/control-point/${controlPointId.value}`, {
        method: 'PUT',
        body: model.value,
      })

      if (status.value === 'success') {
        show.value = false
        props.refresh()
      }
    }
  })
}

function handleClose() {
  show.value = false
  reset()
}
</script>

<template>
  <NModal v-model:show="show" :mask-closable="false" preset="card" class="w-2/5" :title="controlPoint.data.control_point.point">
    <NForm ref="formRef" :rules="rules" :model="model" @submit.prevent="() => onSubmit(handleSubmit)">
      <NGrid cols="2" x-gap="8">
        <NFormItemGi label="Результат" path="control_point_option_id">
          <SelectControlPointOption
            v-model:value="model.control_point.control_point_option_id"
          />
        </NFormItemGi>
        <NFormItemGi label="Результат разговора" path="result_call_id">
          <SelectResultCall
            v-model:value="model.call.result_call_id"
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

    <template #action>
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
