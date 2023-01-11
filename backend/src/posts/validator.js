const postsSchema = {
  title: {
    in: ["body"],
    exists: {
      errorMessage: "Title is a mandatory field and needs to be a string!",
    },
  },
  author: {
    in: ["body"],
    exists: {
      errorMessage: "Category is a mandatory field and needs to be a string!",
    },
  },
};

export const checksPostsSchema = checkSchema(postsSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);

  console.log(errors.array());

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during post validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
