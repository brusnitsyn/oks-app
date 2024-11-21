<script lang="ts" setup>
import { dateRuRU, ruRU } from 'naive-ui'

const defaultLang = ruRU
const defaultLangDate = dateRuRU

const themeConfig = ref({
  common: {
    primaryColor: '#EC6608',
    primaryColorHover: '#f3731a',
    primaryColorPressed: '#dd6918',
    primaryColorSuppl: '#cf5e0f'
  }
})
</script>

<template>
  <Html lang="ru">
    <Body>
      <NConfigProvider :theme-overrides="themeConfig" :locale="defaultLang" :date-locale="defaultLangDate">
        <NGlobalStyle />
        <NNotificationProvider>
          <NMessageProvider placement="top">
            <NLoadingBarProvider>
              <NaiveLoadingBar navigation />
            </NLoadingBarProvider>
            <NuxtLayout>
              <NuxtPage />
            </NuxtLayout>
            <naive-notification />
          </NMessageProvider>
        </NNotificationProvider>
      </NConfigProvider>
    </Body>
  </Html>
</template>
