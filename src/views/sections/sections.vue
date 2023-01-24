<template lang="pug">
include /src/mixins.pug
+b.page--sections
  +e.H1.title {{ $route.name }}
  // Добавить
  el-form
    el-table(:data='[1]')
      el-table-column
        template(#default='scope')
          el-form-item(:error='errors.add.name', required)
            el-input(v-model='nameNewSection.ua', placeholder='Название ua') 
            el-input(v-model='nameNewSection.ru', placeholder='Название ru') 

      el-table-column(width='200')
        template(#default='scope')
          el-form-item
            el-button(type='primary', @click='createSection()', :loading='isSending') Добавить раздел

    el-alert(v-if='success.add', :title='success.add', type='success')
    el-alert(v-if='errors.add.server', :title='errors.add.server', type='error')

  // Редактировать
  el-form
    el-alert(v-if='success.edit', :title='success.edit', type='success')
    el-alert(v-if='success.delete', :title='success.delete', type='success') 
    el-alert(v-if='errors.edit.server', :title='errors.edit.server', type='error') 
    el-alert(v-if='errors.delete.server', :title='errors.delete.server', type='error') 
    el-table(:data='items', stripe)
      el-table-column(label='Название')
        template(#default='scope')
          el-form-item(:error='errors.edit[`${scope.row.id}_name`]', required)
            el-input(v-model='scope.row.name.ua', size='small', placeholder='Название ua') 
            el-input(v-model='scope.row.name.ru', size='small', placeholder='Название ru') 

      el-table-column(label='Приоритет', width='150')
        template(#default='scope')
          el-form-item
            el-input-number(v-model='scope.row.priority', size='small', placeholder='Приоритет') 

      el-table-column(label='Скрыть', width='90')
        template(#default='scope')
          el-form-item
            el-checkbox(v-model='scope.row.isHiden')

      el-table-column(label='Редактировать', width='150')
        template(#default='scope')
          el-form-item(:error='errors.edit[`${scope.row.id}_server`]')
            el-button(
              type='primary',
              size='small',
              @click='editSection(scope.row)',
              :loading='isSending'
            ) Редактировать

      el-table-column(label='Удалить', width='150')
        template(#default='scope')
          el-form-item(:error='errors.delete[`${scope.row.id}_server`]')
            el-button(
              type='danger',
              size='small',
              @click='deleteSection(scope.row.id)',
              :loading='isSending'
            ) Удалить
</template>

<script>
export default {
  name: 'page-sections',
  data() {
    return {
      isSending: false,
      // Список разделов
      items: [],
      // Название нового раздела
      nameNewSection: {},
      // При успешном добавлении
      success: {
        add: '',
        delete: '',
        edit: '',
      },
      // При ошибке
      errors: {
        add: {},
        delete: {},
        edit: {},
      },
    };
  },
  watch: {
    sections: {
      deep: true,
      immediate: true,
      handler() {
        this.setState();
      },
    },
  },
  computed: {
    sections() {
      return this.$store.state.sections.items || [];
    },
  },
  methods: {
    // Установка state
    setState() {
      this.items = this.sections.map((el) => {
        return { ...el };
      });
    },
    // Очистка сообщений
    clearMessages() {
      for (let key in this.success) {
        this.success[key] = '';
      }
      for (let key in this.errors) {
        this.errors[key] = {};
      }
    },
    // Добавить ошибки
    setErrors(errors, id, type = '') {
      // Если это ошибка, а не объект
      if (errors instanceof Error) {
        this.errors[type].server = 'Ошибка сервера';
        return;
      }

      for (let item in errors) {
        this.errors[type][`${id}_${item}`] = errors[item];
      }
    },
    // Создать раздел
    async createSection() {
      if (this.isSending) return;
      this.clearMessages();
      this.isSending = true;
      this.$store
        .dispatch('sections/createSection', this.nameNewSection)
        .then(() => {
          this.success.add = 'Раздел создан';
          this.nameNewSection = {};
        })
        .catch((errors) => {
          Object.assign(this.errors.add, errors);
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    // Удалить раздел
    async deleteSection(id) {
      if (this.isSending) return;
      this.clearMessages();
      this.isSending = true;
      this.$store
        .dispatch('sections/deleteSection', id)
        .then(() => {
          this.success.delete = 'Раздел удалён';
        })
        .catch((errors) => {
          this.setErrors(errors, id, 'delete');
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    // Редактировать раздел
    async editSection(data) {
      if (this.isSending) return;
      this.clearMessages();
      this.isSending = true;
      this.$store
        .dispatch('sections/editSection', data)
        .then(() => {
          this.success.edit = 'Раздел отредактирован';
        })
        .catch((errors) => {
          this.setErrors(errors, data.id, 'edit');
        })
        .finally(() => {
          this.isSending = false;
        });
    },
  },
};
</script>

<style lang="sass" scoped></style>
