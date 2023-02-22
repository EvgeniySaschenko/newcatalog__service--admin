<template lang="pug">
include /src/mixins.pug

// Диалоговое окно для редактирования / создания элемента рейтинга
el-dialog(fullscreen, :model-value='true', @closed='$emit("dialog:closed")')
  +b.app-dialog-site.container
    +e.H2.title {{ isModeEdit ? `${$t('Редактировать сайт')}: ${site.hostname}` : $t('Добавить сайт') }}
    +e.row-top(v-if='isModeEdit')
      el-button(
        type='primary',
        icon='el-icon-refresh',
        size='small',
        @click='provideEmitUpdateRatingItem()'
      ) {{ $t('Обновить') }}
    el-tabs(v-model='tabActive', type='border-card')
      // TAB - main
      el-tab-pane(:label='$t("Оисание")', name='main')
        tab-main(
          :ratingId='ratingId',
          :labels='labels',
          :site='site',
          :labelsIdsLimit='labelsIdsLimit',
          :isModeEdit='isModeEdit'
        )
      // TAB - screenshot
      el-tab-pane(:label='$t("Скриншот")', name='screenshot', v-if='isModeEdit')
        tab-screenshot(:site='site')
      // TAB - logo
      el-tab-pane(:label='$t("Логотип")', name='logo', v-if='isModeEdit')
        tab-logo(:site='site')
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LabelType, LangInit, RatingItemType } from '@/types';
import TabMain from './tab-main.vue';
import TabScreenshot from './tab-screenshot.vue';
import TabLogo from './tab-logo.vue';

export default defineComponent({
  emits: ['rating-item:update', 'dialog:closed'],
  provide() {
    return {
      provideEmitUpdateRatingItem: this.provideEmitUpdateRatingItem,
      provideEmitDialogClose: this.provideEmitDialogClose,
    };
  },
  computed: {
    isModeEdit(): boolean {
      return Object.keys(this.site)?.length ? true : false;
    },
  },
  data() {
    return {
      // Tab current
      tabActive: 'main',
    };
  },
  components: {
    TabMain,
    TabScreenshot,
    TabLogo,
  },

  props: {
    // List labels
    labels: {
      type: Array,
      default: () => [] as LabelType[],
    },

    // Current rating item
    site: {
      type: Object,
      default: () => {},
    },

    // Labels max count
    labelsIdsLimit: {
      type: Number,
    },

    // Only from add new sites
    ratingId: {
      type: Number,
    },
  },
  methods: {
    provideEmitUpdateRatingItem() {
      this.$emit('rating-item:update', {
        event: 'update',
        ratingItemId: this.site.ratingItemId,
      });
    },

    provideEmitDialogClose() {
      this.$emit('dialog:closed');
    },
  },
});
</script>

<style lang="sass" scoped>
.app-dialog-site
  &__row-top
    text-align: right
    margin-bottom: 10px
</style>
