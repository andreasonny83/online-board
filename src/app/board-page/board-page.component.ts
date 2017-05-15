import { Component, OnInit } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { ActivatedRoute, Params, RouterState } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Http, Response } from '@angular/http';

import { FirebaseService } from '../../firebase';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.css']
})
export class BoardPageComponent implements OnInit {
  boardID: string;
  board: any[];
  columns: any;
  collaboratorsForm: FormGroup;

  constructor(
    private fireBase: FirebaseService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private http: Http,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log(location.href);
    this.route.params
      .switchMap((params: Params) => {
        this.boardID = params['id'];
        return this.fireBase.getBoardObject(this.boardID);
      })
      .subscribe(res => {
        this.board = res;
        this.columns = this.fireBase.getBoard(`${this.boardID}/columns`);
      });
  }

  createForm() {
    this.collaboratorsForm = this.fb.group({
      collaborator: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/)
      ]],
    });
  }

  updateVal(evt: any, column: any, item: any) {
    this.columns.$ref
      .child(column.$key)
      .child('items')
      .child(item.key)
      .update({val: evt });
  }

  pushItem(itemVal, column) {
    this.columns.$ref
      .child(column.$key)
      .child('items')
      .push({
        val: itemVal.value,
        author: this.fireBase.uid,
      });
  }

  cardEmoticon(cardTitle: string) {
    switch (cardTitle) {
      case 'Goods':
      return 'sentiment_very_satisfied';

      case 'Bads':
      return 'mood_bad';

      case 'Questions':
      return 'sentiment_neutral';

      default:
      return '';
    }
  }

  inviteCollaborator() {
    console.log(this.fireBase.userInfo);
    // const sub = this.fireBase
    //   .userList
    //   .subscribe(
    //     res => {
    //       res.forEach(item => {
    //         console.log(item.val());
    //       });
    //
    //       sub.unsubscribe();
    //     }
    //   );

    // const body = {
    //   from: 'Online Board',
    //   to: this.collaboratorsForm.controls.collaborator,
    //   subject: 'Collaboration request',
    //   text: `${this.route.url}`,
    //   html: this.generateHtml(this.fireBase.userInfo.name, location.href, 'https://online-board.firebaseapp.com'),
    // };
    //
    // return this.http.post(`https://node-mailsender.herokuapp.com/send`, body)
  }

  generateHtml(userName: string, boardLink: string, onlineBoardURI: string) {
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
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
    Copyright © 2017 Online Board, All rights reserved.</p></div></td></tr></table></body></html>
    `;
  }
}
