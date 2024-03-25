const express = require('express');
const authRoute = require('./auth.route');
const trendingRoute = require('./trending.route');
const mintingRoute = require('./minting.route');
const collectionRoute = require('./collection.route');
const labelsRoute = require('./labels.route');
const alertsRoute = require('./alerts.route');
const docsRoute = require('./docs.route');
const waitlistRoute = require('./waitlist.route');
const poolsRoute = require('./pools.route');
const searchRoute = require('./search.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/trending',
    route: trendingRoute,
  },
  {
    path: '/minting',
    route: mintingRoute,
  },
  {
    path: '/collection',
    route: collectionRoute,
  },
  {
    path: '/labels',
    route: labelsRoute,
  },
  {
    path: '/alerts',
    route: alertsRoute,
  },
  {
    path: '/waitlist',
    route: waitlistRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },
  {
    path: '/pools',
    route: poolsRoute,
  },
  {
    path: '/search',
    route: searchRoute,
  },
];

const devRoutes = [];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
