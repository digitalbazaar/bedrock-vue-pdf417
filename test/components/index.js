/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as brQuasar from '@bedrock/quasar';
import * as brVue from '@bedrock/vue';
import App from './App.vue';
import {createRouter, createWebHistory} from 'vue-router';
import {default as iconSet} from 'quasar/icon-set/fontawesome-v5.js';
import Quasar from 'quasar';
import '@bedrock/web-fontawesome';

brVue.initialize({
  async beforeMount({app}) {
    // initialize br-quasar
    await brQuasar.initialize({app});

    // configure quasar
    Quasar.iconSet.set(iconSet);

    const router = createRouter({
      history: createWebHistory(),
      routes: [{
        path: '/',
        component: () => import('./HomePage.vue'),
        meta: {title: 'Bedrock PDF417 Scanner Test'}
      }]
    });
    app.use(router);

    // return root Vue component
    return App;
  }
});
