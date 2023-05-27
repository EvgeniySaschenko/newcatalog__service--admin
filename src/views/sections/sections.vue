<template lang="pug">
include /src/mixins.pug
+b.page--sections.container(v-loading='isLoading')
  +e.H1.title {{ $t($route.name) }}
  // Add
  el-button(type='primary', @click='toggleDialogSection(true, {})') {{ $t('Add a Section') }}

  // Sections list
  el-table(:data='sections', stripe, :scrollbar-always-on='true')
    // id
    el-table-column(label='#', type='index')

    el-table-column(:label='$t("Name")')
      template(#default='scope')
        div {{ scope.row.name[$langDefault('site')] }}

    el-table-column(:label='$t("Priority")', width='130')
      template(#default='scope')
        .u-text-center {{ scope.row.priority }}

    el-table-column(:label='$t("Hidden")', width='130')
      template(#default='scope')
        .u-text-center
          el-tag(v-if='scope.row.isHiden', type='info', effect='dark') {{ $t('Hidden') }}

    el-table-column(:label='$t("Date create")', width='150')
      template(#default='scope')
        .u-text-center {{ $utils.date(scope.row.dateCreate) }}

    el-table-column(:label='$t("Edit")', width='150')
      template(#default='scope')
        el-button(type='primary', @click='toggleDialogSection(true, scope.row)') {{ $t('Edit') }}

dialog-section(
  :sectionCurrent='sectionCurrent',
  v-if='isDialogSection',
  @section:update='getSections($event)',
  @dialog:closed='toggleDialogSection(false, {})'
)
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SectionType } from '@/types';
import useStoreSections from '@/store/sections';
import DialogSection from './dialog-section.vue';

export default defineComponent({
  name: 'page-sections',
  data() {
    return {
      // Loading data
      isLoading: false,
      // List sections
      sections: [] as SectionType[],
      // Section current
      sectionCurrent: {},
      // Is sohow dialog
      isDialogSection: false,
    };
  },

  created() {
    this.getSections();
  },

  components: {
    DialogSection,
  },

  methods: {
    // Get sections
    async getSections() {
      this.isLoading = true;
      try {
        let sections = await this.$api['sections'].getSections();
        let store = useStoreSections();
        store.setSections(sections);
        this.sections = sections;
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Show / hidden dialog section
    toggleDialogSection(isDialogSection: boolean, section: SectionType) {
      this.sectionCurrent = section;
      this.isDialogSection = isDialogSection;
    },
  },
});
</script>

<style lang="sass" scoped></style>
