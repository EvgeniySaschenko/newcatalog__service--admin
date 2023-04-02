<template lang="pug">
include /src/mixins.pug

// Dialog box for editing / creating a rating element
el-dialog(fullscreen, :model-value='true', @closed='$emit("dialog:closed")')
  +b.app-dialog-site.container
    +e.H2.title {{ isModeEdit ? `${$t('Edit site')}: ${site.hostname}` : $t('Add site') }}
    +e.row-top(v-if='isModeEdit')
      el-button(
        type='primary',
        icon='el-icon-refresh',
        size='small',
        @click='provideEmitUpdateRatingItem()'
      ) {{ $t('Update') }}
    el-tabs(v-model='tabActive', type='border-card')
      // TAB - main
      el-tab-pane(:label='$t("Description")', name='main')
        tab-main(
          :ratingId='ratingId',
          :labels='labels',
          :site='site',
          :labelsIdsLimit='labelsIdsLimit',
          :isModeEdit='isModeEdit'
        )
      // TAB - screenshot
      el-tab-pane(:label='$t("Screenshot")', name='screenshot', v-if='isModeEdit')
        tab-screenshot(:site='site')
      // TAB - logo
      el-tab-pane(:label='$t("Logo")', name='logo', v-if='isModeEdit')
        tab-logo(:site='site')
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LabelType } from '@/types';
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
