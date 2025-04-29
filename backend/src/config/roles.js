const roleRights = new Map([
  ["user", ["createPost", "editPost", "deletePost", "createReview", "updateReview", "deleteReview","getUserPosts"]],
  ["admin", ["manageUsers", "manageReviews", "managePosts"]],
]);

module.exports = {
  roleRights,
};
