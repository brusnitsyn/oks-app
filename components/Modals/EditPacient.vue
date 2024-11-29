<script setup lang="ts">
const props = defineProps(['pacientId', 'refresh'])

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
      required: true,
      message: 'СНИЛС обязателен!',
      trigger: ['blur', 'input']
    },
    {
      min: 14,
      message: 'Номер СНИЛС должен содержать 11 цифр!',
      trigger: ['blur', 'input']
    },
  ],
  tel: [
    {
      min: 18,
      required: true,
      message: 'Номер телефона обязателен!',
      trigger: ['blur', 'input']
    },
  ],
  birth_at: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('Дата рождения обязательна!')
        }
      },
      trigger: ['blur', 'input']
    }
  ],
  receipt_at: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('Дата поступления обязательна!')
        }
      },
      trigger: ['blur', 'input']
    }
  ],
  discharge_at: [
    {
      type: 'number',
      required: true,
      message: 'Дата поступления обязательна!',
      trigger: ['blur', 'change']
    }
  ],
  lpu_id: [
    {
      type: 'number',
      required: true,
      message: 'ЛПУ обязательно!',
      trigger: ['blur', 'change']
    }
  ],
  disp: {
    main_diagnos_id: [
      {
        type: 'number',
        required: true,
        message: 'Основной диагноз обязателен!',
        trigger: ['blur', 'change']
      }
    ],
    conco_diagnos_id: [
      {
        type: 'array',
        required: true,
        message: 'Сопутствующий диагноз обязателен!',
        trigger: ['blur', 'change']
      }
    ],
    complications_id: [
      {
        type: 'array',
        required: true,
        message: 'Осложнения обязателены!',
        trigger: ['blur', 'change']
      }
    ],
    lek_pr_state_id: [
      {
        type: 'number',
        required: true,
        message: 'Лекарственные препараты обязателены!',
        trigger: ['blur', 'change']
      }
    ],
    disp_dop_health_id: [
      {
        type: 'number',
        required: true,
        message: 'Дополнительное лечение обязателено!',
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
            return new Error('Дата снятия с учета обязательна!')
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
        message: 'Причина снятия с учета обязательна!',
        trigger: ['blur', 'change']
      }
    ],
  },
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
        props.refresh()
        reset()
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
  <NModal v-model:show="show" :mask-closable="false" preset="card" class="w-2/5 min-h-[742px]" title="Редактирование пациента">
    <NForm ref="formRef" :disabled="useSanctumAuth().isOperator" :rules="rules" :model="model" @submit.prevent="() => onSubmit(handleSubmit)">
      <NTabs type="segment">
        <NTabPane display-directive="show" name="info" tab="Персональная информация">
          <NGrid cols="2" x-gap="8">
            <NFormItemGi label="ЛПУ" path="lpu_id">
              <SelectLpu
                v-model:value="model.lpu_id"
              />
            </NFormItemGi>
            <NFormItemGi label="ФИО" path="fio">
              <NInput
                v-model:value="model.fio"
                placeholder=""
              />
            </NFormItemGi>
            <NFormItemGi label="СНИЛС" path="snils">
              <InputSnils v-model:value="model.snils" />
            </NFormItemGi>
            <NFormItemGi label="Номер телефона" path="tel">
              <InputTel v-model:value="model.tel" />
            </NFormItemGi>
            <NFormItemGi label="Дата рождения" path="birth_at">
              <SelectDatePicker
                v-model:value="model.birth_at"
              />
            </NFormItemGi>
            <NFormItemGi label="Дата поступления" path="receipt_at">
              <SelectDatePicker
                v-model:value="model.receipt_at"
                :disabled="!useSanctumAuth().isAdmin"
              />
            </NFormItemGi>
            <!--            <NFormItemGi label="Дата выписки" path="discharge_at"> -->
            <!--              <NDatePicker -->
            <!--                v-model:value="model.discharge_at" -->
            <!--                placeholder="28.12.2024" -->
            <!--                format="dd.MM.yyyy" -->
            <!--                type="date" -->
            <!--                class="w-full" -->
            <!--              /> -->
            <!--            </NFormItemGi> -->
          </NGrid>
        </NTabPane>
        <NTabPane v-if="model.disp" display-directive="show" name="disp" tab="Диспансерное наблюдение">
          <NGrid cols="2" x-gap="8">
            <NFormItemGi span="2" label="Основной диагноз" path="disp.main_diagnos_id">
              <SelectDiagnosMain
                v-model:value="model.disp.main_diagnos_id"
                :disabled="!useSanctumAuth().isAdmin"
              />
            </NFormItemGi>
            <NFormItemGi span="2" label="Сопутствующий диагноз" path="disp.conco_diagnos_id">
              <SelectDiagnosConco
                v-model:value="model.disp.conco_diagnos_id"
                :disabled="!useSanctumAuth().isAdmin"
              />
            </NFormItemGi>
            <NFormItemGi span="2" label="Осложнения" path="disp.complications_id">
              <SelectDiagnosComplication v-model:value="model.disp.complications_id" :disabled="!useSanctumAuth().isAdmin" />
            </NFormItemGi>
            <NFormItemGi label="Статус" path="disp.disp_state_id">
              <SelectDispStatus
                v-model:value="model.disp.disp_state_id"
              />
            </NFormItemGi>
            <NFormItemGi v-if="model.disp.disp_state_id === 2" label="Причина снятия" path="disp.disp_reason_close_id">
              <SelectReasonClose
                v-model:value="model.disp.disp_reason_close_id"
              />
            </NFormItemGi>
            <NFormItemGi label="Дата поступления на учет" path="disp.begin_at">
              <SelectDatePicker
                v-model:value="model.disp.begin_at"
                :disabled="!useSanctumAuth().isAdmin"
              />
            </NFormItemGi>
            <NFormItemGi v-if="model.disp.disp_state_id === 2" label="Дата снятия с учета" path="disp.end_at">
              <SelectDatePicker
                v-model:value="model.disp.end_at"
              />
            </NFormItemGi>
          </NGrid>
        </NTabPane>
      </NTabs>
    </NForm>

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
