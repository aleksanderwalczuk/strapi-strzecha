export default ({ env }) => [
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "res.cloudinary.com", // cloudinary images
            "lh3.googleusercontent.com", // google avatars
            "platform-lookaside.fbsbx.com", // facebook avatars
            "dl.airtable.com", // strapi marketplace
            `https://${env("AWS_BUCKET")}.s3.${env(
              "AWS_REGION"
            )}.amazonaws.com`,
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "res.cloudinary.com", // cloudinary images
            "lh3.googleusercontent.com", // google avatars
            "platform-lookaside.fbsbx.com", // facebook avatars
            "dl.airtable.com", // strapi marketplace
            `https://${env("AWS_BUCKET")}.s3.${env(
              "AWS_REGION"
            )}.amazonaws.com`,
          ],
          upgradeInsecureRequests: null,
          frameAncestors: ["self"],
        },
      },
    },
  },
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      header: "*",
      origin: ["http://localhost:3000", "http://localhost:3001"],
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
