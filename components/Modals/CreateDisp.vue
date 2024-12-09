<script setup lang="ts">
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
  // conco_diagnos_id: [
  //   {
  //     type: 'array',
  //     required: true,
  //     message: 'Сопутствующий диагноз обязателен!',
  //     trigger: ['blur', 'change']
  //   }
  // ],
  // complications_id: [
  //   {
  //     type: 'array',
  //     required: true,
  //     message: 'Осложнения обязательны!',
  //     trigger: ['blur', 'change']
  //   }
  // ],
  lek_pr_state_id: [
    {
      type: 'number',
      required: true,
      message: 'Лекарственные препараты обязательны!',
      trigger: ['blur', 'change']
    }
  ],
  disp_dop_health_id: [
    {
      type: 'number',
      required: true,
      message: 'Дополнительное лечение обязательно!',
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
  end_at: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('Дата выбытия из регистра обязательна!')
        }
      },
      trigger: ['blur', 'input']
    }
  ],
  begin_at: [
    {
      validator(rule, value) {
        if (!value) {
          return new Error('Дата поступления на учет обязательна!')
        }
      },
      required: true,
      trigger: ['blur', 'input']
    }
  ],
  disp_reason_close_id: [
    {
      type: 'number',
      required: true,
      message: 'Причина выбытия из регистра обязательна!',
      trigger: ['blur', 'change']
    }
  ],
}

const loading = ref(false)

function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      const { data, status } = await useAPI(`/api/pacient/${props.pacientId}/disp`, {
        method: 'POST',
        body: model.value,
      })

      if (status.value === 'success') {
        show.value = false
        loading.value = false
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
  <NModal v-model:show="show" :mask-closable="false" preset="card" class="max-w-screen-sm xl:max-w-screen-md min-h-[742px]" title="Добавить диспансерное наблюдение">
    <NForm ref="formRef" :rules="rules" :model="model" @submit.prevent="() => onSubmit(handleSubmit)">
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
          <SelectDiagnosComplication v-model:value="model.complications_id" />
        </NFormItemGi>
        <NFormItemGi label="Статус" path="disp_state_id">
          <SelectDispStatus
            v-model:value="model.disp_state_id"
          />
        </NFormItemGi>
        <NFormItemGi v-if="model.disp_state_id === 1" label="Дата взятия на диспансерный учет" path="begin_at">
          <SelectDatePicker
            v-model:value="model.begin_at"
            :disabled="!useSanctumAuth().isAdmin"
          />
        </NFormItemGi>
        <NFormItemGi label="Лекарственные препараты" path="lek_pr_state_id">
          <SelectLekPrState v-model:value="model.lek_pr_state_id" />
        </NFormItemGi>
        <NFormItemGi label="Необходимость дополнительного лечения" path="disp_dop_health_id">
          <SelectDispDopHeal v-model:value="model.disp_dop_health_id" />
        </NFormItemGi>
        <NFormItemGi span="2" />
        <NFormItemGi v-if="model.disp_state_id === 2" label="Дата выбытия из регистра" path="end_at">
          <SelectDatePicker
            v-model:value="model.end_at"
          />
        </NFormItemGi>
        <NFormItemGi v-if="model.disp_state_id === 2" label="Причина выбытия из регистра" path="disp_reason_close_id">
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
        <NButton type="primary" :loading="loading" :disabled="loading || !edited" attr-type="submit" @click="handleSubmit">
          Добавить наблюдение
        </NButton>
      </NFlex>
    </template>
  </NModal>
</template>

<style scoped>

</style>
