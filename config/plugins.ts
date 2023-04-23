export default ({ env }) => ({
  sentry: {
    enabled: env("NODE_ENV") === "production",
    config: {
      dsn: env("SENTRY_DSN"),
      sendMetadata: true,
    },
  },
  upload: {
    config: {
      provider: "local",
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64
      },
      sizeLimit: 250 * 1024 * 1024, // 256mb in bytes
    },
  }
});
