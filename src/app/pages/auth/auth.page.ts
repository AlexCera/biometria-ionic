import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { BiometryType, NativeBiometric } from "capacitor-native-biometric";
import * as CryptoJS from 'crypto-js';
const KEY = "test-biometria-2024";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  authForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
  })

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  async biometricLogin() {
    const verified = await this.performBiometricVerification();

    if (verified) {
      const credentials = this.getBiometricCredentials();

      this.router.navigateByUrl("/home");

    } else {
      const toast = await this.toastController.create({
        message: 'No hemos logrado validar tus datos biométricos.',
        duration: 5000,
        color: 'danger',
        icon: 'alert-circle-outline'
      });
      toast.present();
    }
  }

  async sendForm() {
    if (this.authForm.valid) {

      const biometricAvailable = await this.biometricAvailable();
      const biometricCredentials = localStorage.getItem("biometric")

      const formValue = this.authForm.value as IUser;

      if (biometricAvailable && !biometricCredentials) {
        const alert = await this.alertController.create({
          header: 'Acceso Biométrico',
          message: '¿Quieres utilizar la biometría para ingresar más fácil y rápido?',
          mode: 'ios',
          backdropDismiss: false,
          buttons: [
            {
              text: 'No, gracias',
              role: 'cancel'
            }, {
              text: 'Sí, utilizarla',
              handler: () => {
                this.saveCredentials(formValue);
              }
            }
          ]
        });

        await alert.present();
      }

      this.authForm.reset();
      this.router.navigateByUrl("/home");
    }
  }

  /**
   * biometricAvailable
   * Valida si se encuentra disponible la verificacion biometrica 
   * @returns boolean
   */
  async biometricAvailable() {
    const available = await NativeBiometric.isAvailable()
      .then(res => res.isAvailable)
      .catch(() => false);

    return available;
  }

  /**
   * performBiometricVerification
   * Verifica la biometria
   * @returns 
   */
  async performBiometricVerification() {
    const verified = await NativeBiometric.verifyIdentity()
      .then(() => true)
      .catch(() => false);

    return verified;
  }


  /**
   * saveCredentials
   * Guarda las credenciales del usuario de forma encriptada
   * 
   */
  async saveCredentials(credentials: { email: string, password: string }) {
    const verified = await this.performBiometricVerification();
    if (verified) {
      const data = JSON.stringify(credentials);
      const encryptedData = CryptoJS.AES.encrypt(data, KEY).toString();

      localStorage.setItem('biometric', encryptedData)
    } else {
      const toast = await this.toastController.create({
        message: 'Ocurrio un error con tus datos biométricos.',
        duration: 5000,
        color: 'danger',
        icon: 'alert-circle-outline'
      });
      toast.present();
    }
  }

  getBiometricCredentials() {
    const encryptedData = localStorage.getItem("biometric");

    if (encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, KEY);
      const credentials = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return credentials;
    } else {
      return null;
    }
  }

}

export interface IUser { email: string, password: string }