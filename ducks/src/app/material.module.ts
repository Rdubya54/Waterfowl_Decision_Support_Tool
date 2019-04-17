import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatListModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatGridListModule,
  MatTableDataSource,
  MatTableModule,
	MatSliderModule,
  MatSlideToggleModule,
  MatBottomSheetModule,
  MatButtonToggleModule,
  MatProgressSpinnerModule

} from '@angular/material';

@NgModule({
  imports: [
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule,
    MatGridListModule,
    MatTableModule,
    MatSelectModule,
    MatBottomSheetModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatGridListModule,
    MatTableModule,
    MatSelectModule,
    MatSidenavModule,
    MatBottomSheetModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule
  ]
})
export class MaterialModule {}