<script setup lang="ts">
const props = defineProps(['pacientId'])

const { data: pacient } = await useAPI(`/api/pacient/${props.pacientId}/edit`)

const show = defineModel('show')
const model = ref({
  ...pacient.value.data
})

const { pending, rules, reset, onSubmit, edited, apiErrors, formRef } = useNaiveForm(model)

rules.value = {
  fio: [
    {
      required: true,
      message: 'ФИО обязательно!',
      trigger: ['blur', 'input']
    }
  ],
  snils: [
    {
      required: false,
    },
  ],
  birth_at: [
    {
      required: false,
    }
  ],
  receipt_at: [
    {
      type: 'number',
      required: true,
      message: 'Дата поступления обязательна!',
      trigger: ['blur', 'change']
    }
  ],
  discharge_at: [
    {
      required: false,
    }
  ],
  lpu_id: [
    {
      type: 'number',
      required: true,
      message: 'ЛПУ обязательно!',
      trigger: ['blur', 'change']
    }
  ]
}

function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const { data, status } = await useAPI(`/api/pacient`, {
        method: 'POST',
        body: model.value,
      })

      if (status.value === 'success') {
        show.value = false
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
  <NModal v-model:show="show" :mask-closable="false" preset="card" class="w-2/5 min-h-[600px]" title="Редактирование пациента">
    <NTabs type="segment">
      <NTabPane name="info" tab="Персональная информация">
        <NForm ref="formRef" :rules="rules" :model="model" @submit.prevent="() => onSubmit(handleSubmit)">
          <NGrid cols="2" x-gap="8">
            <NFormItemGi label="ЛПУ" path="lpu_id">
              <SelectLpu
                v-model:value="model.lpu_id"
              />
            </NFormItemGi>
            <NFormItemGi label="ФИО" path="fio">
              <NInput
                v-model:value="model.fio"
                placeholder="Брусницын Андрей Олегович"
              />
            </NFormItemGi>
            <NFormItemGi label="СНИЛС" path="snils">
              <NInput
                v-model:value="model.snils"
                placeholder="18165141866"
              />
            </NFormItemGi>
            <NFormItemGi label="Дата рождения" path="birth_at">
              <NDatePicker
                v-model:value="model.birth_at"
                placeholder="29.12.2001"
                format="dd.MM.yyyy"
                type="date"
                class="w-full"
              />
            </NFormItemGi>
            <NFormItemGi label="Дата поступления" path="receipt_at">
              <NDatePicker
                v-model:value="model.receipt_at"
                disabled
                placeholder="10.11.2024"
                format="dd.MM.yyyy"
                type="date"
                class="w-full"
              />
            </NFormItemGi>
            <NFormItemGi label="Дата выписки" path="discharge_at">
              <NDatePicker
                v-model:value="model.discharge_at"
                placeholder="28.12.2024"
                format="dd.MM.yyyy"
                type="date"
                class="w-full"
              />
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NTabPane>
      <NTabPane name="disp" tab="Диспансерное наблюдение">
        <NForm ref="formRef" :rules="rules" :model="model" @submit.prevent="() => onSubmit(handleSubmit)">
          <NGrid cols="2" x-gap="8">
            <NFormItemGi label="Основной диагноз" path="main_diagnos_id">
              <SelectDiagnosMain
                v-model:value="model.disp.main_diagnos_id"
              />
            </NFormItemGi>
            <NFormItemGi label="Сопутствующий диагноз" path="second_diagnos_id">
              <SelectDiagnosMain
                v-model:value="model.disp.second_diagnos_id"
              />
            </NFormItemGi>
            <NFormItemGi span="2" label="Осложнения" path="complications">
              <NInput
                v-model:value="model.disp.complications"
                :autosize="{ minRows: 6, maxRows: 6 }"
                type="textarea"
                placeholder=""
              />
            </NFormItemGi>
            <NFormItemGi label="Статус" path="disp.disp_state_id">
              <SelectDispStatus
                v-model:value="model.disp.disp_state_id"
              />
            </NFormItemGi>
            <NFormItemGi />
            <NFormItemGi label="Дата поступления" path="disp.begin_at">
              <NDatePicker
                v-model:value="model.disp.begin_at"
                disabled
                placeholder="11.11.2024"
                format="dd.MM.yyyy"
                type="date"
                class="w-full"
              />
            </NFormItemGi>
            <NFormItemGi label="Дата снятия" path="disp.end_at">
              <NDatePicker
                v-model:value="model.disp.end_at"
                placeholder="11.11.2024"
                format="dd.MM.yyyy"
                type="date"
                class="w-full"
              />
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NTabPane>
    </NTabs>

    <template #action>
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
