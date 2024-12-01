<script lang="ts" setup>
import {
  IconChevronLeft,
  IconEdit,
  IconSquareRoundedPlus,
} from '@tabler/icons-vue'
import { format } from 'date-fns'
import { NIcon } from 'naive-ui'

const config = useRuntimeConfig()
const message = useMessage()
const auth = useSanctumAuth()
const { $api } = useNuxtApp()

const id = Number.parseInt(useRoute().params.id as string)

await useAsyncData('control-point', () => $api('/api/control-point'))

const { data: pacient, refresh } = await useAsyncData(`pacient-id`, () => $api(`/api/pacient/${id}`))

const formatDate = 'dd.MM.yyyy'

const disableForm = ref(false)

const model = ref({
  ...pacient.value
})

async function customRequest({
  file,
  data,
}: UploadCustomRequestOptions) {
  const formData = new FormData()
  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(
        key,
        data[key as keyof UploadCustomRequestOptions['data']]
      )
    })
  }
  formData.append('certificate', file.file as File)
  const { data: responseData } = await useAPI('/api/certificate/read', {
    method: 'POST',
    body: formData
  })
  model.value = responseData.value
}

async function onSubmit() {
  const { status } = await useAPI(`/api/staff/${id}`, {
    method: 'POST',
    body: model.value
  })
  if (status.value === 'success') {
    message.success(response.message, {
      keepAliveOnHover: true
    })
    await useRouter().go(-1)
  }
}

const showAddControlPoint = ref(false)
const showEdit = ref(false)

async function updateControlPoint(control_point_id, value) {
  const { status } = await useAPI(`/api/control-point/${control_point_id}`, {
    method: 'PUT',
    body: {
      control_point_option_id: value
    }
  })

  if (status === 'success') {
    await refresh()
  }
}
const showControlPoint = ref(false)
const controlPointId = ref(null)

function showControlPointCall(control_point_id) {
  controlPointId.value = control_point_id
  showControlPoint.value = true
}

const olderDisp = ref(false)
const dispId = ref(null)
function showOlderDisp(dispid) {
  dispId.value = dispid
  olderDisp.value = true
}

const showAddDisp = ref(false)

useSeoMeta({
  title: () => `Регистр пациентов с ОКС — ${pacient.value.data.fio}`,
  ogTitle: 'Регистр пациентов с ОКС',
  description: 'Регистр пациентов с ОКС Амурской областной клинической больницы.',
  ogDescription: 'Регистр пациентов с ОКС Амурской областной клинической больницы.',
  ogImage: '/i.webp',
  twitterCard: 'summary',
})

definePageMeta({
  middleware: 'sanctum-auth'
})
</script>

<template>
  <div class="max-w-7xl h-full mx-auto px-4">
    <div class="flex flex-col items-center justify-center h-auto xl:h-full">
      <NGrid :cols="5" :x-gap="16" :y-gap="16" item-responsive responsive="screen">
        <NGi span="m:5 l:3">
          <NSpace vertical class="xl:max-w-3xl" :size="16">
            <NCard class="relative shadow" :style="{ '--tw-shadow': `0 0 4px 0 rgba(236, 102, 8, 0.5)` }">
              <template #action>
                <NButton class="absolute top-2 left-0 -translate-x-1/2 shadow" :style="{ '--tw-shadow': `0 0 4px 0 rgba(236, 102, 8, 0.5)` }" :color="useThemeVars().value.cardColor" :text-color="useThemeVars().value.textColor3" circle @click="useRouter().back()">
                  <template #icon>
                    <NIcon :component="IconChevronLeft" />
                  </template>
                </NButton>
                <NText class="text-lg font-bold">
                  {{ pacient.data.fio }}
                </NText>
              </template>
            </NCard>

            <NCard title="Персональная информация" class="relative shadow" :style="{ '--tw-shadow': `0 0 4px 0 rgba(236, 102, 8, 0.5)` }">
              <template #header-extra>
                <NButton text @click="showEdit = true">
                  <template #icon>
                    <IconEdit />
                  </template>
                  Изменить
                </NButton>
              </template>
              <NList hoverable>
                <NListItem>
                  <NGrid :cols="2">
                    <NGi><NText>СНИЛС</NText></NGi>
                    <NGi v-if="pacient.data.snils">
                      <NText>{{ pacient.data.snils }}</NText>
                    </NGi>
                  </NGrid>
                </NListItem>
                <NListItem>
                  <NGrid :cols="2">
                    <NGi><NText>Дата рождения</NText></NGi>
                    <NGi v-if="pacient.data.birth_at">
                      <NText>{{ format(pacient.data.birth_at, 'dd.MM.yyyy') }}</NText>
                    </NGi>
                  </NGrid>
                </NListItem>
                <NListItem>
                  <NGrid :cols="2">
                    <NGi><NText>Номер телефона</NText></NGi>
                    <NGi v-if="pacient.data.tel">
                      <NText>{{ pacient.data.tel }}</NText>
                    </NGi>
                  </NGrid>
                </NListItem>
              </NList>
            </NCard>

            <NCard v-if="pacient.data.disp != null" title="Текущее диспансерное наблюдение" class="shadow" :style="{ '--tw-shadow': `0 0 4px 0 rgba(32, 128, 240, 0.5)` }">
              <NList hoverable>
                <NListItem>
                  <NGrid :cols="2">
                    <NGi><NText>Дата поступления</NText></NGi>
                    <NGi>
                      <NText v-if="pacient.data.disp.begin_at">
                        {{ format(pacient.data.disp.begin_at, 'dd.MM.yyyy') }}
                      </NText>
                      <NText v-else>
                        —
                      </NText>
                    </NGi>
                  </NGrid>
                </NListItem>
                <NListItem>
                  <NGrid :cols="2">
                    <NGi><NText>Основной диагноз</NText></NGi>
                    <NGi>
                      <NText>{{ pacient.data.disp.main_diagnos?.name }}</NText>
                    </NGi>
                  </NGrid>
                </NListItem>
                <NListItem>
                  <NGrid :cols="2">
                    <NGi><NText>Сопутствующий диагноз</NText></NGi>
                    <NGi>
                      <NSpace vertical :size="0">
                        <template v-for="conco in pacient.data.disp.conco_diagnos">
                          <NText>{{ conco.name }}</NText>
                        </template>
                      </NSpace>
                    </NGi>
                  </NGrid>
                </NListItem>
                <NListItem>
                  <NGrid :cols="2">
                    <NGi><NText>Осложнения</NText></NGi>
                    <NGi>
                      <NSpace vertical :size="0">
                        <template v-for="comp in pacient.data.disp.complications">
                          <NText>{{ comp.name }}</NText>
                        </template>
                      </NSpace>
                    </NGi>
                  </NGrid>
                </NListItem>
              </NList>
            </NCard>
          </NSpace>
        </NGi>
        <NGi span="m:5 l:2">
          <NSpace vertical :size="16">
            <NCard title="Диспансерные наблюдения" class="shadow" :style="{ '--tw-shadow': `0 0 4px 0 rgba(236, 102, 8, 0.5)` }">
              <template v-if="useSanctumAuth().isAdmin || useSanctumAuth().isDoctor" #header-extra>
                <NButton text @click="showAddDisp = true">
                  <template #icon>
                    <IconSquareRoundedPlus />
                  </template>
                  Добавить
                </NButton>
              </template>
              <NList v-if="pacient.data.disps && pacient.data.disps.length">
                <NScrollbar class="max-h-[360px]">
                  <NListItem v-for="disp in pacient.data.disps" :key="disp.id">
                    <NTooltip>
                      {{ disp.main_diagnos?.name }}
                      <template #trigger>
                        <NThing :title="`${format(new Date(disp.begin_at), 'dd.MM.yyyy')} - ${format(new Date(disp.end_at), 'dd.MM.yyyy')}`" class="px-4">
                          <template #header-extra>
                            <NButton secondary size="small" @click="showOlderDisp(disp.id)">
                              Подробнее
                            </NButton>
                          </template>
                        </NThing>
                      </template>
                    </NTooltip>
                  </NListItem>
                </NScrollbar>
              </NList>
              <NEmpty v-else description="Диспансерных наблюдений нет" class="pt-5 pb-4">
                <template #extra>
                  <NButton v-if="useSanctumAuth().isAdmin || useSanctumAuth().isDoctor" size="small" @click="showAddDisp = true">
                    Добавить наблюдение
                  </NButton>
                </template>
              </NEmpty>
            </NCard>
            <NCard v-if="(auth.isAdmin || auth.isOperator) && pacient.data.disp != null" title="Контрольные точки" class="shadow" :style="{ '--tw-shadow': `0 0 4px 0 rgba(32, 128, 240, 0.5)` }">
              <NList :show-divider="false">
                <NScrollbar>
                  <NListItem v-for="cp in pacient.data.disp.control_points" :key="cp.control_point.id" class="rounded" :style="`backgroundColor: ${cp.control_point.controled_at != null ? '#7FE7C4' : ''}`">
                    <NGrid cols="2" class="px-4">
                      <NGridItem class="flex items-center gap-x-1">
                        <NText class="font-bold">
                          {{ cp.control_point.point }}
                        </NText>
                        <NText>
                          &middot; {{ format(cp.control_point.control_at, 'dd.MM.yyyy') }}
                        </NText>
                      </NGridItem>
                      <NGridItem class="flex items-center justify-end" align="end">
                        <NButton v-if="(cp.call == null || useSanctumAuth().isAdmin)" text @click="showControlPointCall(cp.control_point.id)">
                          <template #icon>
                            <IconEdit />
                          </template>
                          Изменить
                        </NButton>
                        <!--                    <LazySelectControlPointOption v-model="control_point.control_point_option_id" :disabled="control_point.control_point_option_id" @change="value => updateControlPoint(control_point.id, value)" /> -->
                      </NGridItem>
                    </NGrid>
                  </NListItem>
                </NScrollbar>
              </NList>
            </NCard>
          </NSpace>
        </NGi>
      </NGrid>
    </div>

    <ModalsCreateDisp v-model:show="showAddDisp" :pacient-id="pacient.data.id" :refresh="refresh" />
    <LazyModalsEditPacient v-model:show="showEdit" :pacient-id="pacient.data.id" :refresh="refresh" />
    <template v-if="olderDisp">
      <ModalsShowOlderDisp v-model:show="olderDisp" v-model:disp-id="dispId" :refresh="refresh" />
    </template>
    <template v-if="showControlPoint">
      <ModalsControlPointCall v-model:show="showControlPoint" :control-point-id="controlPointId" :refresh="refresh" />
    </template>
  </div>
<!--  <ModalsAddStaffIntegrate v-model:show="showAddStaffIntegrate" :staff-id="staff.id" @created-integrate="(value) => staff.integrations.push(value)" />
  <ModalsEditStaffIntegrate v-model:show="showEditStaffIntegrate" v-model:model="editIntegrate" :staff-id="staff.id" @updated-integrate="(value) => updateIntegrate(value)" />
  <ModalsEditStaff v-model:show="showEdit" v-model:model="staff" /> -->
</template>
