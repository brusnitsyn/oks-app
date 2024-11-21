<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps(['pacientId', 'refresh'])

const show = defineModel('show')
const model = ref({})

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
  lek_pr_state_id: [
    {
      type: 'number',
      required: true,
      message: 'Поле обязателено!',
      trigger: ['blur', 'change']
    }
  ],
  disp_dop_health_id: [
    {
      type: 'number',
      required: true,
      message: 'Поле обязателено!',
      trigger: ['blur', 'change']
    }
  ],
}

function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const { data, status } = await useAPI(`/api/pacient/${props.pacientId}/disp`, {
        method: 'POST',
        body: model.value,
      })

      if (status.value === 'success') {
        show.value = false
        props.refresh()
        reset()
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
  <NModal v-model:show="show" :mask-closable="false" preset="card" class="w-2/5 min-h-[742px]" title="Добавить диспансерное наблюдение">
    <NForm ref="formRef" :rules="rules" :model="model" @submit.prevent="() => onSubmit(handleSubmit)">
      <NGrid cols="2" x-gap="8">
        <NFormItemGi span="2" label="Основной диагноз" path="disp.main_diagnos_id">
          <SelectDiagnosMain
            v-model:value="model.main_diagnos_id"
          />
        </NFormItemGi>
        <NFormItemGi span="2" label="Сопутствующий диагноз" path="disp.conco_diagnos_id">
          <SelectDiagnosConco
            v-model:value="model.conco_diagnos_id"
          />
        </NFormItemGi>
        <NFormItemGi span="2" label="Осложнения" path="disp.complications_id">
          <SelectDiagnosComplication v-model:value="model.complications_id" />
        </NFormItemGi>
        <NFormItemGi label="Статус" path="disp.disp_state_id">
          <SelectDispStatus
            v-model:value="model.disp_state_id"
          />
        </NFormItemGi>
        <NFormItemGi />
        <NFormItemGi label="Дата поступления на учет" path="disp.begin_at">
          <NDatePicker
            v-model:value="model.begin_at"
            placeholder="11.11.2024"
            format="dd.MM.yyyy"
            type="date"
            class="w-full"
          />
        </NFormItemGi>
        <NFormItemGi label="Лекарственные препараты" path="lek_pr_state_id">
          <SelectLekPrState v-model:value="model.lek_pr_state_id" />
        </NFormItemGi>
        <NFormItemGi label="Необходимость дополнительного лечения" path="disp_dop_health_id">
          <SelectDispDopHeal v-model:value="model.disp_dop_health_id" />
        </NFormItemGi>
      </NGrid>
    </NForm>

    <template v-if="auth.isAdmin" #action>
      <NFlex justify="space-between" align="center">
        <NButton secondary @click="handleClose">
          Отмена
        </NButton>
        <NButton type="primary" :loading="pending" :disabled="pending || !edited" attr-type="submit" @click="handleSubmit">
          Добавить наблюдение
        </NButton>
      </NFlex>
    </template>
  </NModal>
</template>

<style scoped>

</style>
