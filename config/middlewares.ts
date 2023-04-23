export default ({ env }) => [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'strapi.io',
            "blob:",
            "dl.airtable.com",
            `${env('AWS_BUCKET')}.s3.${env('AWS_REGION')}.amazonaws.com`,
            `https://s3.${env("AWS_REGION")}.amazonaws.com/${env(
              "AWS_BUCKET"
            )}/`
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airtable.com",
            `https://s3.${env("AWS_REGION")}.amazonaws.com/${env(
              "MEDIA_BUCKET"
            )}/`,
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
