'use strict';

const _ = require('lodash');
const factory = require('midwest/factories/rest');
const formatQuery = require('midwest/factories/format-query');
const paginate = require('midwest/factories/paginate');
const resolveCache = require('../resolve-cache');

module.exports = _.memoize((config) => {
  const handlers = require('./handlers')(config);

  const mw = factory({
    plural: 'admissions',
    handlers,
  });

  return Object.assign({}, mw, {
    async create(req, res, next) {
      const user = await req.user;

      Object.assign(req.body, {
        createdById: user && user.id,
      });

      mw.create(req, res, next);
    },
    formatQuery: formatQuery(['limit', 'sort', 'page']),
    paginate: paginate(handlers.count, 20),
  });
}, resolveCache);