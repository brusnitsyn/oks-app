<script setup lang="ts">
const props = defineProps(['refresh'])
const emits = defineEmits('createdIntegrate')
const show = defineModel('show')
const model = ref({
  info: {}
})

const { pending, rules, reset, onSubmit, edited, apiErrors, formRef } = useNaiveForm(model)

rules.value = {
  // fio: [
  //   {
  //     required: true,
  //     message: 'ФИО обязательно!',
  //     trigger: ['blur', 'input']
  //   }
  // ],
  family: [
    {
      required: true,
      message: 'Это поле обязательно для заполнения!',
      trigger: ['blur', 'input']
    }
  ],
  name: [
    {
      required: true,
      message: 'Это поле обязательно для заполнения!',
      trigger: ['blur', 'input']
    }
  ],
  ot: [
    {
      required: true,
      message: 'Это поле обязательно для заполнения!',
      trigger: ['blur', 'input']
    }
  ],
  snils: [
    {
      required: true,
      message: 'Это поле обязательно для заполнения!',
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
      message: 'Это поле обязательно для заполнения!',
      trigger: ['blur', 'input']
    },
  ],
  dop_tel: [
    {
      min: 18,
      required: true,
      message: 'Это поле обязательно для заполнения!',
      trigger: ['blur', 'input']
    },
  ],
  birth_at: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('Это поле обязательно для заполнения!')
        }
      },
      trigger: ['blur', 'input']
    }
  ],
  info: {
    stt_receipt_at: [
      {
        required: true,
        validator(rule, value) {
          if (!value) {
            return new Error('Это поле обязательно для заполнения!')
          }
        },
        trigger: ['blur', 'input']
      }
    ],
    stt_discharge_at: [
      {
        required: true,
        validator(rule, value) {
          if (!value) {
            return new Error('Это поле обязательно для заполнения!')
          }
        },
        trigger: ['blur', 'input']
      }
    ],
    lpu_id: [
      {
        type: 'number',
        required: true,
        message: 'Это поле обязательно для заполнения!',
        trigger: ['blur', 'change']
      }
    ],
    main_diagnos_id: [
      {
        type: 'number',
        required: true,
        message: 'Это поле обязательно для заполнения!',
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
        message: 'Это поле обязательно для заполнения!',
        trigger: ['blur', 'change']
      }
    ],
    lek_period_id: [
      {
        type: 'number',
        validator(rule, value) {
          if (model.value.info.lek_pr_state_id === 1 && typeof value === 'undefined') {
            return new Error('Это поле обязательно для заполнения!')
          }
          return true
        },
        trigger: ['blur', 'change']
      }
    ],
    disp_dop_health_id: [
      {
        type: 'number',
        required: true,
        message: 'Это поле обязательно для заполнения!',
        trigger: ['blur', 'change']
      }
    ],
    disp_reason_close_id: [
      {
        type: 'number',
        required: true,
        message: 'Это поле обязательно для заполнения!',
        trigger: ['blur', 'change']
      }
    ],
    disp_state_id: [
      {
        type: 'number',
        required: true,
        message: 'Это поле обязательно для заполнения!',
        trigger: ['blur', 'change']
      }
    ],
    begin_at: [
      {
        required: true,
        validator(rule, value) {
          if (!value) {
            return new Error('Это поле обязательно для заполнения!')
          }
        },
        trigger: ['blur', 'input']
      }
    ],
    end_at: [
      {
        required: true,
        validator(rule, value) {
          if (!value) {
            return new Error('Это поле обязательно для заполнения!')
          }
        },
        trigger: ['blur', 'input']
      }
    ]
  },
}
const loading = ref(false)
function handleSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      const { data, status } = await useAPI(`/api/pacient`, {
        method: 'POST',
        body: model.value,
      })

      if (status.value === 'success') {
        show.value = false
        const id = data.value.id
        loading.value = false
        navigateTo({ name: 'pacient-id', params: { id } })
      }
      else {
        loading.value = false
      }
    }
  })
}
const activeTab = ref('patient')
function handleClose() {
  show.value = false
  reset()
}
</script>

<template>
  <NModal v-model:show="show" :mask-closable="false" preset="card" class="max-w-screen-sm xl:max-w-screen-md min-h-[742px]" title="Добавление пациента">
    <NForm ref="formRef" :rules="rules" :model="model" class="h-full" @submit.prevent="() => onSubmit(handleSubmit)">
      <NTabs v-model:value="activeTab" type="segment" class="h-full">
        <NTabPane display-directive="show" class="h-full" name="patient" tab="Персональная информация">
          <NGrid cols="3" x-gap="8">
            <NFormItemGi span="3" label="ЛПУ" path="info.lpu_id">
              <SelectLpu
                v-model:value="model.info.lpu_id"
              />
            </NFormItemGi>
            <!--            <NFormItemGi label="ФИО" path="fio"> -->
            <!--              <NInput -->
            <!--                v-model:value="model.fio" -->
            <!--                placeholder="" -->
            <!--              /> -->
            <!--            </NFormItemGi> -->
            <NFormItemGi label="Фамилия" path="family">
              <NInput
                v-model:value="model.family"
                placeholder=""
              />
            </NFormItemGi>
            <NFormItemGi label="Имя" path="name">
              <NInput
                v-model:value="model.name"
                placeholder=""
              />
            </NFormItemGi>
            <NFormItemGi label="Отчество" path="ot">
              <NInput
                v-model:value="model.ot"
                placeholder=""
              />
            </NFormItemGi>
            <NFormItemGi label="СНИЛС" path="snils">
              <InputSnils v-model:value="model.snils" />
            </NFormItemGi>
            <NFormItemGi label="Номер телефона" path="tel">
              <InputTel v-model:value="model.tel" />
            </NFormItemGi>
            <NFormItemGi label="Дополнительный номер телефона" path="dop_tel">
              <InputTel v-model:value="model.dop_tel" />
            </NFormItemGi>
            <NFormItemGi label="Дата рождения" path="birth_at">
              <SelectDatePicker
                v-model:value="model.birth_at"
              />
            </NFormItemGi>
            <NFormItemGi label="Дата поступления в стационар" path="info.stt_receipt_at">
              <SelectDatePicker
                v-model:value="model.info.stt_receipt_at"
              />
            </NFormItemGi>
            <NFormItemGi label="Дата выписки из стационара" path="info.stt_discharge_at">
              <SelectDatePicker
                v-model:value="model.info.stt_discharge_at"
              />
            </NFormItemGi>
          </NGrid>
        </NTabPane>
        <NTabPane display-directive="show" name="info" tab="Информация по заболеванию">
          <NGrid cols="2" x-gap="8">
            <NFormItemGi span="2" label="Основной диагноз" path="info.main_diagnos_id">
              <SelectDiagnosMain
                v-model:value="model.info.main_diagnos_id"
              />
            </NFormItemGi>
            <NFormItemGi span="2" label="Сопутствующий диагноз" path="info.conco_diagnos_id">
              <SelectDiagnosConco
                v-model:value="model.info.conco_diagnos_id"
              />
            </NFormItemGi>
            <NFormItemGi span="2" label="Осложнения" path="info.complications_id">
              <SelectDiagnosComplication v-model:value="model.info.complications_id" />
            </NFormItemGi>
<!--            <NFormItemGi label="Диспансерный учет" path="disp.disp_state_id">-->
<!--              <SelectDispStatus-->
<!--                v-model:value="model.disp.disp_state_id"-->
<!--              />-->
<!--            </NFormItemGi>-->
<!--            <NFormItemGi v-if="model.disp.disp_state_id === 1" label="Дата постановки на диспансерный учет" path="disp.begin_at">-->
<!--              <SelectDatePicker-->
<!--                v-model:value="model.disp.begin_at"-->
<!--              />-->
<!--            </NFormItemGi>-->
            <NFormItemGi label="Лекарственные препараты" path="info.lek_pr_state_id">
              <SelectLekPrState v-model:value="model.info.lek_pr_state_id" />
            </NFormItemGi>
            <NFormItemGi :show-require-mark="model.info.lek_pr_state_id === 1" label="Лекарственные препараты выданы на срок" path="info.lek_period_id" >
              <SelectLekPeriod v-model:value="model.info.lek_period_id" :disabled="model.info.lek_pr_state_id !== 1" />
            </NFormItemGi>
            <NFormItemGi label="Необходимость дополнительного лечения" path="info.disp_dop_health_id">
              <SelectDispDopHeal v-model:value="model.info.disp_dop_health_id" />
            </NFormItemGi>
            <NFormItemGi />
<!--            <NFormItemGi v-if="model.disp.disp_state_id === 2" label="Дата выбытия из регистра" path="disp.end_at">-->
<!--              <SelectDatePicker-->
<!--                v-model:value="model.disp.end_at"-->
<!--              />-->
<!--            </NFormItemGi>-->
<!--            <NFormItemGi v-if="model.disp.disp_state_id === 2" label="Причина выбытия из регистра" path="disp.disp_reason_close_id">-->
<!--              <SelectReasonClose-->
<!--                v-model:value="model.disp.disp_reason_close_id"-->
<!--              />-->
<!--            </NFormItemGi>-->
          </NGrid>
        </NTabPane>
      </NTabs>
    </NForm>
    <template #action>
      <NFlex justify="space-between" align="center">
        <NButton secondary @click="handleClose">
          Отмена
        </NButton>
        <NButton v-if="activeTab === 'info'" type="primary" :loading="loading" :disabled="loading || !edited" attr-type="submit" @click="handleSubmit">
          Добавить пациента
        </NButton>
      </NFlex>
    </template>
  </NModal>
</template>

<style scoped>

</style>
