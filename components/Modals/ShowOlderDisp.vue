<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps(['refresh'])
const dispId = defineModel('dispId')

const { data: pacient } = await useAPI(`/api/disp/${dispId.value}`)

const show = defineModel('show')
const model = ref({
  ...pacient.value.data
})

const { pending, rules, reset, onSubmit, edited, apiErrors, formRef } = useNaiveForm(model)

rules.value = {
  main_diagnos_id: [
    {
      type: 'number',
      required: true,
      message: 'Основной диагноз обязателен!',
      trigger: ['blur', 'change']
    }
  ],
  disp_state_id: [
    {
      type: 'number',
      required: true,
      message: 'Статус обязателен!',
      trigger: ['blur', 'change']
    }
  ],
}

function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const { data, status } = await useAPI(`/api/disp/${model.value.id}`, {
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

const auth = useSanctumAuth()

function handleClose() {
  show.value = false
  reset()
}
</script>

<template>
  <NModal v-model:show="show" :mask-closable="false" preset="card" class="max-w-screen-sm xl:max-w-screen-md min-h-[742px]" :title="`(${format(new Date(model.begin_at), 'dd.MM.yyyy')} - ${format(new Date(model.end_at), 'dd.MM.yyyy')}) Диспансерное наблюдение`">
    <NForm ref="formRef" :disabled="!auth.isAdmin" :rules="rules" :model="model" @submit.prevent="() => onSubmit(handleSubmit)">
      <NGrid cols="2" x-gap="8">
        <NFormItemGi span="2" label="Основной диагноз" path="main_diagnos_id">
          <SelectDiagnosMain
            v-model:value="model.main_diagnos_id"
          />
        </NFormItemGi>
        <NFormItemGi span="2" label="Сопутствующий диагноз" path="conco_diagnos_id">
          <SelectDiagnosConco
            v-model:value="model.conco_diagnos_id"
          />
        </NFormItemGi>
        <NFormItemGi span="2" label="Осложнения" path="complications_id">
          <SelectDiagnosComplication v-model:value="model.complications_id" :disabled="!useSanctumAuth().isAdmin" />
        </NFormItemGi>
        <!--        <NFormItemGi label="Статус" path="disp_state_id"> -->
        <!--          <SelectDispStatus -->
        <!--            v-model:value="model.disp_state_id" -->
        <!--          /> -->
        <!--        </NFormItemGi> -->
        <NFormItemGi label="Дата взятия на диспансерный учет" path="begin_at">
          <SelectDatePicker
            v-model:value="model.begin_at"
          />
        </NFormItemGi>
        <NFormItemGi label="Дата выбытия из регистра" path="end_at">
          <SelectDatePicker
            v-model:value="model.end_at"
          />
        </NFormItemGi>
        <NFormItemGi label="Причина выбытия из регистра" path="disp_reason_close_id">
          <SelectReasonClose
            v-model:value="model.disp_reason_close_id"
          />
        </NFormItemGi>
      </NGrid>
    </NForm>

    <template v-if="auth.isAdmin" #action>
      <NFlex justify="space-between" align="center">
        <NButton secondary @click="handleClose">
          Отмена
        </NButton>
        <NButton type="primary" :loading="pending" :disabled="pending || !edited" attr-type="submit" @click="handleSubmit">
          Обновить пациента
        </NButton>
      </NFlex>
    </template>
  </NModal>
</template>

<style scoped>

</style>
