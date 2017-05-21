import { Component, OnInit, Input } from '@angular/core';

interface IPages {
  home: string;
  about: string;
  mit: string;
  git: string;
  releases: string;
  bugs: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  @Input('version') version: string;
  @Input('homepage') homepage: string;

  public pages: IPages;

  constructor() {
    this.pages = {
      home: this.homepage,
      about: 'https://github.com/andreasonny83/online-board/blob/master/README.md',
      mit: 'https://github.com/andreasonny83/online-board/blob/master/LICENSE',
      git: 'https://github.com/andreasonny83/online-board.git',
      releases: 'https://github.com/andreasonny83/online-board/releases',
      bugs: 'https://github.com/andreasonny83/online-board/issues/new',
    }
  }

  ngOnInit() { }
}
