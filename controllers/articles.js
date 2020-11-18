const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getArticles = (req, res, next) => {
  const ownerId = req.user._id;
  Article.AddOwnerId()
    .then((articles) => {
      const meArticles = articles.filter((article) => article.owner.equals(ownerId));

      const meArticlesNoOwner = meArticles.map((article) => {
        const articleObj = article.toObject();
        delete articleObj.owner;
        return articleObj;
      });

      res.send({ data: meArticlesNoOwner });
    })
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => res.send({ data: article }))
    .catch(next);
};

module.exports.delArticleById = (req, res, next) => {
  const { articleId } = req.params;
  Article.FindArticleById(articleId)
    .then((article) => {
      if (!article) throw new NotFoundError('Статья не найдена');
      if (!article.owner.equals(req.user._id)) throw new ForbiddenError('Вы не можете удалять чужую статью');
      Article.findByIdAndRemove(articleId)
        .then((articleToRemove) => {
          const articleToRemoveObj = articleToRemove.toObject();
          delete articleToRemoveObj.owner;
          return res.send({ data: articleToRemoveObj });
        });
    })
    .catch(next);
};
