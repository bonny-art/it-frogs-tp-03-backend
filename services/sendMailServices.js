import ElasticEmail from "@elasticemail/elasticemail-client";
import path from "path";

const { ELASTICEMAIL_API_KEY } = process.env;

const client = ElasticEmail.ApiClient.instance;

const apikey = client.authentications["apikey"];
apikey.apiKey = ELASTICEMAIL_API_KEY;

const emailsApi = new ElasticEmail.EmailsApi();

export const sendMail = (req, user) => {
  const verificationPath =
    req.protocol +
    "://" +
    path.join(req.get("host"), "api", "auth", "verify", user.verificationToken);

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff;">
    <div style="background-color: #007bff; color: #ffffff; padding: 10px; text-align: center;">
      <h1>Welcome to Phonebook!</h1>
    </div>
    <div style="padding: 20px; text-align: center;">
      <p>Thank you for registering!</p>
      <p>Please click the button below to confirm your email address ${user.email}:</p>
      <a href="${verificationPath}" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px;">Confirm Email</a>
      <p>If the button above does not work, please copy the following link and paste it into your browser's address bar to proceed:</p>
      <p>${verificationPath}</p>
    </div>
    <div style="background-color: #333; color: #ffffff; padding: 10px; text-align: center;">
      <p>If you have any questions, please contact us.</p>
    </div>
  </div>
</body>
</html>`;

  const emailData = {
    Recipients: {
      To: [user.email],
    },
    Content: {
      Body: [
        {
          ContentType: "HTML",
          Charset: "utf-8",
          Content: htmlContent,
        },
      ],
      From: "svitlana.otenko@gmail.com",
      Subject: "Confirm the registration on Phonebook",
    },
  };
  const campaign = {
    Name: "hello campaign",
    Recipients: {
      ListNames: ["Svitlana"],
      SegmentNames: null,
    },
    Content: [
      {
        From: "svitlana.otenko@gmail.com",
        ReplyTo: "svitlana.otenko@gmail.com",
        TemplateName: "hello_template",
        Subject: "Hello",
      },
    ],
    Status: "Draft",
  };

  const callback = (error, data, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent.");
    }
  };

  emailsApi.emailsTransactionalPost(emailData, callback);
};
