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
      // TAB - descr
      el-tab-pane(:label='$t("Description")', :name='TabsEnum.descr')
        tab-descr(:ratingId='ratingId', :labels='labels', :site='site', :isModeEdit='isModeEdit')
      // TAB - screenshot
      el-tab-pane(:label='$t("Screenshot")', :name='TabsEnum.screenshot', v-if='isModeEdit')
        tab-screenshot(:site='site')
      // TAB - logo
      el-tab-pane(:label='$t("Logo")', :name='TabsEnum.logo', v-if='isModeEdit')
        tab-logo(:site='site')
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LabelType, RatingItemType } from '@/types';
import TabDescr from './tab-descr.vue';
import TabScreenshot from './tab-screenshot.vue';
import TabLogo from './tab-logo.vue';

enum TabsEnum {
  descr = 'descr',
  screenshot = 'screenshot',
  logo = 'logo',
}
type TabsType = TabsEnum.descr | TabsEnum.screenshot | TabsEnum.logo;

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
      tabActive: TabsEnum.descr as TabsType,
      TabsEnum: TabsEnum,
    };
  },
  components: {
    TabDescr,
    TabScreenshot,
    TabLogo,
  },

  props: {
    // List labels
    labels: {
      type: Array as () => LabelType[],
      default: () => [],
    },

    // Current rating item
    site: {
      type: Object as () => RatingItemType,
      default: () => {},
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
