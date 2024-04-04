import path from "path";

export const makeEmailVerificationLetterHTML = (req, user, subject) => {
  const referer = req.get("Referer");

  const verificationPath = `${referer}WaterTrackerFrontend/verification/${user.verificationToken}`;

  const verificationPathBack = `
    ${req.protocol}://${req.get("host")}/api/auth/verify/${
    user.verificationToken
  }`;

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
      <h1>Welcome to Tracker of water!</h1>
    </div>
    <div class="content">
      <p>Thank you for joining us on your hydration journey!</p>
      <p>Please click the button below to confirm your email address ${user.email}:</p>
      <a href="${verificationPath}" class="confirm-button">Confirm Email</a>
      <p>If the button above does not work, please copy the following link and paste it into your browser's address bar to proceed:</p>
      <p><a href="${verificationPath}">${verificationPath}</a></p>
      <h2>Лінка для підтверждення напряму на бек-енді (тимчасова)</h2>
      <p><a href="${verificationPathBack}">${verificationPathBack}</a></p>
      <h2>Why Stay Hydrated?</h2>
      <ul>
        <li>Supply of nutrients to all organs</li>
        <li>Providing oxygen to the lungs</li>
        <li>Maintaining the work of the heart</li>
        <li>Release of processed substances</li>
        <li>Ensuring the stability of the internal environment</li>
        <li>Maintaining within the normal temperature</li>
        <li>Maintaining an immune system capable of resisting disease</li>
      </ul>
      <h2>Tracker Benefits</h2>
      <ul>
        <li>Drive healthy hydration habits</li>
        <li>View and analyze your intake statistics</li>
        <li>Set personal hydration goals</li>
      </ul>
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

  return letter;
};

export const makePasswordRecoveryLetterHTML = (req, user, subject) => {
  const referer = req.get("Referer");

  const resetPasswordPath = `${referer}WaterTrackerFrontend/recovery/${user.passwordRecoveryToken}`;

  const resetPasswordPathBack = `
    ${req.protocol}://${req.get("host")}/api/auth/verify/${
    user.passwordRecoveryToken
  }`;

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

  return letter;
};
