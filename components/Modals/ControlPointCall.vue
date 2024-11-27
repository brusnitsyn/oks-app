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
const model = ref()

const { data: controlPoint, status } = await useAPI(`/api/control-point/${props.controlPointId}`, {
  server: false,
})

// const { data: briefAnswers, briefAnswersStatus } = await useAPI(`/api/brief/${controlPoint.value.data.call.brief.id}`, {
//   server: false,
// })

model.value = {
  control_point: { ...controlPoint?.value.data?.control_point },
  call: { ...controlPoint?.value.data?.call } ?? { },
}

// if () {
//   for (const chapter in controlPoint.value.data.call.brief.chapters) {
//     for (const question in controlPoint.value.data.call.brief.chapters[chapter].questions) {
//       const questionId = controlPoint.value.data.call.brief.chapters[chapter].questions[question].id
//       model.value.brief.answers.set(`${questionId}`, null)
//     }
//   }
// }

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
  },
  brief: {

  }
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
    if (value === 2) {
      model.value.control_point.control_point_option_id = 1
      model.value.call.brief_answers = {}
    }
    model.value.call.result_call_id = value
  }
})

// const briefIndexes = computed(() => {
//   const indexes = []
//   for (const index in controlPoint.value.data.call.brief.chapters) {
//     indexes.push(index)
//   }
//
//   return indexes
// })

const shadowSelectedAnswers = ref([])

function onCheckBriefAnswer(answerId, question) {
  const findShadow = model.value.call.brief_questions_answers.find(itm => itm.id === answerId)
  const duplicationIndex = shadowSelectedAnswers.value.findIndex(itm => itm.disp_call_brief_question_id === question.id)

  if (duplicationIndex !== -1) {
    shadowSelectedAnswers.value.splice(duplicationIndex, 1)
  }

  shadowSelectedAnswers.value.push(findShadow)

  // const answers = model.value.call.brief_answers
  // const answersKeys = Object.keys(model.value.call.brief_answers)
  // const hasAddedAnswerValue = answers.find(itm => itm === answerId)
  // const hasAddedAnswer = answersKeys.findIndex(itm => Number(itm) === question.id)
  //
  // console.log(hasAddedAnswerValue, hasAddedAnswer

  // if (q.has_send_smp === true) {
  //   // if (hasAddedAnswer !== -1) {
  //   //   model.value.control_point.control_point_option_id = 6
  //   //   return
  //   // }
  //
  //   model.value.control_point.control_point_option_id = 6
  // }
  // if (q.has_send_doctor === true) {
  //   // if (hasAddedAnswer !== -1) {
  //   //   model.value.control_point.control_point_option_id = 5
  //   //   return
  //   // }
  //   if (model.value.control_point.control_point_option_id === 6) {
  //     model.value.control_point.control_point_option_id = 5
  //   }
  // }
  //
  // if (q.has_attention === true) {
  //   // if (hasAddedAnswer !== -1) {
  //   //   model.value.control_point.control_point_option_id = 4
  //   //   return
  //   // }
  //
  //   if (model.value.control_point.control_point_option_id !== 6 || model.value.control_point.control_point_option_id !== 5) {
  //     model.value.control_point.control_point_option_id = 4
  //     return
  //   }
  // }
  //
  // if (q.has_need_send_doctor === true) {
  //
  // }

  // model.value.control_point.control_point_option_id = 2
}

watch(shadowSelectedAnswers.value, (newValue) => {
  const hasSendSmp = newValue.findIndex(itm => itm.has_send_smp === true)
  if (hasSendSmp !== -1) {
    model.value.control_point.control_point_option_id = 6

    return
  }

  const hasSendDoctor = newValue.findIndex(itm => itm.has_send_doctor === true)
  if (hasSendDoctor !== -1) {
    model.value.control_point.control_point_option_id = 5
  }

  const hasAttention = newValue.findIndex(itm => itm.has_attention === true)
  if (hasAttention !== -1) {
    model.value.control_point.control_point_option_id = 4
  }

  if (hasSendSmp === -1 && hasSendDoctor === -1 && hasAttention === -1) {
    model.value.control_point.control_point_option_id = 2
  }
})

function handleClose() {
  show.value = false
  reset()
}
</script>

<template>
  <NModal v-model:show="show" :mask-closable="false" preset="card" class="w-2/5" :title="controlPoint.data.control_point.point">
    <NSpace vertical :size="16">
      <NCollapse accordion>
        <template v-for="(chapter, index) in controlPoint.data.call.brief.chapters">
          <NCollapseItem :title="chapter.name" :name="index">
            <NGrid cols="1" x-gap="8" y-gap="8" class="px-6">
              <template v-for="(question, index) in chapter.questions">
                <NGridItem>
                  <NSpace vertical>
                    <NText class="font-medium">
                      {{ index + 1 }}. {{ question.question }}
                    </NText>
                    <NRadioGroup v-model:value="model.call.brief_answers[question.id]" :disabled="model.control_point.control_point_option_id === 1" :name="question.question" @update:value="answerId => onCheckBriefAnswer(answerId, question)">
                      <NRadio v-for="answer in question.answers" :label="answer.answer" :value="answer.id" />
                    </NRadioGroup>
                  </NSpace>
                </NGridItem>
              </template>
            </NGrid>
          </NCollapseItem>
        </template>
      </NCollapse>
      <NForm ref="formRef" :disabled="controlPoint.data.call !== {} && !useSanctumAuth().isAdmin" :rules="rules" :model="model" @submit.prevent="() => onSubmit(handleSubmit)">
        <NGrid cols="2" x-gap="8">
          <NFormItemGi label="Результат" path="control_point_option_id">
            <SelectControlPointOption
              v-model:value="model.control_point.control_point_option_id"
              disabled
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
    </NSpace>

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
