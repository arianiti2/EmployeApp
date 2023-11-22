// employee.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  employees$: Observable<Employee[]>;
  newEmployeeForm: FormGroup;

  selectedEmployee: Employee | null = null;

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.employees$ = this.employeeService.getEmployees();
    this.newEmployeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe((employees) => {
      this.employees$ = of(employees); // Update the observable
    });
  
    // Subscribe to updates
    this.employeeService.employeeUpdated$.subscribe(() => {
      // Handle updates, e.g., fetch new data
      this.employeeService.getEmployees().subscribe((employees) => {
        this.employees$ = of(employees); // Update the observable
        this.showSnackBar('Data updated successfully');
      });
    });
  }

  addOrUpdateEmployee(event: Event): void {
    const { name, email, position, address } = this.newEmployeeForm.value;

    event.preventDefault();

    if (name && email && position && address) {
      if (this.selectedEmployee) {
        this.employeeService
          .updateEmployee({ ...this.selectedEmployee, name, email, position, address })
          .subscribe(() => {
            this.resetForm();
            this.employeeService.notifyEmployeeUpdate(); // Notify subscribers about the update
          });
      } else {
        this.employeeService
          .addEmployee({ id: 0, name, email, position, address })
          .subscribe(() => {
            this.resetForm();
            this.employeeService.notifyEmployeeUpdate(); // Notify subscribers about the update
          });
      }
    }
  }

  deleteEmployee(id: number): void {
    if (id) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.resetForm();
        this.employeeService.notifyEmployeeUpdate(); // Notify subscribers about the update
      });
    }
  }

  resetForm(): void {
    this.selectedEmployee = null;
    this.newEmployeeForm.reset();
  }

  updateEmployee(employee: Employee): void {
    this.selectedEmployee = { ...employee };
    this.newEmployeeForm.setValue({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      address: employee.address,
    });
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // 3 seconds
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
