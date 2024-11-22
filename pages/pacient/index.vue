<script setup lang="ts">
import { NButton, NFlex, NSpace, NText } from 'naive-ui'
import { IconSearch, IconSquareRoundedPlus } from '@tabler/icons-vue'
import { format } from 'date-fns'
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
      return 'bg-green-500'
    case 2:
    case 3:
      return 'bg-transparent'
  }
}

function getClassForRowControlOption(control_point_option_id) {
  switch (control_point_option_id) {
    case 2:
    case 3:
      return 'border-green-500'
    case 4:
      return 'border-yellow-500'
    case 5:
    case 6:
      return 'border-red-500'
    case 1:
      return 'border-black'
  }
}

const columns = ref([
  {
    title: 'ID',
    key: 'id',
    width: 40,
    fixed: 'left'
  },
  {
    title: 'Дата поступления',
    key: 'receipt_at',
    width: 120,
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
    key: 'ds',
  },
  {
    title: 'Диспансерное\nнаблюдение',
    width: 120,
    key: 'disp_status',
  },
  {
    title: 'Лекарственные\nпрепараты',
    width: 130,
    key: 'lek_pr_status',
  },
  {
    title: 'Дополнительное\nлечение',
    width: 140,
    key: 'dop_heal',
  },
  {
    title: '3-й день',
    key: 'day3',
    render(row) {
      return h(
        'div',
        {
          class: `border-4 rounded h-6 w-6 ${getClassForRowCallResult(row.control_points.day3.result_call_id)} ${getClassForRowControlOption(row.control_points.day3.control_point_option_id)}`
        },
      )
    }
  },
  {
    title: '1 мес',
    key: 'mes1',
    render(row) {
      return h(
        'div',
        {
          class: `border-4 rounded h-6 w-6 ${getClassForRowCallResult(row.control_points.mes1.result_call_id)} ${getClassForRowControlOption(row.control_points.mes1.control_point_option_id)}`
        },
      )
    }
  },
  {
    title: '3 мес',
    key: 'mes3',
    render(row) {
      return h(
        'div',
        {
          class: `border-4 rounded h-6 w-6 ${getClassForRowCallResult(row.control_points.mes3.result_call_id)} ${getClassForRowControlOption(row.control_points.mes3.control_point_option_id)}`
        },
      )
    }
  },
  {
    title: '6 мес',
    key: 'mes6',
    render(row) {
      return h(
        'div',
        {
          class: `border-4 rounded h-6 w-6 ${getClassForRowCallResult(row.control_points.mes6.result_call_id)} ${getClassForRowControlOption(row.control_points.mes6.control_point_option_id)}`
        },
      )
    }
  },
  {
    title: '12 мес',
    key: 'mes12',
    render(row) {
      return h(
        'div',
        {
          class: `border-4 rounded h-6 w-6 ${getClassForRowCallResult(row.control_points.mes12.result_call_id)} ${getClassForRowControlOption(row.control_points.mes12.control_point_option_id)}`
        },
      )
    }
  },
  {
    title: 'Номер телефона',
    width: 150,
    key: 'tel',
  },
])

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

function rowProps(row: RowData) {
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

definePageMeta({
  middleware: 'sanctum-auth'
})
</script>

<template>
  <div>
    <div class="flex flex-row justify-between items-center pb-5">
      <h1 class="text-2xl font-bold">
        Регистр ИБС и ОКС
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
      <NSpace vertical class="max-w-[520px]">
        <NFlex justify="space-between" align="center" />
        <n-input-group>
          <n-input v-model:value="searchPacientValue" :disabled="status === 'pending'" size="large" placeholder="Поиск по ФИО" @keydown.enter.prevent="searchPacient" />
          <NButton :disabled="status === 'pending'" size="large" secondary @click="searchPacient">
            <template #icon>
              <IconSearch />
            </template>
          </NButton>
        </n-input-group>
      </NSpace>

      <n-data-table
        remote
        :pagination="pagination"
        :loading="status === 'pending'"
        :row-props="rowProps"
        :row-key="rowKey"
        :min-height="650"
        :max-height="650"
        :columns="columns" :data="(data as responseData).data.pacients"
        :bordered="true"
        @update:sorter="handleSorterChange"
        @update:checked-row-keys="handleCheck"
      />
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
</style>
