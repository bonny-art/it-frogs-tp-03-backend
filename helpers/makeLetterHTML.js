export const makeEmailVerificationLetterHTML = (req, user, subject) => {
  const fullUrl = req.get("Referer");
  const urlObject = new URL(fullUrl);
  const reqDomain = `${urlObject.protocol}//${urlObject.host}/`;
  console.log("🚀 ~ reqDomain:", reqDomain);

  const serverDomain = `${req.protocol}://${req.get("host")}/`;
  console.log("🚀 ~ serverDomain:", serverDomain);

  const isSameDomain = reqDomain === serverDomain;
  console.log("🚀 ~ isSameDomain:", isSameDomain);

  const domain = isSameDomain
    ? "https://nadiiapavliuchenko.github.io"
    : reqDomain;
  console.log("🚀 ~ domain:", domain);

  const verificationPath = `${domain}WaterTrackerFrontend/verification/${user.verificationToken}`;
  console.log("🚀 ~ verificationPath:", verificationPath);

  const verificationPathBack = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/verify/${user.verificationToken}`;

  const htmlContent = `
  <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
  }
  .header {
    background-color: #00bfff; /* Light blue color */
    color: #ffffff;
    padding: 10px;
    text-align: center;
  }
  .content {
    padding: 20px;
    text-align: center;
  }
  .footer {
    background-color: #00bfff;
    color: #ffffff;
    padding: 10px;
    text-align: center;
  }
  ul {
    list-style-type: none; /* Removes bullets */
    padding: 0;
  }
  li {
    margin-bottom: 5px;
  }
  .confirm-button {
    display: inline-block;
    padding: 10px 20px;
    margin-top: 20px;
    background-color: #00bfff;
    color: #ffffff;
    text-decoration: none;
    border-radius: 5px;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Activate Your Tracker of Water Account</h1>
    </div>
    <div class="content">
      <p>We're excited to have you on board!</p>
      <p>To get started, please activate your account by clicking the button below:</p>
      <a href="${verificationPath}" class="confirm-button">Activate Account</a>
      <p>If you encounter any issues with the button, you can also activate your account using this link:</p>
      <p><a href="${verificationPath}">${verificationPath}</a></p>
      <p>For direct backend confirmation (temporary link):</p>
      <p><a href="${verificationPathBack}">${verificationPathBack}</a></p>
    </div>
    <div class="footer">
      <p>Need help? Reach out to our support team for assistance.</p>
    </div>
  </div>
</body>
</html>
`;

  const letter = {
    to: user.email,
    subject: subject,
    html: htmlContent,
  };

  // return letter;
  return { verificationPath };
};

export const makePasswordRecoveryLetterHTML = (req, user, subject) => {
  const referer = req.get("Referer");

  const resetPasswordPath = `${referer}WaterTrackerFrontend/recovery/${user.passwordRecoveryToken}`;

  const resetPasswordPathBack = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/verify/${user.passwordRecoveryToken}`;

  const htmlContent = `
  <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
  }
  .header {
    background-color: #00bfff; /* Light blue color */
    color: #ffffff;
    padding: 10px;
    text-align: center;
  }
  .content {
    padding: 20px;
    text-align: center;
  }
  .footer {
    background-color: #00bfff;
    color: #ffffff;
    padding: 10px;
    text-align: center;
  }
  ul {
    list-style-type: none; /* Removes bullets */
    padding: 0;
  }
  li {
    margin-bottom: 5px;
  }
  .confirm-button {
    display: inline-block;
    padding: 10px 20px;
    margin-top: 20px;
    background-color: #00bfff;
    color: #ffffff;
    text-decoration: none;
    border-radius: 5px;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>We received a request to reset the password for your account.</p>
      <p>If you did not make this request, please ignore this email.</p>
      <p>Otherwise, please click the button below to reset your password:</p>
      <a href="${resetPasswordPath}" class="reset-button">Reset Password</a>
      <p>If the button above does not work, please copy and paste the following link into your browser:</p>
      <p><a href="${resetPasswordPath}">${resetPasswordPath}</a></p>
      <h2>Лінка для підтверждення напряму на бек-енді (тимчасова)</h2>
      <p><a href="${resetPasswordPathBack}">${resetPasswordPathBack}</a></p>
    </div>
    <div class="footer">
      <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
    </div>
  </div>
</body>
</html>
`;

  const letter = {
    to: user.email,
    subject: subject,
    html: htmlContent,
  };

  // return letter;
  return { resetPasswordPath };
};
