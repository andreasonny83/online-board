export class EmailsGenerator {
  public static inviteCollaborator(userName: string, boardLink: string, onlineBoardURI: string): string {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type"
    content="text/html; charset=UTF-8"><meta name="viewport"
    content="width=device-width,initial-scale=1"><title>$subject;format="html"$</title>
    </head><body style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;
    background-color: #ffffff; margin: 0; min-width: 100%; padding: 20px 0; width: 100% !important">
    <table class="body" style="background-color: #00abc2; border-collapse: collapse;
    border-spacing: 0; margin: 0 auto; max-width: 600px; text-align: left; vertical-align: top; width: 100%">
    <tr style="text-align: left; vertical-align: top"><td class="center" align="center" valign="top"
    style="-moz-hyphens: auto; -ms-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important;
    hyphens: auto; padding: 10px 20px; text-align: center; vertical-align: top; word-break: break-word">
    <h1 style="color: #ffffff">Online Board</h1></td></tr><tr
    style="text-align: left; vertical-align: top"><td class="center" align="center" valign="top"
    style="-moz-hyphens: auto; -ms-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important;
    hyphens: auto; padding: 10px 20px; text-align: center; vertical-align: top; word-break: break-word">
    <h2 style="color: #ffffff">Good news!</h2><p style="color: #000000; margin: 0 0 0 10px">
    ${userName} has just shared an Online Board with you.</p><p
    style="color: #000000; margin: 0 0 0 10px">
    It will automatically appears on your dashboard as you launch the web app. However, you can also click
    the link below to open the board immediatelly in your browser.
    </p><hr style="background-color: #d9d9d9; border: none; color: #d9d9d9; height: 1px"><a
    href="${boardLink}" style="color: #ffd740">Click here to open the board in your browser.</a></td>
    </tr><tr style="text-align: left; vertical-align: top"><td class="center" align="center"
    valign="top"
    style="-moz-hyphens: auto; -ms-hyphens: auto; -webkit-hyphens: auto; border-collapse: collapse !important;
    hyphens: auto; padding: 10px 20px; text-align: center; vertical-align: top; word-break: break-word">
    <div class="footer" style="background: #00bcd4; padding: 10px 0"><p class="title"
    style="color: #000000; font-size: 18px; line-height: 36px; margin: 0 0 0 10px"><a
    href="${onlineBoardURI}" style="color: #ffd740">Online Board</a></p><p class="copy"
    style="color: #000000; font-size: 12px; margin: 0 0 0 10px">
    Copyright © 2017 Online Board, All rights reserved.</p></div></td></tr></table></body></html>`;
  }
}
