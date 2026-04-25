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
      :title='$t("A backup copy of the database and file storage will be created")',
      type='warning',
      show-icon,
      :closable='false'
    )
    el-descriptions(direction='vertical', :column='3', border, v-loading='isLoading')
      el-descriptions-item {{ $t('Create a backup copy and send it to the server') }}
      el-descriptions-item(align='center', width='100')
        el-tag(type='danger') {{ $t('Blocked').toUpperCase() }}
      el-descriptions-item(align='center', width='180')
        el-button(type='primary', @click='createBackup()') {{ $t('Create backup') }}


  .u-mb--10
    el-alert(
      :title='$t("Files and database will be restored from backup")',
      type='warning',
      show-icon,
      :closable='false'
    )
    el-descriptions(direction='vertical', :column='3', border, v-loading='isLoading')
      el-descriptions-item 
        el-form(label-position='top', v-loading='isLoading')
          el-form-item(:label='$t("Path to the folder on the remote server")', required, :error='errors.remoteDirPath')
            el-input(
              placeholder='/home/dir1/2026-04-19T09:34:08.879Z_2',
              v-model='remoteDirPath',
              style='width: 100%',
              autocomplete='on',
            )
        div {{ $t('The server will download a backup copy, after which the recovery process will start') }}
      el-descriptions-item(align='center', width='100')
        el-tag(type='danger') {{ $t('Blocked').toUpperCase() }}
      el-descriptions-item(align='center', width='180')
        el-button(type='primary', @click='restoreBackup()') {{ $t('Restore backup') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'tab-main',
  data() {
    return {
      // loading data
      isLoading: false,
      // path to the backup folder on the remote server
      remoteDirPath: '',
      errors: {
        remoteDirPath: '',
      },
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

    // Create backup
    async createBackup() {
      if (this.isLoading) return;
      await this.$utils.showDialogConfirm({
        title: this.$t('Run backup?'),
      });
      this.isLoading = true;

      try {
        let response = await this.$api['backups'].createBackup();

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('The backup process has started'),
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

    async restoreBackup() {
      if (this.isLoading) return;
      this.$utils.clearErrors(this.errors, this.errors);
      await this.$utils.showDialogConfirm({
        title: this.$t('Restore from backup?'),
      });
      this.isLoading = true;

      try {
        let response = await this.$api['backups'].restoreBackup({
          remoteDirPath: this.remoteDirPath,
        });

        if (response) {
          this.$utils.showMessageSuccess({
            message: this.$t('The restore process from backup has started'),
          });
          return;
        }

        throw { server: this.$t('Error while trying to restore') };
      } catch (errors: any) {
        let isValidationError = this.$utils.setErrors(this.errors, errors.errors);
        if (!isValidationError) {
          this.$utils.showMessageError({ message: errors.server, errors });
        }
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
