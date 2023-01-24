// vuex-shim.d.ts

import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex';

declare module '@vue/runtime-core' {
  // Declare your own store states.
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface State {}

  interface ComponentCustomProperties {
    $store: Store<any>;
  }
}
