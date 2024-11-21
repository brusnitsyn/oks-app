<script lang="ts" setup>
import {
  IconChevronLeft,
  IconEdit,
} from '@tabler/icons-vue'
import { format } from 'date-fns'
import { NIcon } from 'naive-ui'

const config = useRuntimeConfig()
const message = useMessage()
const auth = useSanctumAuth()
const { $api } = useNuxtApp()

const id = Number.parseInt(useRoute().params.id as string)

await useAsyncData('control-point', () => $api('/api/control-point'))

// const userModel = await $client.getUser.useQuery({ id })

const { data: pacient, refresh } = await useAsyncData(`pacient-id`, () => $api(`/api/pacient/${id}`))

const formatDate = 'dd.MM.yyyy'

const disableForm = ref(false)
const showOlderDisp = ref(false)

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

definePageMeta({
  middleware: 'sanctum-auth'
})
</script>

<template>
  <div>
    <NGrid :cols="5" :x-gap="16">
      <NGi span="3">
        <NSpace vertical class="max-w-3xl">
          <NCard class="relative">
            <NFlex class="absolute top-4 right-4">
              <!--            <NTag v-if="staff.mis_user_id != null" type="info" round> -->
              <!--              Запись {{ format(new Date(staff.mis_sync_at), 'dd.MM.yyyy') }} в {{ format(new Date(pacient.data.receipt_at), 'HH:mm') }} -->
              <!--              <template #icon> -->
              <!--                <NIcon :component="IconProgressCheck" :size="20" /> -->
              <!--              </template> -->
              <!--            </NTag> -->
            </NFlex>
            <NButton class="absolute top-2 left-0 -translate-x-1/2" :style="{ border: '1px', borderColor: useThemeVars().value.borderColor, borderStyle: 'solid' }" :color="useThemeVars().value.cardColor" :text-color="useThemeVars().value.textColor3" circle @click="useRouter().back()">
              <template #icon>
                <NIcon :component="IconChevronLeft" />
              </template>
            </NButton>
            <NAvatar round :size="120" class="font-bold text-3xl">
              {{ pacient.data.fio[0] }}
            </NAvatar>
            <template #action>
              <NFlex justify="space-between" align="center">
                <NText class="text-lg font-bold">
                  {{ pacient.data.fio }}
                </NText>

                <NText>
                  #{{ pacient.data.id }}
                </NText>
              </NFlex>
            </template>
          </NCard>

          <!--        <NAlert v-if="hasAlerValid" title="Сертификат действителен" type="success" /> -->
          <!--        <NAlert v-if="hasAlerNewRequest" title="Срок действия сертификата подходит к концу" type="warning" /> -->
          <!--        <NAlert v-if="hasAlerNoValid" title="Сертификат не действителен" type="error" /> -->

          <NCard title="Персональная информация">
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
                    <NText>{{ format(new Date(pacient.data.birth_at), 'dd.MM.yyyy') }}</NText>
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
              <!--            <NListItem>
                <template v-if="staff.job_title" #suffix>
                  <AppCopyButton :value="staff.job_title" />
                </template>
                <NGrid :cols="2">
                  <NGi><NText>Должность</NText></NGi>
                  <NGi><NEllipsis>{{ staff.job_title }}</NEllipsis></NGi>
                </NGrid>
              </NListItem>
              <NListItem>
                <template v-if="staff.division" #suffix>
                  <AppCopyButton :value="staff.division" />
                </template>
                <NGrid :cols="2">
                  <NGi><NText>Подразделение</NText></NGi>
                  <NGi><NText>{{ staff.division }}</NText></NGi>
                </NGrid>
              </NListItem> -->
            </NList>
          </NCard>

          <NCard title="Текущее диспансерное наблюдение">
            <NList hoverable>
              <NListItem>
                <NGrid :cols="2">
                  <NGi><NText>Дата поступления</NText></NGi>
                  <NGi>
                    <NText v-if="pacient.data.disp.begin_at">
                      {{ format(new Date(pacient.data.disp.begin_at), 'dd.MM.yyyy') }}
                    </NText>
                    <NText v-else>
                      —
                    </NText>
                  </NGi>
                </NGrid>
              </NListItem>
              <NListItem>
                <NGrid :cols="2">
                  <NGi><NText>Дата выписки</NText></NGi>
                  <NGi>
                    <NText v-if="pacient.data.disp.end_at">
                      {{ format(new Date(pacient.data.disp.end_at), 'dd.MM.yyyy') }}
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
                    <NText>{{ pacient.data.disp.main_diagnos.name }}</NText>
                  </NGi>
                </NGrid>
              </NListItem>
              <NListItem>
                <NGrid :cols="2">
                  <NGi><NText>Сопутствующий диагноз</NText></NGi>
                  <NGi>
                    <NText>{{ pacient.data.disp.conco_diagnos.name }}</NText>
                  </NGi>
                </NGrid>
              </NListItem>
              <!--            <NListItem> -->
              <!--              <NGrid :cols="2"> -->
              <!--                <NGi><NText>{{ pacient.data.disp. }} диагноз</NText></NGi> -->
              <!--                <NGi> -->
              <!--                  <NText>{{ diagnos.name }}</NText> -->
              <!--                </NGi> -->
              <!--              </NGrid> -->
              <!--            </NListItem> -->
            </NList>
          </NCard>
        </NSpace>
      </NGi>
      <NGi span="2">
        <NSpace vertical>
          <NCard title="Диспансерные наблюдения">
            <NList v-if="pacient.data.disps && pacient.data.disps.length">
              <NScrollbar class="max-h-[360px] px-4">
                <NListItem v-for="disp in pacient.data.disps" :key="disp.id">
                  <NTooltip>
                    {{ disp.main_diagnos.name }}
                    <template #trigger>
                      <NThing :title="`${format(new Date(disp.begin_at), 'dd.MM.yyyy')}`">
                        <template #header-extra>
                          <NButton secondary size="small" @click="showOlderDisp = true">
                            Подробнее
                          </NButton>
                        </template>
                      </NThing>
                    </template>
                  </NTooltip>
                </NListItem>
              </NScrollbar>
            </NList>
          </NCard>
          <!--          &lt;!&ndash;                <NList v-if="staff.integrations && staff.integrations.length"> &ndash;&gt; -->
          <!--          &lt;!&ndash;                  <NScrollbar class="max-h-[360px] px-4"> &ndash;&gt; -->
          <!--          &lt;!&ndash;                    <NListItem v-for="integrate in staff.integrations" :key="integrate.id"> &ndash;&gt; -->
          <!--          &lt;!&ndash;                      <NThing :title="integrate.name" content-style="margin-top: 10px;"> &ndash;&gt; -->
          <!--          &lt;!&ndash;                        <template #header-extra> &ndash;&gt; -->
          <!--          &lt;!&ndash;                          <NSpace> &ndash;&gt; -->
          <!--          &lt;!&ndash;                            <NButton v-if="integrate.link" text tag="a" :href="integrate.link" target="_blank"> &ndash;&gt; -->
          <!--          &lt;!&ndash;                              <template #icon> &ndash;&gt; -->
          <!--          &lt;!&ndash;                                <NIcon :size="20" :component="IconExternalLink" /> &ndash;&gt; -->
          <!--          &lt;!&ndash;                              </template> &ndash;&gt; -->
          <!--          &lt;!&ndash;                            </NButton> &ndash;&gt; -->
          <!--          &lt;!&ndash;                            <NButton text @click="handleEdit(integrate)"> &ndash;&gt; -->
          <!--          &lt;!&ndash;                              <template #icon> &ndash;&gt; -->
          <!--          &lt;!&ndash;                                <NIcon :size="20" :component="IconEdit" /> &ndash;&gt; -->
          <!--          &lt;!&ndash;                              </template> &ndash;&gt; -->
          <!--          &lt;!&ndash;                            </NButton> &ndash;&gt; -->
          <!--          &lt;!&ndash;                            <NButton text type="error" @click="removeIntegrate(staff.id, integrate.id)"> &ndash;&gt; -->
          <!--          &lt;!&ndash;                              <template #icon> &ndash;&gt; -->
          <!--          &lt;!&ndash;                                <NIcon :size="20" :component="IconTrash" /> &ndash;&gt; -->
          <!--          &lt;!&ndash;                              </template> &ndash;&gt; -->
          <!--          &lt;!&ndash;                            </NButton> &ndash;&gt; -->
          <!--          &lt;!&ndash;                          </NSpace> &ndash;&gt; -->
          <!--          &lt;!&ndash;                        </template> &ndash;&gt; -->
          <!--          &lt;!&ndash;                        <template #action> &ndash;&gt; -->
          <!--          &lt;!&ndash;                          <NSpace size="small"> &ndash;&gt; -->
          <!--          &lt;!&ndash;                            <NButton v-if="integrate.login" size="small" secondary @click="copyIntegratedValue(integrate.login)"> &ndash;&gt; -->
          <!--          &lt;!&ndash;                              Логин &ndash;&gt; -->
          <!--          &lt;!&ndash;                            </NButton> &ndash;&gt; -->
          <!--          &lt;!&ndash;                            <NButton v-if="integrate.password" size="small" secondary @click="copyIntegratedValue(integrate.password)"> &ndash;&gt; -->
          <!--          &lt;!&ndash;                              Пароль &ndash;&gt; -->
          <!--          &lt;!&ndash;                            </NButton> &ndash;&gt; -->
          <!--          &lt;!&ndash;                          </NSpace> &ndash;&gt; -->
          <!--          &lt;!&ndash;                        </template> &ndash;&gt; -->
          <!--          &lt;!&ndash;                      </NThing> &ndash;&gt; -->
          <!--          &lt;!&ndash;                    </NListItem> &ndash;&gt; -->
          <!--          &lt;!&ndash;                  </NScrollbar> &ndash;&gt; -->
          <!--          &lt;!&ndash;                </NList> &ndash;&gt; -->
          <!--          &lt;!&ndash;                <NEmpty v-else description="Учетные записи не найдены" class="py-4 pb-8"> &ndash;&gt; -->
          <!--          &lt;!&ndash;                  <template #extra> &ndash;&gt; -->
          <!--          &lt;!&ndash;                    <NButton secondary size="small" @click="showAddStaffIntegrate = true"> &ndash;&gt; -->
          <!--          &lt;!&ndash;                      Добавить новую запись &ndash;&gt; -->
          <!--          &lt;!&ndash;                    </NButton> &ndash;&gt; -->
          <!--          &lt;!&ndash;                  </template> &ndash;&gt; -->
          <!--          &lt;!&ndash;                </NEmpty> &ndash;&gt; -->
          <!--        </NCard> -->
          <NCard v-if="auth.isAdmin || auth.isOperator" title="Контрольные точки">
            <!--          <template #header-extra> -->
            <!--            <NButton text @click="showAddControlPoint = true"> -->
            <!--              <template #icon> -->
            <!--                <IconSquareRoundedPlus /> -->
            <!--              </template> -->
            <!--              Добавить -->
            <!--            </NButton> -->
            <!--          </template> -->
            <NList>
              <NScrollbar>
                <NListItem v-for="cp in pacient.data.disp.control_points" :key="cp.control_point.id" :style="`backgroundColor: ${cp.call != null ? '#7FE7C4' : ''}`">
                  <NGrid cols="2" class="px-4">
                    <NGridItem class="flex items-center">
                      <NText class="font-bold">
                        {{ cp.control_point.point }}
                      </NText>
                    </NGridItem>
                    <NGridItem align="end">
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

    <LazyModalsEditPacient v-model:show="showEdit" :pacient-id="pacient.data.id" />
    <LazyModalsShowOlderDisp v-model:show="showOlderDisp" :pacient-id="pacient.data.id" />
    <template v-if="showControlPoint">
      <ModalsControlPointCall v-model:show="showControlPoint" v-model:control-point-id="controlPointId" :refresh="refresh" />
    </template>
  </div>
<!--  <ModalsAddStaffIntegrate v-model:show="showAddStaffIntegrate" :staff-id="staff.id" @created-integrate="(value) => staff.integrations.push(value)" />
  <ModalsEditStaffIntegrate v-model:show="showEditStaffIntegrate" v-model:model="editIntegrate" :staff-id="staff.id" @updated-integrate="(value) => updateIntegrate(value)" />
  <ModalsEditStaff v-model:show="showEdit" v-model:model="staff" /> -->
</template>
