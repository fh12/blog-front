// url的链接
export const urls: object = {
  login: "user/login",
  logout: "logout",
  register: "user/register",
  getUser: "getUser",
  updateUser: "user/updateUser",

  addComment: "comment/add",
  getComments: "comment/list",
  addThirdComment: "addThirdComment",
  getCommentList: "getCommentList",

  getArticleList: "blog/list",
  likeArticle: "likeArticle",
  getArticleDetail: "blog/detail",

  getAdmin: "blog/list?isadmin=1",
  addNew: "blog/new",
  delBlog: "blog/del",
  updateBlog: "blog/update",
  addMessage: "addMessage",
  getMessageList: "getMessageList",
  getMessageDetail: "getMessageDetail",

  getLinkList: "getLinkList",

  getTagList: "getTagList",

  getCategoryList: "getCategoryList",

  getTimeAxisList: "getTimeAxisList",
  getTimeAxisDetail: "getTimeAxisDetail",

  getProjectList: "getProjectList",
  getProjectDetail: "getProjectDetail"
};

export default urls;
