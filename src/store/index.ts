import Vue from "vue";
import Vuex from "vuex";
import * as types from "./types";
import user from "./modules/user/user";
import getters from "./getter"

Vue.use(Vuex);
const initPageState = () => {
  return {};
};
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  modules: {
    user
  },
  state: initPageState(),
  mutations: {},
  actions: {},
  getters
});

export default store;
