module.exports.mailTemplate = function (data) {
  return `<!DOCTYPE html>

  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
  
  <head>
  
    <meta charset="utf-8">
  
    <meta name="viewport" content="width=device-width,initial-scale=1">
  
    <meta name="x-apple-disable-message-reformatting">
  
    <title></title>
  
    <!--[if mso]>
  
    <style>
  
      table {border-collapse:collapse;border-spacing:0;border:none;margin:0;}
  
      div, td {padding:0;}
  
      div {margin:0 !important;}
  
    </style>
  
    <noscript>
  
      <xml>
  
        <o:OfficeDocumentSettings>
  
          <o:PixelsPerInch>96</o:PixelsPerInch>
  
        </o:OfficeDocumentSettings>
  
      </xml>
  
    </noscript>
  
    <![endif]-->
  
    <style>
  
      table, td, div, h1, p {
  
        font-family: inter;
  
      }
      td .social_media_icons{
        display: flex;
      }

      .social_media_icons img{
        width : 24px;
        padding-top : 0.5em;
      }
  
     .social_media_icons a{
  
        height: 30px;
  
        margin: 10px 45px;
        
  
      }

      .media_icons_div{
        width: 100%;
        justify-content:space-evenly;
        display: flex;
      }
  
      @media screen and (max-width: 530px) {
  
        .unsub {
  
          display: block;
  
          padding: 8px;
  
          margin-top: 14px;
  
          border-radius: 6px;
  
          background-color: #555555;
  
          text-decoration: none !important;
  
          font-weight: bold;
  
        }
  
        .col-lge {
  
          max-width: 100% !important;
  
        }
  
      }
  
      @media screen and (min-width: 531px) {
  
        .col-sml {
  
          max-width: 27% !important;
  
        }
  
        .col-lge {
  
          max-width: 73% !important;
  
        }
  
      }
  
    </style>
  
  </head>
  
  <body style="margin:0;padding:0;word-spacing:normal;background-image:;background-repeat:no-repeat;background-position:center;background-size: auto 100%;">
  
    <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  
      <table role="presentation" style="width:100%;border:none;border-spacing:0;">
  
        <tr>
  
          <td align="center" style="padding:0;">
  
            <!--[if mso]>
  
            <table role="presentation" align="center" style="width:600px;">
  
            <tr>
  
            <td>
  
            <![endif]-->
  
            <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
  
              <tr>
  
                <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;">
  
                  <a href="http://www.sun100.com/" style="text-decoration:none;"><img src="${data.mail_images.domainlogo}" width="165" alt="Logo" style="width:165px;max-width:80%;height:auto;border:none;text-decoration:none;color:#ffffff;"></a>
  
                </td>
  
              </tr>
  
              <tr>
  
                <td style="padding:30px;background-color:#ffffff;">
  
                  <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">${
                    data.title
                  }</h1>
  
                  <p style="margin:0;">SUN100 is a user-friendly Staking Platform dedicated to making 
                  Cryptocurrency Staking accessible and rewarding for everyone. We
                  provide Secure, Transparent, and Standard Staking option, 
                  allowing users to Earn 0.3% Daily Rewards (9% Monthly Rewards).</p>
  
                </td>
  
              </tr>
  
              ${data.buttonLink ? `<tr>
  
                <td style="padding-left:30px;font-size:0;background-color:#ffffff;border-bottom:1px solid #f0f0f5;border-color:rgba(201,201,207,.35);">
  
                    <p style="margin:0;"><a href="${
                      data.buttonLink == "OTP" ? "" : data.buttonLink
                    }" style="
  
            padding: 10px;
  
            border: none;
  
            border-radius: 5px;
  
            font-size: 16px;
  
            font-weight: 500;
  
            color: #fff;
            
            background:#508C17 !important;

            ${
              data.buttonLink != "OTP"
                ? "cursor:pointer;"
                : "letter-spacing:1em"
            }
  
          ">
  
              ${data.buttonName}
  
          </a></p>
  
                </td>
  
              </tr>` : ``}
              <tr>

              <td style="padding:10px 30px 30px 30px;border-color:rgba(201,201,207,.35);">

                <p style="margin:0;">${data.brief}</p>

               </td>

              </tr>

              <tr>

              <td style="padding-left:30px;background-color:#ffffff;border-color:rgba(201,201,207,.35);">

                <p style="margin:0;">${data.message}</p>

               </td>

              </tr>

              <tr>
  
                <td style="padding-left:30px;background-color:#ffffff;">
  
                  <p><strong>Risk warning - SUN100</strong>
  
                  SUN100 token price is subject to high market risk and price volatility.
                  The value of your investment may go down or up, and you may not get back the amount invested. You are solely responsible for your investment decisions and Sun100 is not liable for any losses you may incur.
  
              </p>
  
                </td>
  
              </tr>
              
  
              <tr>
              <td style="padding-left:30px;">
              <p>
              Stay connected!
              </p>
              </td>
              </tr>
              <tr style="border-top:1px solid grey" class="social_media_icons">
  
                <td style="background-color:#fff;color:#cccccc;width:100%;">
  
                  <div class="media_icons_div">
                <a href="https://t.me/sun100_stake">
                    <img src="${data.mail_images.social_telegram}" alt="Telegram Logo">
                    <!--Telegram Official Chat - https://t.me/sun100_stake-->
                </a>
            
                <a href="https://www.facebook.com/Sun100staking/">
                    <img src="${data.mail_images.social_facebook}" alt="Facebook Logo">
                    <!-- Facebook - https://www.facebook.com/Sun100staking/  -->
                </a>
                
                <a href= "https://www.instagram.com/sun100staking/">
                    <img src="${data.mail_images.social_instagram}" alt="Instagram Logo">
                    <!-- Instagram - https://www.instagram.com/sun100staking/  -->
                </a>
               
                <a href = "https://x.com/Sun100_Stake">
                    <img src="${data.mail_images.social_X}" alt="Twitter Logo">
                    <!-- X - https://x.com/Sun100_Stake -->
                </a>
                
                <a href="https://www.youtube.com/@Sun100_Stake">
                    <img src="${data.mail_images.social_youtube}" alt="Youtube Logo">

                    <!-- YouTube - https://www.youtube.com/@Sun100_Stake -->
                </a>
  
              </div>
  
                </td>
  
              </tr>
  
             <tr>
  
               <td style="padding:2px;background-color:#ffffff;text-align:center">
  
               <p style="color:#000">This is an automated message, please do not reply.</P>
  
               </td>
  
            </tr>
  
            <tr>
  
               <td style="padding:2px;background-color:#ffffff;text-align:center">
  
               <p style="color:#000">© 2023 - 2024, All Rights Reserved.</P>
  
               </td>
  
            </tr>
  
            </table>
  
          </td>
  
        </tr>
  
      </table>
  
    </div>
  
  </body>

  </html>`;
};
