<script setup lang="ts">
import { h } from 'vue'
import { NAvatar, NIcon, NText } from 'naive-ui'
import {
  IconChevronDown,
  IconLogout,
  IconUsers
} from '@tabler/icons-vue'
import { NuxtLink } from '#components'

const { user } = useSanctumAuth()
const route = useRoute()

const activeRoute = computed(() => {
  if (route.path.includes('/', 1)) { return route.path.substring(route.path.indexOf('/'), route.path.indexOf('/', 1)) }
  else { return route.path }
})

function renderMenuLabel(option: MenuOption) {
  if ('href' in option) {
    return h('a', { href: option.href, target: '_blank' }, [
      option.label as string
    ])
  }

  if ('to' in option) {
    return h(NuxtLink, { to: { name: option.to.name } }, [
      option.label as string
    ])
  }

  return option.label as string
}

function renderMenuIcon(option: MenuOption) {
  return h(NIcon, null, { default: () => h(option.icon) })
}

function expandIcon() {
  return h(NIcon, null, { default: () => h(IconChevronDown) })
}

const menuOptions = [
  {
    label: 'Пациенты',
    key: '/pacient',
    icon: IconUsers,
    to: {
      name: 'pacient'
    }
  },
  // {
  //   label: 'Доступы',
  //   key: '/access',
  //   icon: IconLockAccess,
  //   to: {
  //     name: 'certificates'
  //   }
  // },
]

function renderUserInfo() {
  return h(
    'div',
    {
      class: 'flex items-center py-1 px-4'
    },
    () => [
      h(NAvatar, {
        round: true,
        class: 'mr-3',
      }, { default: () => user.value.data.fio }),
      h('div', null, [
        h('div', null, [
          h(NText, { depth: 0 }, { default: () => user.value.fio })
        ]),
        h('div', null, [
          h(NText, { depth: 3 }, { default: () => user.value.login })
        ])
      ])
    ]
  )
}

const userOptions = [
  {
    key: 'user',
    type: 'render',
    render: renderUserInfo
  },
  {
    key: 'header-divider',
    type: 'divider'
  },
  {
    label: 'Выход из аккаунта',
    key: 'logout',
    icon: IconLogout
  }
]
</script>

<template>
  <NLayout class="h-screen max-h-screen">
    <NLayout has-sider class="h-full sticky left-0 bottom-0 top-0 z-40">
      <NLayoutSider
        collapse-mode="width"
        :collapsed-width="64"
        :width="260"
        content-class="flex flex-col"
      >
        <NFlex vertical justify="space-between" class="h-full">
          <NSpace vertical>
            <div class="pl-4 pr-8 pt-6">
              <NuxtLink :to="{ name: 'index' }">
                <NImage :preview-disabled="true" src="/logo.svg" />
              </NuxtLink>
            </div>
            <div class="px-2">
              <NButton quaternary class="!my-6 !py-2 !mb-4 !mt-4 !w-full !h-auto">
                <template #default>
                  <NFlex align="center" class="!-ml-16">
                    <NAvatar :size="48" circle>
                      {{ user.data.fio[0] }}
                    </NAvatar>
                    <NFlex vertical justify="center" :size="2">
                      <NText class="text-start font-semibold">
                        {{ user.data.fio }}
                      </NText>
                      <NText class="text-start">
                        {{ user.data.login }}
                      </NText>
                    </NFlex>
                  </NFlex>
                </template>
              </NButton>
            </div>
            <NMenu
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
              :render-label="renderMenuLabel"
              :render-icon="renderMenuIcon"
              :expand-icon="expandIcon"
              :default-value="activeRoute"
            />
          </NSpace>
<!--          <NSpace vertical class="p-8">-->
<!--            <NaiveColorModeSwitch :text="false" secondary icon-light="tabler:sun" icon-dark="tabler:moon" icon-system="tabler:device-desktop" />-->
<!--          </NSpace>-->
        </NFlex>
      </NLayoutSider>
      <div class="w-full mx-2 mr-4 pt-8 max-h-screen">
        <slot />
      </div>
    </NLayout>
  </NLayout>
</template>

<style scoped>

</style>
