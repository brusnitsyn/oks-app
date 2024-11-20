<script setup lang="ts">
import { NButton, NDropdown, NFlex, NIcon, NText } from 'naive-ui'
import { IconDots, IconFileExcel, IconFileZip, IconSearch, IconSquareRoundedPlus } from '@tabler/icons-vue'
import { format, toDate } from 'date-fns'
import { changeColor } from 'seemly'
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

// function handleSelectedRowOption(key, option, row) {
//   console.log(row)
// }

const columns = ref([
  {
    title: 'ID',
    key: 'id',
    width: 30,
  },
  {
    title: 'Дата поступления',
    key: 'receipt_at',
    width: 80,
    render(row) {
      return h(
          NText,
          {},
          {
            default: () => row.receipt_at
          }
      )
    }
  },
  {
    title: 'ФИО',
    key: 'fio',
    width: 280,
    sorter: 'default',
    sortOrder: false,
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
  // {
  //   title: 'СНИЛС',
  //   key: 'snils',
  //   width: 120,
  //   sorter: 'default',
  //   sortOrder: false,
  // },
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
  //if (row.certificate.has_valid === false) { return { style: `background-color: ${changeColor(useThemeVars().value.errorColor, { alpha: 0.35 })} !important;` } }
  //if (row.certificate.has_request_new === true) { return { style: `background-color: ${changeColor(useThemeVars().value.warningColor, { alpha: 0.35 })} !important;` } }
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

definePageMeta({
  middleware: 'sanctum-auth'
})
</script>

<template>
  <div>
    <div class="flex flex-row justify-between items-center pb-5">
      <h1 class="text-2xl font-bold">
        Пациенты
      </h1>
      <NSpace>
        <NButton type="primary" @click="openDialog">
          <template #icon>
            <IconSquareRoundedPlus />
          </template>
          Добавить пациента
        </NButton>
      </NSpace>
    </div>

    <NSpace vertical>
      <NSpace vertical>
        <NFlex justify="space-between" align="center">
        </NFlex>
        <n-input-group>
          <n-input v-model:value="searchPacientValue" :disabled="status === 'pending'" size="large" placeholder="Значение поиска" @keydown.enter.prevent="searchPacient" />
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
        :bordered="true" @update:sorter="handleSorterChange"
        @update:checked-row-keys="handleCheck"
      />
    </NSpace>
  </div>
  <ModalsAddPacient v-model:show="hasOpenMultiAddDialog" :refresh="refresh" />
</template>

<style scoped>
:deep(.n-data-table-tr td) {
  @apply !bg-transparent;
}
</style>
