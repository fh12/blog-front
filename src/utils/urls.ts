// url的链接
export const urls: object = {
  login: "user/login",
  logout: "logout",
  register: "user/register",
  updateUser: "user/updateUser",

  addComment: "comment/add",
  getComments: "comment/list",

  getArticleList: "blog/list",
  likeArticle: "blog/like",
  favorArticle: "blog/favor",
  getArticleDetail: "blog/detail",
  getUserFavor: "blog/favorList",

  getAdmin: "blog/list?isadmin=1",
  addNew: "blog/new",
  delBlog: "blog/del",
  updateBlog: "blog/update"
};

export default urls;
