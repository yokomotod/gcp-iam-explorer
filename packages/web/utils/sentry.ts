import * as Sentry from "@sentry/browser";

export const init = (): void => {
  if (process.env.NODE_ENV === "production") {
    Sentry.init({
      dsn: "https://ed7ac40a58ca45968f9aead6489400a7@sentry.io/1871947",
    });
  }
};
