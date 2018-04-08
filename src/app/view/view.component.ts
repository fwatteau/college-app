import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../validator/email';
import { HttpClient } from '@angular/common/http';
import { ParentProvider } from '../../providers/parent/parent';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import { Subscription } from 'rxjs/Subscription';
import { Parent } from '../../model/parent';

@Component({
  selector: 'view',
  styles: [`
      .invalid {
          border-bottom: 1px solid #FF6153;
      }

      mat-dialog-content {
          display: flex;
          flex-direction: column;
      }

      mat-dialog-content > * {
          width: 100%;
      }

      mat-dialog-content form {
          margin-bottom: 20px;
      }

      mat-dialog-content form > * {
          width: 100%;
      }
  `],
  templateUrl: 'view.component.html',
})
export class ViewComponent implements OnInit, OnDestroy {
  // @Input() public parent: Parent;
  public parentForm: FormGroup;
  public addresses: any[];
  public filteredAddresses: Subscription;
  public addressCtrl: FormControl = new FormControl();

  constructor(
      public dialogRef: MatDialogRef<ViewComponent>,
      private fb: FormBuilder,
      public http: HttpClient,
      public parentProvider: ParentProvider,
      public snackBar: MatSnackBar,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  public cancel(): void {
    this.dialogRef.close();
  }

  public ngOnInit(): void {
      this.parentForm = this.fb.group({
          id: ['',
              Validators.compose([Validators.required])],
          mail: ['',
              Validators.compose([Validators.required, EmailValidator.isValid])],
          phone: ['',
              Validators.compose([Validators.required])],
          capacities: '',
          needs: '',
          children: ['',
              Validators.compose([Validators.required])],
          classroom: ['',
              Validators.compose([Validators.required])],
          name: ['',
              Validators.compose([Validators.minLength(6), Validators.required])],
          geom: '',
          updateAt: ''
      }, {hideRequired: false});

      this.addressCtrl.setValue(this.data.parent.address);
      this.filteredAddresses = this.addressCtrl.valueChanges
          .startWith(this.data.parent.address)
          .debounceTime(400)
          .do((address: string) => {
              if (address) {
                  this.http.get('https://api-adresse.data.gouv.fr/search/?q=' + address)
                      .subscribe((res: any) => {
                          this.addresses = res.features;
                      });
              }
          })
          .subscribe();
      this.parentForm.addControl('address', this.addressCtrl);
      const p = new Parent();
      Object.assign(p, this.data.parent);
      this.parentForm.setValue(p);
  }

  public ngOnDestroy(): void {
    this.filteredAddresses.unsubscribe();
  }

  public saveParent() {
      const parent = this.parentForm.getRawValue();
      // console.log(parent);
      this.http.get('https://api-adresse.data.gouv.fr/search/?q=' + parent.address)
          .subscribe((res) => {
              if (!res ||
                  !res['features'] ||
                  !res['features'].length) {
                  return;
              }

              parent.geom = {lat: (res as any).features[0].geometry.coordinates[1]
                  , lng: (res as any).features[0].geometry.coordinates[0]};

              this.parentProvider.saveParent(parent)
                  .then(() => {
                      this.snackBar.open('Données enregistrées');
                      this.cancel();
                  })
                  .catch((error) => {
                      this.snackBar.open('Erreur ' + error);
                  });
          });
  }
}
