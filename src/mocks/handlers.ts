import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("http://localhost/user/me", async ({ request }) => {
    console.log("user/me");
    return HttpResponse.json({
      id: "9c7e4ea9-a758-4c51-a4a2-297419580c14",
      name: "Andy Hsieh",
      email: "andy.hsieh@gaiatechs.com",
      oauthSource: "azure",
    });
  }),

  http.post("http://localhost/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };

    if (email === "Qqqq5953@gmail.com" && password === "1") {
      return HttpResponse.json({});
    }

    return HttpResponse.json(
      {
        detail: {
          type: "invalid_credential",
          msg: "Sorry, we do not recognize the email or password.",
        },
      },
      { status: 403 }
    );
  }),

  http.post("http://localhost/auth/forget-password", async ({ request }) => {
    const { email } = (await request.json()) as {
      email: string;
    };

    if (email === "Qqqq5953@gmail.com") {
      return HttpResponse.json({});
    }

    return HttpResponse.json(
      {
        detail: {
          type: "invalid_email",
          msg: "This email is not registered.",
        },
      },
      { status: 400 }
    );
  }),
];
