module.exports = function () {
  const adminUserID = `T5m7ByIdZSPg7lur0y82kaJSdls1`;
  let jwt = require("jsonwebtoken");
  let nodemailer = require("nodemailer");
  let bcrypt = require("bcrypt-nodejs");
  const fbAdmin = global.firebase;
  const fsDB = fbAdmin.firestore();

  const mailTemplate = require("./mailTemplate");
  const returnMailContent = mailTemplate.mailTemplate;

  /** ACCESS TOKEN METHODS */
  this.generateToken = function (data, secret, expireTime) {
    return new Promise(function (resolve, reject) {
      jwt.sign(data, secret, { expiresIn: expireTime }, (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
  };

  this.getDataFromToken = function (token, secret) {
    let result = {};
    return new Promise(function (resolve) {
      jwt.verify(token, secret, (err, payload) => {
        if (err) {
          result.error = true;
          result.data = null;
          resolve(result);
        } else {
          result.error = false;
          result.data = payload;
          resolve(result);
        }
      });
    });
  };

  /** GENERATE UNIQUE ID */
  this.makeUniqueID = (length, option) => {
    let result = "";
    let characters;
    let charactersLength;
    if (option == "num") {
      characters = "0123456789";
      charactersLength = characters.length;
    } else {
      characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      charactersLength = characters.length;
    }
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  /** HASH PASSWORD METHODS */
  this.generatehash = function (password, callback) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) console.log(err);
      if (callback) {
        callback(salt);
      } else {
        return salt;
      }
    });
  };

  this.generatePassword = function (data, callback) {
    let passwordResponse = {};
    bcrypt.hash(data.password, data.hash, null, function (err, hash) {
      if (err) {
        passwordResponse.error = true;
      } else {
        passwordResponse.error = false;
        passwordResponse.hashPassword = hash;
      }
      if (callback) {
        callback(passwordResponse);
      } else {
        return passwordResponse;
      }
    });
  };

  this.comparePassword = function (data, password) {
    return new Promise(function (resolve, reject) {
      bcrypt.compare(password, data.password, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  };

  this.generatehashSync = function (password) {
    let salt = bcrypt.genSaltSync(10);
    return salt;
  };

  this.generatePasswordSync = function (data) {
    let passwordResponse = bcrypt.hashSync(data.password, data.hash);
    return passwordResponse;
  };

  /** MAIL METHODS */

  var mail_from = process.env.SMTP_FROM;
  var domain_name = "SUN100" //process.env.DOMAIN_LINK;
  var domain_link = "https://exchange.blockchainappdevs.com/cex-staking/"
  var domain_logo = "api/uploads/mail/domain_logo.png";
  var mail_title = "SUN100"

  let smtpTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    secure: true,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  let smtpTransport2 = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    secure: true,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  let smtpTransport3 = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    secure: true,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  this.sendAdminMail = async function (data, callback, from, subject) {
    try {
      smtpT = smtpTransport;
      let adminMailOptions = {
        from: from,
        to: from,
        subject: subject,
        html: returnMailContent({
          title: "NEW USER REGISTER",
          buttonLink: domain_link + "/admin/",
          buttonName: "View admin panel",
          brief:
            "New user registered.<br/>User ID: " +
            data.uid +
            "<br/>Name: " +
            data.firstName +
            " " +
            data.lastName +
            "<br/>Email : " +
            data.email +
            "",
          message: "",
        }),
      };
      smtpT.sendMail(adminMailOptions, function (error, response) {
        if (error) {
          console.log(error);
        }
        callback(response);
      });
      const { accessToken, ..._data } = data;
      let notificationData = {
        topic: "user",
        message: "New user registered",
        attributes: _data,
        createdTime: new Date().getTime(),
        is_Read: false,
      };
      let notificationDoc = await fsDB
        .collection(`users`)
        .doc(adminUserID)
        .collection(`notifications`)
        .doc();
      notificationDoc.set(notificationData);
    } catch (e) {
      console.log(e);
    }
  };

  var static_attachments = [
    {
      filename: "logo.png",
      href: domain_link + domain_logo,
      cid: "domainlogo",
    },
    {
      filename: "svg_1-1-2-3-4.png",
      href: domain_link + "api/uploads/mail/svg_1-1-2-3-4.png",
      cid: "social_telegram",
    },
    {
      filename: "svg_1-1.png",
      href: domain_link + "api/uploads/mail/svg_1-1.png",
      cid: "social_facebook",
    },
    {
      filename: "svg_1-1-2.png",
      href: domain_link + "api/uploads/mail/svg_1-1-2.png",
      cid: "social_instagram",
    },
    {
      filename: "svg_1.png",
      href: domain_link + "api/uploads/mail/svg_1.png",
      cid: "social_X",
    },
    {
      filename: "svg_1-1-2-3.png",
      href: domain_link + "api/uploads/mail/svg_1-1-2-3.png",
      cid: "social_youtube",
    }
  ]

  var mail_images = {
    "domainlogo" : domain_link + domain_logo,
    "social_telegram" : domain_link + "api/uploads/mail/svg_1-1-2-3-4.png",
    "social_facebook" : domain_link + "api/uploads/mail/svg_1-1.png",
    "social_instagram" : domain_link + "api/uploads/mail/svg_1-1-2.png",
    "social_X" : domain_link + "api/uploads/mail/svg_1.png",
    "social_youtube" : domain_link + "api/uploads/mail/svg_1-1-2-3.png"
  }

  this.sendVerifyMail = function (data, callback) {
    let smtpT;
    let mailHtml = "";
    let from = "";
    let subject = "";
    if (data.type && data.type == "Register") {
      smtpT = smtpTransport;
      from = mail_from;
      subject = "Welcome to " + mail_title;
      mailHtml = returnMailContent({
        title: "Dear" + data.firstName,
        buttonLink: domain_link + "/account/login?token=" + data.accessToken,
        buttonName: "Log In",
        brief: "mail content here",
        message: `Click on the above link to verify your E-mail address and login to your ${domain_name} account`,
        mail_images : mail_images
      });
      this.sendAdminMail(data, callback, from, subject);
    } else if (data.type && data.type == "transfer") {
      subject = "Verification code";
      smtpT = smtpTransport2;
      from = mail_from;
      mailHtml = returnMailContent({
        title: "OTP",
        buttonLink: "OTP",
        buttonName: data.otp,
        brief: "",
        message: `Please enter the above 6 digit OTP on ${domain_name} OTP screen to verify your asset transfer`,
        mail_images : mail_images
      });
    } else {
      subject = "Verification code";
      smtpT = smtpTransport2;
      from = mail_from;
      mailHtml = returnMailContent({
        title: "Welcome to " + mail_title+" - OTP",
        buttonLink: "OTP",
        buttonName: data.otp,
        brief: "",
        message: `Please enter the above 6 digit OTP on ${domain_name} OTP screen to verify your E-mail address`,
        mail_images : mail_images
      });
    }
    let mailOptions = {
      from: from,
      to: data.email,
      subject: subject,
      html: mailHtml,
      // attachments: static_attachments,
    };
    smtpT.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      }
      callback(response);
    });
  };

  this.sendForgotPasswordMail = function (data, callback) {
    let mailOptions = {
      from: mail_from,
      to: data.email,
      subject: "Password Reset",
      html: returnMailContent({
        title: "FORGOT PASSWORD",
        buttonLink: domain_link + "/account/reset-password?token=" + data.token,
        buttonName: "RESET PASSWORD",
        brief: `You’ve requested to reset the password linked with your ${domain_name} account.<br/>To confirm your request, Please click on the link below<br/>The verification link will be valid for 30 minutes. Please do not share this link with anyone.`,
        message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
      }),
      // attachments: static_attachments,
    };
    smtpTransport2.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      }
      callback(response);
    });
  };

  this.passwordChangedMail = function (data, callback) {
    let mailOptions = {
      from: mail_from,
      to: data.email,
      subject: "Password Changed",
      html: returnMailContent({
        title: "PASSWORD CHANGED",
        buttonLink: "",
        buttonName: "",
        brief: `The password linked to your ${domain_name} account has been successfully updated.`,
        message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
      }),
      // attachments: static_attachments,
    };
    smtpTransport2.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      }
      callback(response);
    });
  };

  this.newLoginAttemptMail = function (data, callback) {
    let mailOptions = {
      from: mail_from,
      to: data.email,
    };
    if (data.type == "NEWIP") {
      mailOptions.subject = "Login Attempted from New IP address";
      mailOptions.html = returnMailContent({
        title: "LOGIN ATTEMPTED",
        buttonLink: "",
        buttonName: "",
        brief:
          "We’ve noticed that you accessed your account from an unrecognized IP address.<br/>Email : " +
          data.email +
          "<br/>Time : " +
          data.loginTime +
          "<br/>IP Address : " +
          data.ipAddress +
          "",
        message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
      });
    } else {
      mailOptions.subject = "Logged In successfully";
      mailOptions.html = returnMailContent({
        title: "LOGIN SUCCESSFUL",
        buttonLink: "",
        buttonName: "",
        brief:
          "Your account has been logged.<br/>Email : " +
          data.email +
          "<br/>Time : " +
          data.loginTime +
          "<br/>IP Address : " +
          data.ipAddress +
          "",
        message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
      });
    }
    mailOptions.attachments = static_attachments,
    smtpTransport2.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      }
      callback(response);
    });
  };

  this.failedPasswordAttemptMail = function (data, callback) {
    let mailOptions = {
      from: mail_from,
      to: data.email,
      subject: "Account Suspended",
      html: returnMailContent({
        title: "INCORRECT PASSWORD ATTEMPTED",
        buttonLink: "",
        buttonName: "",
        brief:
          "Your account has been suspended for 24Hours because of <b>incorrect password attempted for 3 times</b>.<br/>Email : " +
          data.email +
          "<br/>Time : " +
          data.loginTime +
          "<br/>IP Address : " +
          data.ipAddress +
          "",
        message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
      }),
      // attachments: static_attachments,
    };
    smtpTransport2.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      }
      callback(response);
    });
  };

  this.sendPaymentConfirmationMail = function (data, callback) {
    let mailOptions = {
      from: mail_from,
      to: data.email,
      subject: "Payment Received",
      html: returnMailContent({
        title: "YOUR PAYMENT HAS BEEN RECEIVED",
        buttonLink: "",
        buttonName: "",
        brief:
          "Hello, " +
          data.amount +
          " " +
          data.currency +
          " has been credited to your account",
        message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
      }),
      // attachments: static_attachments,
    };
    smtpTransport2.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      }
      callback(response);
    });
  };

  this.sendWithdrawnMail = function (data, callback) {
    let mailOptions = {
      from: mail_from,
      to: data.email,
      subject: "Amount Withdrawn",
      html: returnMailContent({
        title: "YOUR AMOUNT WITHDRAWN SUCCESSFULLY",
        buttonLink: "",
        buttonName: "",
        brief:
          "Hello " +
          data.firstName +
          ", " +
          data.amount +
          " " +
          data.currency +
          " has been debited from your account.",
        message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
      }),
      // attachments: static_attachments,
    };
    smtpTransport2.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      }
      callback(response);
    });
  };

  this.sendMailNotification = function (data, callback) {
    let from;
    if (data.emailType && data.emailType == "outside") {
      from = mail_from;
    } else {
      from = mail_from;
    }
    let mailOptions = {
      from: from,
      to: data.email,
      subject: data.subject,
      html: data.htmlContent,
    };
    if (data.emailType && data.emailType == "outside") {
      smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log(error);
        }
        callback(response);
      });
    } else {
      smtpTransport3.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log(error);
        }
        callback(response);
      });
    }
  };

  this.notifySuccessfullTransferAsset = function (data, callback) {
    let mailOptions = {
      from: mail_from,
      to: data.email,
    };
    if (data.mode == "SEND") {
      if (data.type == "NFT") {
        mailOptions.subject = "NFT transferred";
        mailOptions.html = returnMailContent({
          title: "NFT TRANSFERRED",
          buttonLink: "",
          buttonName: "",
          brief: "Your NFT has been successfully transferred.",
          message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
        });
      } else {
        mailOptions.subject = "Asset transferred";
        mailOptions.html = returnMailContent({
          title: "ASSET TRANSFERRED",
          buttonLink: "",
          buttonName: "",
          brief: "Your Asset has been successfully transferred.",
          message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
        });
      }
    } else {
      if (data.type == "NFT") {
        mailOptions.subject = "NFT Received";
        mailOptions.html = returnMailContent({
          title: "NFT RECEIVED",
          buttonLink: "",
          buttonName: "",
          brief: "Your NFT Asset has been successfully received.",
          message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
        });
      } else if (data.type == "FIAT DEPOSIT") {
        mailOptions.subject = "Deposit Submitted";
        mailOptions.html = returnMailContent({
          title: "DEPOSIT SUBMITTED",
          buttonLink: "",
          buttonName: "",
          brief: `Your Deposit amount ${
            data.amount + " " + data.currency
          } request has been successfully submitted.`,
          message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
        });
      } else if (data.type == "FIAT DEPOSIT APPROVED") {
        mailOptions.subject = "Deposit Approved";
        mailOptions.html = returnMailContent({
          title: "DEPOSIT APPROVED",
          buttonLink: "",
          buttonName: "",
          brief: `Your Deposit amount ${
            data.amount + " " + data.currency
          } request has been successfully approved.`,
          message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
        });
      } else if (data.type == "FIAT DEPOSIT REJECTED") {
        mailOptions.subject = "Deposit Rejected";
        mailOptions.html = returnMailContent({
          title: "DEPOSIT REJECTED",
          buttonLink: "",
          buttonName: "",
          brief: `Your Deposit amount ${
            data.amount + " " + data.currency
          } request has been rejected.`,
          message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
        });
      } else if (data.type == "CRYPTO DEPOSIT") {
        mailOptions.subject = "Deposit Submitted";
        mailOptions.html = returnMailContent({
          title: "DEPOSIT SUBMITTED",
          buttonLink: "",
          buttonName: "",
          brief: `Your Deposit amount ${
            data.amount + " " + data.currency
          } request has been successfully submitted.`,
          message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
        });
      } else if (data.type == "CRYPTO DEPOSIT APPROVED") {
        mailOptions.subject = "Deposit Approved";
        mailOptions.html = returnMailContent({
          title: "DEPOSIT APPROVED",
          buttonLink: "",
          buttonName: "",
          brief: `Your Deposit amount ${
            data.amount + " " + data.currency
          } request has been successfully approved.`,
          message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
        });
      } else if (data.type == "CRYPTO DEPOSIT REJECTED") {
        mailOptions.subject = "Deposit Rejected";
        mailOptions.html = returnMailContent({
          title: "DEPOSIT REJECTED",
          buttonLink: "",
          buttonName: "",
          brief: `Your Deposit amount ${
            data.amount + " " + data.currency
          } request has been rejected.`,
          message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
        });
      } else if (data.type == "CRYPTO WITHDRAW") {
        mailOptions.subject = "Withdraw Submitted";
        mailOptions.html = returnMailContent({
          title: "WITHDRAW SUBMITTED",
          buttonLink: "",
          buttonName: "",
          brief: `Your Withdraw amount ${
            data.amount + " " + data.currency
          } request has been successfully submitted.`,
          message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
        });
      } else if (data.type == "CRYPTO WITHDRAW APPROVED") {
        mailOptions.subject = "Withdraw Approved";
        mailOptions.html = returnMailContent({
          title: "WITHDRAW APPROVED",
          buttonLink: "",
          buttonName: "",
          brief: `Your Withdraw amount ${
            data.amount + " " + data.currency
          } request has been successfully approved.`,
          message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
        });
      } else if (data.type == "CRYPTO WITHDRAW REJECTED") {
        mailOptions.subject = "Withdraw Rejected";
        mailOptions.html = returnMailContent({
          title: "WITHDRAW REJECTED",
          buttonLink: "",
          buttonName: "",
          brief: `Your Withdraw amount ${
            data.amount + " " + data.currency
          } request has been rejected.`,
          message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
        });
      } else if (data.type == "FIAT WITHDRAW") {
        mailOptions.subject = "Withdraw Submitted";
        mailOptions.html = returnMailContent({
          title: "WITHDRAW SUBMITTED",
          buttonLink: "",
          buttonName: "",
          brief: `Your Withdraw amount ${
            data.amount + " " + data.currency
          } request has been successfully submitted.`,
          message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
        });
      } else if (data.type == "FIAT WITHDRAW APPROVED") {
        mailOptions.subject = "Withdraw Approved";
        mailOptions.html = returnMailContent({
          title: "WITHDRAW APPROVED",
          buttonLink: "",
          buttonName: "",
          brief: `Your Withdraw amount ${
            data.amount + " " + data.currency
          } request has been successfully approved.`,
          message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
        });
      } else if (data.type == "FIAT WITHDRAW REJECTED") {
        mailOptions.subject = "Withdraw Rejected";
        mailOptions.html = returnMailContent({
          title: "WITHDRAW REJECTED",
          buttonLink: "",
          buttonName: "",
          brief: `Your Withdraw amount ${
            data.amount + " " + data.currency
          } request has been rejected.`,
          message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
        });
      } else if (data.type == "USER BANK ACCOUNT STATUS") {
        mailOptions.subject = "Bank Account has been " + data.status;
        mailOptions.html = returnMailContent({
          title: "BANK ACCOUNT " + data.status.toUpperCase(),
          buttonLink: "",
          buttonName: "",
          brief: `Your Bank Account ${data.accountNumber} - ${
            data.bankName
          } request has been ${data.status.toLowerCase()}${
            data.message ? " because of " + data.message : ""
          }.`,
          message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
        });
      } else {
        mailOptions.subject = "Asset Received";
        mailOptions.html = returnMailContent({
          title: "ASSET RECEIVED",
          buttonLink: "",
          buttonName: "",
          brief: "Your Asset has been successfully received.",
          message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
        });
      }
    }
    mailOptions.attachments = static_attachments,
    smtpTransport2.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      }
      callback(response);
    });
  };

  this.sendMailNotification = function (data, callback) {
    let from;
    if (data.emailType && data.emailType == "outside") {
      from = mail_from;
    } else {
      from = mail_from;
    }
    let mailOptions = {
      from: from,
      to: data.email,
      subject: data.subject,
      html: data.htmlContent,
      // attachments: static_attachments,
    };
    if (data.emailType && data.emailType == "outside") {
      smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log(error);
        }
        callback(response);
      });
    } else {
      smtpTransport3.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log(error);
        }
        callback(response);
      });
    }
  };

  this.sendUserMailNotification = function (data, callback) {
    let from = mail_from;
    let mailOptions = {
      from: from,
      to: data.email,
      subject: data.subject,
      html: returnMailContent({
        title: data.title,
        buttonLink: "",
        buttonName: "",
        brief: data.message,
        message: `If you don’t recognize this activity, please contact our customer support immediately at ${domain_name}.`,
        mail_images : mail_images
      }),
      // attachments: static_attachments,
    };
    smtpTransport2.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      }
      callback(response);
    });
  };
};
