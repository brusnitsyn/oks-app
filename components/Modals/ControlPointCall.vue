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
    ],
  },
  call: {
    result_call_id: [
      {
        type: 'number',
        required: true,
        message: 'Результат дозвона обязателен!',
        trigger: ['blur', 'change']
      }
    ],
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
    switch (value) {
      case 1:
        model.value.control_point.control_point_option_id = null
        break
      case 2:
        model.value.control_point.control_point_option_id = 1
        model.value.call.brief_answers = {}
        break
      case 3:
        model.value.control_point.control_point_option_id = 1
        break
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
const lastAnswerId = ref(null)

for (const briefAnswer of Object.values(controlPoint.value.data.call.brief_answers)) {
  const findShadow = model.value.call.brief_questions_answers.find(itm => itm.id === briefAnswer)
  shadowSelectedAnswers.value.push(findShadow)
  hasDisableAnswer(findShadow.id)
}

function hasDisableAnswer(answerId: number, questionId: number) {
  const lastAnswer = shadowSelectedAnswers.value.find(itm => itm.id === answerId)
  const containDisableAnswers = shadowSelectedAnswers.value.filter(itm => itm.disp_call_brief_question_id === lastAnswer.disp_call_brief_question_id)
  const containDisableQuestionIndex = containDisableAnswers.findIndex(itm => itm.has_disable_other_answer === true)
  const containDisableAnswersIndex = containDisableAnswers.findIndex(itm => itm.has_disable_answers === true)

  if (containDisableQuestionIndex !== -1) {
    const disableOtherAnswers = shadowSelectedAnswers.value.filter(itm => itm.has_disable_other_answer === true)
    for (const disableOtherAnswer of disableOtherAnswers) {
      const chapter = controlPoint.value.data.call.brief.chapters.find(itm => itm.id === disableOtherAnswer.disp_call_brief_question_chapter_id)
      const questionsToDisable = chapter.questions.filter(itm => !(itm.id === disableOtherAnswer.disp_call_brief_question_id))

      for (const question of questionsToDisable) {
        const spliceIndex = shadowSelectedAnswers.value.findIndex(itm => itm.disp_call_brief_question_id === question.id - 1)
        if (spliceIndex !== -1) {
          shadowSelectedAnswers.value.splice(spliceIndex, 1)
        }
        if (disableOtherAnswer.has_disable_other_answer) {
          question.disabled = true
          model.value.call.brief_answers[question.id] = null
        }
      }
    }
  }
  else {
    const chapter = controlPoint.value.data.call.brief.chapters.find(itm => itm.id === lastAnswer.disp_call_brief_question_chapter_id)
    const questionsToDisabled = chapter.questions.filter(itm => itm.disabled === true)
    for (const question of questionsToDisabled) {
      question.disabled = false
    }
  }
  console.log(containDisableAnswersIndex)
  if (containDisableAnswersIndex !== -1) {
    const disableAnswers = shadowSelectedAnswers.value.filter(itm => itm.has_disable_answers === true)
    for (const disableAnswer of disableAnswers) {
      const chapter = controlPoint.value.data.call.brief.chapters.find(itm => itm.id === disableAnswer.disp_call_brief_question_chapter_id)
      const questionsToDisable = chapter.questions.filter(itm => !(itm.id === disableAnswer.disp_call_brief_question_id))

      let disabledTo = []

      for (const question of questionsToDisable) {
        const spliceIndex = shadowSelectedAnswers.value.findIndex(itm => itm.disp_call_brief_question_id === question.id - 1)
        if (spliceIndex !== -1) {
          shadowSelectedAnswers.value.splice(spliceIndex, 1)
        }
        if (disableAnswer.has_disable_answers) {
          disabledTo = disableAnswer.disable_answer_ids
          for (const ans of question.answers) {
            if (disabledTo.length > 0 && disabledTo.includes(ans.id)) {
              ans.disabled = true
              model.value.call.brief_answers[question.id] = null
            }
          }
        }
      }
    }
  }
  else {
    const chapter = controlPoint.value.data.call.brief.chapters.find(itm => itm.id === lastAnswer.disp_call_brief_question_chapter_id)
    const questionsToDisable = chapter.questions.filter(itm => !(itm.id === lastAnswer.disp_call_brief_question_id))

    let enabledTo = []

    for (const question of questionsToDisable) {
      console.log(lastAnswer.enable_answer_ids)
      if (lastAnswer.enable_answer_ids) {
        enabledTo = lastAnswer.enable_answer_ids

        for (const ans of question.answers) {
          if (enabledTo.length > 0 && enabledTo.includes(ans.id)) {
            ans.disabled = false
          }
        }
      }
    }
  }
}

function onCheckBriefAnswer(chapterId, answerId, question) {
  // lastAnswerId.value = answerId
  const findShadow = model.value.call.brief_questions_answers.find(itm => itm.id === answerId)
  const duplicationIndex = shadowSelectedAnswers.value.findIndex(itm => itm.disp_call_brief_question_id === question.id)

  if (duplicationIndex !== -1) {
    shadowSelectedAnswers.value.splice(duplicationIndex, 1)
  }

  shadowSelectedAnswers.value.push(findShadow)

  hasDisableAnswer(answerId, question.id)
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
    return
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
  <NModal v-model:show="show" :mask-closable="false" preset="card" class="max-w-screen-sm xl:max-w-screen-md" :title="controlPoint.data.control_point.point">
    <NSpace vertical :size="16">
      <NForm ref="formRef" :disabled="controlPoint.data.control_point.controled_at !== null && (!useSanctumAuth().isAdmin)" :rules="rules" :model="model" @submit.prevent="() => onSubmit(handleSubmit)">
        <NGrid cols="2" x-gap="8">
          <NFormItemGi label="Результат дозвона" path="call.result_call_id">
            <SelectResultCall
              v-model:value="resultCall"
            />
          </NFormItemGi>
          <NFormItemGi label="Результат" path="control_point.control_point_option_id">
            <SelectControlPointOption
              v-model:value="model.control_point.control_point_option_id"
              disabled
            />
          </NFormItemGi>

          <NGi span="2">
            <NCollapse accordion>
              <template v-for="(chapter, index) in controlPoint.data.call.brief.chapters">
                <NCollapseItem :title="chapter.name" :name="index" :disabled="model.call.result_call_id === null || model.control_point.control_point_option_id === 1">
                  <NGrid cols="1" x-gap="8" y-gap="8" class="px-6">
                    <template v-for="(question, index) in chapter.questions">
                      <NGridItem>
                        <NSpace vertical>
                          <NText class="font-medium">
                            {{ index + 1 }}. {{ question.question }}
                          </NText>
                          <NRadioGroup v-model:value="model.call.brief_answers[question.id]" :disabled="controlPoint.data.control_point.controled_at !== null && !useSanctumAuth().isAdmin || (model.control_point.control_point_option_id === 1 || question.disabled)" :name="question.question" @update:value="answerId => onCheckBriefAnswer(chapter.id, answerId, question)">
                            <NRadio v-for="answer in question.answers" :label="answer.answer" :disabled="answer.disabled" :value="answer.id" />
                          </NRadioGroup>
                        </NSpace>
                      </NGridItem>
                    </template>
                  </NGrid>
                </NCollapseItem>
              </template>
            </NCollapse>
          </NGi>

          <NFormItemGi span="2" label="Примечание" path="info" class="pt-5">
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

    <template v-if="controlPoint.data.control_point.controled_at === null || useSanctumAuth().isAdmin" #action>
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
