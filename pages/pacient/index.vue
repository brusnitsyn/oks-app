<script setup lang="ts">
import { NButton, NFlex, NSpace, NText, NEllipsis } from 'naive-ui'
import { IconLayoutColumns, IconSearch, IconSquareRoundedPlus } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { useStorage } from '@vueuse/core'
import { definePageMeta } from '#imports'
import { AppLink } from '#components'

// function stylingRow(row: RowData) {
//   if (row.certificate.has_valid === false) { return 'has-no-valid' }
//   if (row.certificate.has_request_new === true) { return 'has-request' }
//   return 'has-valid'
// }

const staffPage = computed({
  get() {
    return useRoute().query.page ?? 1
  },
  set(page: number) {
    const query = {
      ...useRoute().query,
      page
    }
    useRouter().push({ name: useRoute().name, query })
  }
})

const selectSearchStaffOptions = [
  {
    label: 'ФИО',
    value: 'full_name'
  },
  {
    label: 'СНИЛС',
    value: 'snils'
  },
]

const selectedSearchStaffOption = computed({
  get() {
    return useRoute().query.search_from ? selectSearchStaffOptions.find(i => i.value === useRoute().query.search_from)?.value : selectSearchStaffOptions[0].value
  },
  set(search_from: string) {
    const query = {
      ...useRoute().query,
      search_from,
    }
    useRouter().push({ name: useRoute().name, query })
  }
})

const searchPacientValue = ref(useRoute().query.search_value ?? '')

const currentQuery = computed(() => new URLSearchParams(useRoute().query).toString())

const { $api } = useNuxtApp()
const { data, refresh, status } = await useAsyncData('pacient', () => $api(`/api/pacient?${currentQuery.value}`), {
  watch: [currentQuery]
})

interface responseData {
  persons: (Person[])[]
}

interface Day {
  control_point_option_id: number
  result_call_id: number
}

interface Person {
  id: number
  fio: string
  snils: string
  birth_at: string
  receipt_at: string
}

const rowOptions = ref([
  {
    label: 'Удалить',
    key: 'delete',
    onClick: async (row) => {
      const { status } = await useAPI(`/api/staff/${row.id}`, {
        method: 'DELETE',
      })

      // eslint-disable-next-line style/max-statements-per-line
      if (status.value === 'success') { await refresh() }
    }
  },
])

function getClassForRowCallResult(result_call_id) {
  switch (result_call_id) {
    case 1:
      return 'bg-green-300 mx-3'
    case 2:
    case 3:
      return 'bg-transparent mx-3'
  }
}

function getClassForRowControlOption(control_point_option_id) {
  switch (control_point_option_id) {
    case 2:
    case 3:
      return 'border-green-300'
    case 4:
      return 'border-cyan-500'
    case 5:
    case 6:
      return 'border-red-700'
    case 1:
      return 'border-black'
    case null:
      return 'border-transparent'
  }
}
const settingColumns = ref([
  {
    label: '№ п/п',
    value: 'id'
  },
  {
    label: 'Дата поступления',
    value: 'receipt_at',
  },
  {
    label: 'ФИО',
    value: 'fio',
  },
  {
    label: 'Дата рождения',
    value: 'birth_at',
  },
  {
    label: 'Диагноз',
    value: 'ds',
  },
  {
    label: 'Диспансерное наблюдение',
    value: 'disp_status',
  },
  {
    label: 'Лекарственные препараты',
    value: 'lek_pr_status',
  },
  {
    label: 'Дополнительное лечение',
    value: 'dop_heal',
  },
  {
    label: '3-й день',
    value: 'day3',
  },
  {
    label: '1 мес',
    value: 'mes1',
  },
  {
    label: '3 мес',
    value: 'mes3',
  },
  {
    label: '6 мес',
    value: 'mes6',
  },
  {
    label: '12 мес',
    value: 'mes12',
  },
  {
    label: 'Номер телефона',
    value: 'tel',
  },
])
const defaultColumns = ref([
  {
    title: '№\nп/п',
    key: 'id',
    width: 50,
    align: 'center'
  },
  {
    title: 'Дата поступления',
    key: 'receipt_at',
    width: 120,
    align: 'center',
    render(row) {
      return h(
        NText,
        {},
        {
          default: () => format(new Date(row.receipt_at), 'dd.MM.yyyy')
        }
      )
    }
  },
  {
    title: 'ФИО',
    key: 'fio',
    sorter: 'default',
    sortOrder: false,
    width: 280,
    align: 'center',
    fixed: 'left',
    render(row) {
      return h(
        AppLink,
        {
          to: { name: 'pacient-id', params: { id: row.id } },
        },
        {
          default: () => row.fio,
        }
      )
    }
  },
  {
    title: 'Дата рождения',
    key: 'birth_at',
    align: 'center',
    render(row) {
      return h(
        NText,
        {},
        {
          default: () => format(new Date(row.birth_at), 'dd.MM.yyyy')
        }
      )
    }
  },
  {
    title: 'Диагноз',
    width: 80,
    align: 'center',
    key: 'ds',
  },
  {
    title: 'Диспансерное\nнаблюдение',
    width: 120,
    align: 'center',
    key: 'disp_status',
  },
  {
    title: 'Лекарственные\nпрепараты',
    width: 130,
    align: 'center',
    key: 'lek_pr_status',
  },
  {
    title: 'Дополнительное\nлечение',
    width: 140,
    align: 'center',
    key: 'dop_heal',
    render(row) {
      return h(
        NEllipsis,
        {},
        {
          default: () => row.dop_heal
        }
      )
    }
  },
  {
    title: '3-й день',
    key: 'day3',
    align: 'center',
    className: 'relative day3',
    // cellProps: (row, index) => customCellProps(row, index)
    render(row) {
      return h(
        'div',
        {
          class: `rounded m-1 flex flex-col justify-center items-center border-4  absolute inset-0 ${getClassForRowCallResult(row.control_points.day3.result_call_id)} ${getClassForRowControlOption(row.control_points.day3.control_point_option_id)}`
        },
        {
          default: () => row.control_points.day3.result_call_id === 1 ? '' : format(new Date(row.control_points.day3.control_at), 'dd.MM.yy')
        }
      )
    }
  },
  {
    title: '1 мес',
    key: 'mes1',
    align: 'center',
    className: 'relative mes1',
    // cellProps: (row, index) => customCellProps(row, index)
    render(row) {
      return h(
        'div',
        {
          class: `rounded m-1 flex flex-col justify-center items-center border-4  absolute inset-0 ${getClassForRowCallResult(row.control_points.mes1.result_call_id)} ${getClassForRowControlOption(row.control_points.mes1.control_point_option_id)}`
        },
        {
          default: () => row.control_points.mes1.result_call_id === 1 ? '' : format(new Date(row.control_points.mes1.control_at), 'dd.MM.yy')
        }
      )
    }
  },
  {
    title: '3 мес',
    key: 'mes3',
    className: 'relative mes3',
    align: 'center',
    // cellProps: (row, index) => customCellProps(row, index)
    render(row) {
      return h(
        'div',
        {
          class: `rounded m-1 flex flex-col justify-center items-center border-4  absolute inset-0 ${getClassForRowCallResult(row.control_points.mes3.result_call_id)} ${getClassForRowControlOption(row.control_points.mes3.control_point_option_id)}`
        },
        {
          default: () => row.control_points.mes3.result_call_id === 1 ? '' : format(new Date(row.control_points.mes3.control_at), 'dd.MM.yy')
        }
      )
    }
  },
  {
    title: '6 мес',
    key: 'mes6',
    className: 'relative mes6',
    align: 'center',
    // cellProps: (row, index) => customCellProps(row, index)
    render(row) {
      return h(
        'div',
        {
          class: `rounded m-1 flex flex-col justify-center items-center border-4  absolute inset-0 ${getClassForRowCallResult(row.control_points.mes6.result_call_id)} ${getClassForRowControlOption(row.control_points.mes6.control_point_option_id)}`
        },
        {
          default: () => row.control_points.mes6.result_call_id === 1 ? '' : format(new Date(row.control_points.mes6.control_at), 'dd.MM.yy')
        }
      )
    }
  },
  {
    title: '12 мес',
    key: 'mes12',
    className: 'relative mes12',
    align: 'center',
    // cellProps: (row, index) => customCellProps(row, index)
    render(row) {
      return h(
        'div',
        {
          class: `rounded m-1 flex flex-col justify-center items-center border-4 absolute inset-0 ${getClassForRowCallResult(row.control_points.mes12.result_call_id)} ${getClassForRowControlOption(row.control_points.mes12.control_point_option_id)}`
        },
        {
          default: () => row.control_points.mes12.result_call_id === 1 ? '' : format(new Date(row.control_points.mes12.control_at), 'dd.MM.yy')
        }
      )
    }
  },
  {
    title: 'Номер телефона',
    width: 150,
    align: 'center',
    key: 'tel',
  },
])
const templateSort = settingColumns.value.map(itm => itm.value)
const storageActiveCols = useStorage('pacient-table-active-cols', templateSort)
const showColumns = ref([
  'id',
  'receipt_at',
  'fio',
  'birth_at',
  'ds',
  'disp_status',
  'lek_pr_status',
  'dop_heal',
  'day3',
  'mes1',
  'mes3',
  'mes6',
  'mes12',
  'tel',
])

const columns = ref([])

for (const col in storageActiveCols.value) {
  columns.value.push(defaultColumns.value.find(itm => itm.key === storageActiveCols.value[col]))
}

watch(storageActiveCols, (newValue) => {
  for (const col in newValue) {
    columns.value.push(defaultColumns.value.find(itm => itm.key === storageActiveCols.value[col]))
  }
})

// console.log(storageActiveCols.value)

function rowClassName(row: Person) {
  if (row.control_points.day3.control_point_option_id === null
    || row.control_points.mes1.control_point_option_id === null
    || row.control_points.mes3.control_point_option_id === null
    || row.control_points.mes6.control_point_option_id === null
    || row.control_points.mes12.control_point_option_id === null
  ) {
    return 'no-response'
  }
}

function handleSorterChange(sorter) {
  columns.value.forEach((column) => {
    if (column.sortOrder === undefined) { return }
    if (!sorter) {
      column.sortOrder = false
      return
    }
    if (column.key === sorter.columnKey) {
      column.sortOrder = sorter.order
      useRouter().push({ name: useRoute().name, query: { ...useRoute().query, sort_column: sorter.columnKey, sort_direction: sorter.order } })
    }
    else { column.sortOrder = false }
  })
}

const hasOpenMultiAddDialog = ref(false)
function openDialog() {
  hasOpenMultiAddDialog.value = true
}

const pagination = computed(() => {
  return {
    page: data.value.meta.current_page,
    pageSize: data.value.meta.per_page,
    pageCount: data.value.meta.last_page,
    itemCount: data.value.meta.total,
    onChange: (page: number) => {
      staffPage.value = page
      pagination.value.page = page
    },
    prefix({ itemCount }) {
      return `Кол-во пациентов: ${itemCount}`
    }
  }
})

async function searchPacient() {
  if (searchPacientValue.value.length === 0) {
    const query = {
      ...useRoute().query,
      page: 1,
    }
    await useRouter().push({ name: useRoute().name, query })
  }
  const query = {
    ...useRoute().query,
    search_value: searchPacientValue.value
  }
  await useRouter().push({ name: useRoute().name, query })

  await refresh()
}

function rowProps(row: Person) {
  if (row.disp_status_id === 2) { return { class: '!bg-gray-200' } }
  // console.log(row)
  // if (row.certificate.has_valid === false) { return { style: `background-color: ${changeColor(useThemeVars().value.errorColor, { alpha: 0.35 })} !important;` } }
  // if (row.certificate.has_request_new === true) { return { style: `background-color: ${changeColor(useThemeVars().value.warningColor, { alpha: 0.35 })} !important;` } }
  return { }
}

function rowKey(row) {
  return row.id
}

const checkedRows = ref([])

function handleCheck(rowKeys) {
  checkedRows.value = rowKeys
}

async function downloadExcel() {
  status.value = 'pending'

  const { data: downloadData, status: downloadStatus } = await useAPI('/api/staff/export', {
    method: 'GET',
    query: {
      valid_type: useRoute().query.valid_type ?? null
    }
  })

  if (downloadStatus.value === 'success') {
    const file = window.URL.createObjectURL(downloadData.value)
    window.location.assign(file)
  }

  status.value = downloadStatus.value
}

const auth = useSanctumAuth()

function updateColumns(value: [], option) {
  columns.value = []
  const templateSort = settingColumns.value.map(itm => itm.value)
  const sortedCols = value.sort((a, b) => templateSort.indexOf(a) - templateSort.indexOf(b))

  storageActiveCols.value = sortedCols
}

definePageMeta({
  middleware: 'sanctum-auth'
})

useSeoMeta({
  title: 'Регистр пациентов с ОКС',
  ogTitle: 'Регистр пациентов с ОКС',
  description: 'Регистр пациентов с ОКС Амурской областной клинической больницы.',
  ogDescription: 'Регистр пациентов с ОКС Амурской областной клинической больницы.',
  ogImage: '/i.webp',
  twitterCard: 'summary',
})
</script>

<template>
  <div>
    <div class="flex flex-row justify-between items-center pb-5">
      <h1 class="text-2xl font-bold">
        Регистр пациентов с ОКС
      </h1>
      <NSpace>
        <NButton v-if="auth.isAdmin || auth.isDoctor" type="primary" @click="openDialog">
          <template #icon>
            <IconSquareRoundedPlus />
          </template>
          Добавить пациента
        </NButton>
      </NSpace>
    </div>

    <NSpace vertical>
      <NSpace vertical>
        <NFlex justify="space-between" />
        <NFlex justify="space-between" align="center">
          <n-input-group class="max-w-[520px]">
            <n-input v-model:value="searchPacientValue" :disabled="status === 'pending'" size="large" placeholder="Поиск по ФИО" @keydown.enter.prevent="searchPacient" />
            <NButton :disabled="status === 'pending'" size="large" secondary @click="searchPacient">
              <template #icon>
                <IconSearch />
              </template>
            </NButton>
          </n-input-group>
          <NPopselect v-model:value="storageActiveCols" scrollable multiple :options="settingColumns" @update:value="(value, option) => updateColumns(value, option)">
            <NButton strong secondary>
              <template #icon>
                <NIcon :component="IconLayoutColumns" />
              </template>
              Отображение столбцов
            </NButton>
          </NPopselect>
        </NFlex>
      </NSpace>

      <ClientOnly>
        <NDataTable
          remote
          :single-line="false"
          :pagination="pagination"
          :loading="status === 'pending'"
          :row-props="rowProps"
          :row-key="rowKey"
          :min-height="650"
          :max-height="650"
          :row-class-name="rowClassName"
          :columns="columns" :data="(data as responseData).data.pacients"
          @update:sorter="handleSorterChange"
          @update:checked-row-keys="handleCheck"
        />
      </ClientOnly>
    </NSpace>
  </div>
  <ModalsAddPacient v-model:show="hasOpenMultiAddDialog" :refresh="refresh" />
</template>

<style scoped>
:deep(.n-data-table-th__title) {
 @apply leading-[18px];
}
:deep(.n-data-table-tr) {
  @apply leading-[18px];
}
:deep(.n-data-table .n-data-table-table) {
  @apply !break-normal;
}
:deep(.n-data-table-td.day3) {
  @apply !p-0;
}
:deep(.n-data-table-td.mes1) {
  @apply !p-0;
}
:deep(.n-data-table-td.mes3) {
  @apply !p-0;
}
:deep(.n-data-table-td.mes6) {
  @apply !p-0;
}
:deep(.n-data-table-td.mes12) {
  @apply !p-0;
}
:deep(.n-data-table .n-data-table-td) {
  @apply !bg-transparent;
}
:deep(.n-data-table-base-table-body) {
  @apply bg-white;
}
</style>
