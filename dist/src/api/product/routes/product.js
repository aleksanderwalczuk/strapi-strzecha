"use strict";
/**
 * product router
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const defaultRouter = strapi_1.factories.createCoreRouter('api::product.product');
// const customRouter = (innerRouter, extraRoutes = []) => {
//   let routes;
//   return {
//     get prefix() {
//       return innerRouter.prefix;
//     },
//     get routes() {
//       if (!routes) routes = innerRouter.routes.concat(extraRoutes);
//       return routes;
//     },
//   };
// };
// const myExtraRoutes = [
//   {
//     method: "GET",
//     path: "/product/all/",
//     handler: "api::product.product.all",
//     config: {
//       auth: false,
//     },
//   },
// ];
exports.default = defaultRouter;
