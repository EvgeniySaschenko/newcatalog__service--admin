<template lang="pug">
include /src/mixins.pug
+b.tab-main
  .u-mb--10
    el-tag.u-mr--10(type='danger') {{ $t('Blocked').toUpperCase() }}
    span - {{ $t('During the execution of the operation, the API service will not process requests') }}

  .u-mb--10
    el-alert(
      :title='$t("Creating / deleting a cache implies that these changes will be published on the main website")',
      type='warning',
      show-icon,
      :closable='false'
    )
  .u-mb--10
    el-descriptions(direction='vertical', :column='3', border, v-loading='isLoading')
      //
      el-descriptions-item {{ $t('Create cache settings') }}
      el-descriptions-item(align='center', width='100')
      el-descriptions-item(align='center', width='180')
        el-button(type='primary', @click='createCacheSettings()') {{ $t('Create cache') }}
      //
      el-descriptions-item {{ $t('Create cache sections') }}
      el-descriptions-item(align='center', width='100')
      el-descriptions-item(align='center', width='180')
        el-button(type='primary', @click='createCacheSections()') {{ $t('Create cache') }}
      //
      el-descriptions-item {{ $t('Rebuild all cache') }}
      el-descriptions-item(align='center', width='100')
        el-tag(type='danger') {{ $t('Blocked').toUpperCase() }}
      el-descriptions-item(align='center')
        el-button(type='primary', @click='resetCacheAll()') {{ $t('Create cache') }}
      //
      el-descriptions-item {{ $t('Delete all cache') }}
      el-descriptions-item(align='center', width='100')
        el-tag(type='danger') {{ $t('Blocked').toUpperCase() }}
      el-descriptions-item(align='center')
        el-button(type='danger', @click='clearCacheAll()') {{ $t('Delete cache') }}
      //
      el-descriptions-item {{ $t('Restart screenshots process create') }}
      el-descriptions-item(align='center', width='100')
      el-descriptions-item(align='center')
        el-button(type='warning', @click='restartScreenshotsProcess()') {{ $t('Restart') }}
      //
      el-descriptions-item {{ $t('Restart the process of getting site information') }}
      el-descriptions-item(align='center', width='100')
      el-descriptions-item(align='center')
        el-button(type='warning', @click='restartSitesProcess()') {{ $t('Restart') }}

  .u-mb--10
    el-alert(
      :title='$t("A backup will be created for: database, images and whois")',
      type='warning',
      show-icon,
      :closable='false'
    )
    el-descriptions(direction='vertical', :column='3', border, v-loading='isLoading')
      el-descriptions-item {{ $t('Run backup') }}
      el-descriptions-item(align='center', width='100')
        el-tag(type='danger') {{ $t('Blocked').toUpperCase() }}
      el-descriptions-item(align='center', width='180')
        el-button(type='primary', @click='runBackup()') {{ $t('Create backup') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'tab-main',
  data() {
    return {
      // loading data
      isLoading: false,
    };
  },

  methods: {
    // Delete cache all
    async clearCacheAll() {
      if (this.isLoading) return;
      await this.$utils.showDialogConfirm({
        title: this.$t('Delete all cache?'),
      });
      this.isLoading = true;

      try {
        let response = await this.$api['cache'].clearCacheAll();

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Cache deleted'),
          });
          return;
        }

        throw { server: this.$t('There were errors while creating the cache') };
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Reset cache
    async resetCacheAll() {
      if (this.isLoading) return;
      await this.$utils.showDialogConfirm({
        title: this.$t('Rebuild all cache?'),
      });
      this.isLoading = true;

      try {
        let response = await this.$api['cache'].resetCacheAll();

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Cache created'),
          });
          return;
        }

        throw { server: this.$t('There were errors while creating the cache') };
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Create cache sections
    async createCacheSections() {
      if (this.isLoading) return;
      await this.$utils.showDialogConfirm({
        title: this.$t('Create cache for sections?'),
      });
      this.isLoading = true;

      try {
        let response = await this.$api['cache'].createCacheSections();

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Cache created'),
          });
          return;
        }

        throw { server: this.$t('There were errors while creating the cache') };
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Create cache settings
    async createCacheSettings() {
      if (this.isLoading) return;
      await this.$utils.showDialogConfirm({
        title: this.$t(`Create cache "settings" for website?`),
      });
      this.isLoading = true;

      try {
        let response = await this.$api['cache'].createCacheSettings();

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Cache created'),
          });
          return;
        }

        throw { server: this.$t('There were errors while creating the cache') };
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Run backup
    async runBackup() {
      if (this.isLoading) return;
      await this.$utils.showDialogConfirm({
        title: this.$t('Run backup?'),
      });
      this.isLoading = true;

      try {
        let response = await this.$api['backups'].runBackup();

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Started sending files to a remote server'),
          });
          return;
        }

        throw { server: this.$t('Errors occurred while creating a backup') };
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Restart screenshots process
    async restartScreenshotsProcess() {
      if (this.isLoading) return;
      await this.$utils.showDialogConfirm({
        title: this.$t('Restart screenshots process create?'),
      });
      this.isLoading = true;

      try {
        let response = await this.$api['sites'].restartScreenshotsProcess();

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Restarted'),
          });
          return;
        }
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },

    // Restart sites process
    async restartSitesProcess() {
      if (this.isLoading) return;
      await this.$utils.showDialogConfirm({
        title: this.$t('Restart the process of getting site information?'),
      });
      this.isLoading = true;

      try {
        let response = await this.$api['sites'].restartSitesProcess();

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('Restarted'),
          });
          return;
        }
      } catch (errors: any) {
        this.$utils.showMessageError({ message: errors.server, errors });
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<style lang="sass" scoped></style>
