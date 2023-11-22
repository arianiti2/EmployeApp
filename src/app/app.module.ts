// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeService } from './employee/employee.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [AppComponent, EmployeeComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule],
  providers: [EmployeeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
