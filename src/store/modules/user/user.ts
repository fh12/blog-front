import types from "../../types";
let user = {
  state: {
    userInfo: {}
  },
  mutations: {
    [types.SAVE_USER](state: any, userInfo: any) {
      state.userInfo = userInfo
      sessionStorage.setItem("USER_INFO", JSON.stringify(userInfo))
    },
    [types.LOG_OUT](state: any) {
      state.userInfo = {}
      sessionStorage.clear()
    }
  },
  actions: {}
};

export default user;
