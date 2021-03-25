/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
import * as brVue from 'bedrock-vue';
import Vue from 'vue';
import VueRouter from 'vue-router';

// FIXME: make configurable
Vue.config.devtools = true;

// install all plugins
Vue.use(brVue);

brVue.setRootVue(async () => {
  // load dynamic imports in parallel
  const [
    Quasar,
    Loading,
    {default: iconSet},
    {default: Vuelidate}
  ] = await Promise.all([
    import('quasar'),
    import('quasar'),
    import('quasar/icon-set/fontawesome-v5'),
    import('vuelidate')
  ]);

  // replace default `br-root` with a custom one
  // eslint-disable-next-line vue/component-definition-name-casing
  Vue.component('br-root', () => import('./BrRoot.vue'));

  // install all Vue plugins
  Vue.use(Vuelidate);

  const router = new VueRouter({
    mode: 'history',
    routes: [{
      path: '/',
      component: () => import('./Home.vue'),
      meta: {title: 'Bedrock PDF417 Scanner Test'}
    }]
  });

  // configure quasar
  Quasar.iconSet.set(iconSet);

  Vue.use(Quasar, {
    plugins: {
      Loading
    }
  });

  const BrApp = Vue.component('br-app');
  return new BrApp({
    router
  });
});
