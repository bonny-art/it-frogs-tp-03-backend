import ElasticEmail from "@elasticemail/elasticemail-client";

const { ELASTICEMAIL_API_KEY } = process.env;

const client = ElasticEmail.ApiClient.instance;

const apikey = client.authentications["apikey"];
apikey.apiKey = ELASTICEMAIL_API_KEY;

const emailsApi = new ElasticEmail.EmailsApi();

export const sendMail = (htmlContent, user, subject) => {
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
      Subject: subject,
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
