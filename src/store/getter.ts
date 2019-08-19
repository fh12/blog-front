let localUserInfo = sessionStorage.getItem("USER_INFO"); 
const getters = {
  userInfo: (state:any) => state.userInfo || (localUserInfo && JSON.parse(localUserInfo))
}

export default getters