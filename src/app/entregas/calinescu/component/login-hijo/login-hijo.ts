import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-hijo',
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule],
  templateUrl: './login-hijo.html',
  styleUrl: './login-hijo.css',
})
export class LoginHijo {
  private dialogRef = inject(MatDialogRef<LoginHijo>);
  private fb = inject(FormBuilder);
  data = inject(MAT_DIALOG_DATA); // Recibe { usuarioActual: string | null }
  
  // @Input - Recibe el usuario actual desde el padre
  @Input() usuarioActual: string | null = null;
  
  // @Output - Emite los datos del login al padre
  @Output() loginExitoso = new EventEmitter<{nombre: string, email: string}>();
  
  loginForm: FormGroup;
  
  // Expresiones regulares para validación
  private readonly REGEX_NOMBRE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/; // Solo letras y espacios, 3-50 caracteres
  private readonly REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Formato email válido

  constructor() {
    // Crear formulario reactivo con validadores personalizados
    this.loginForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(this.REGEX_NOMBRE)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(this.REGEX_EMAIL)
      ]]
    });
  }

  onSubmit() {
    // Validar que el formulario sea válido antes de continuar
    if (this.loginForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      this.loginForm.markAllAsTouched();
      return; // NO PERMITIR CONTINUAR si hay errores
    }

    // Si el formulario es válido, cerrar modal y emitir datos
    const datosLogin = this.loginForm.value;
    this.loginExitoso.emit(datosLogin);
    this.dialogRef.close(datosLogin);
  }

  cerrar() {
    // Permitir cerrar la ventana sin validar
    this.dialogRef.close();
  }

  // Getters para acceder fácilmente a los controles en el template
  get nombreControl() {
    return this.loginForm.get('nombre');
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  // Métodos para verificar errores específicos
  get nombreInvalido(): boolean {
    const control = this.nombreControl;
    return !!(control && control.invalid && control.touched);
  }

  get emailInvalido(): boolean {
    const control = this.emailControl;
    return !!(control && control.invalid && control.touched);
  }
}
