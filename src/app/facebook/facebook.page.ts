import { Component, OnInit } from '@angular/core';
import { FacebookLoginResponse, FacebookLogin } from '@capacitor-community/facebook-login';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Filesystem, FilesystemDirectory, FilesystemEncoding } from '@capacitor/filesystem';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.page.html',
  styleUrls: ['./facebook.page.scss'],
})
export class FacebookPage implements OnInit {

  token: any;

  constructor(private http: HTTP) { }

  async loginwithFacebook() {
    const FACEBOOK_PERMISSIONS = ['email', 'user_birthday'];
    const result: FacebookLoginResponse = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });

    console.log('result = ', result);
    if (result?.accessToken?.userId) {
      this.token = result.accessToken;
      this.loadUserData();
    }
  }

  async loadUserData() {
    const url = 'https://graph.facebook.com/' + this.token.userId + '?fields=id,name,picture.width(720),birthday,email&access_token=' + this.token.token;
    this.http.post(url, {}, {}).then(async (res) => {
      console.log('resp = ', res);
      let final = JSON.parse(res.data);

      // Exemplo de escrita em um arquivo usando o Filesystem
      const content = JSON.stringify(final);
      const fileName = 'userData.json';

      try {
        await Filesystem.writeFile({
          path: fileName,
          data: content,
          directory: FilesystemDirectory.Documents,
          encoding: FilesystemEncoding.UTF8,
        });

        console.log('Arquivo gravado com sucesso!');
      } catch (error) {
        console.error('Erro ao gravar o arquivo:', error);
      }
    });
  }

  ngOnInit() {
  }
}
