/**
 * SERVICIO DE DIÁLOGOS Y VENTANAS EMERGENTES
 * 
 * Este servicio nos ayuda a mostrar ventanas emergentes bonitas en lugar de usar
 * los feos "alert()" del navegador. Es como tener un asistente que nos ayuda a
 * preguntar cosas al usuario de manera elegante.
 * 
 * Puede mostrar:
 * - Confirmaciones ("¿Estás seguro?")
 * - Información ("¡Todo salió bien!")
 * - Errores ("Algo falló")
 * - Avisos ("Ten cuidado con esto")
 */
import { Injectable } from '@angular/core';

// Configuración de cómo queremos que se vea cada ventana emergente
export interface DialogConfig {
  title: string;        // Título de la ventana
  message: string;      // Mensaje principal
  confirmText?: string; // Texto del botón de confirmar (opcional)
  cancelText?: string;  // Texto del botón de cancelar (opcional)
  type?: 'info' | 'warning' | 'danger' | 'success'; // Tipo de mensaje
}

@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})
export class DialogService {
  //
  // En este servicio mezclo TypeScript con HTML y Bootstrap. No es una práctica para profesionales, solo para que yo vaya entendiendolo
  // ¿Por qué? Porque quiero crear ventanas emergentes bonitas y personalizadas desde mi código TypeScript,
  // pero usando el diseño y los estilos que ya trae Bootstrap.
  // Para lograrlo, genero el HTML de la ventana (modal) como un string en TypeScript,
  // lo inserto en el DOM y luego uso las clases y componentes de Bootstrap para mostrarlo.
  // Así, puedo controlar la lógica (cuándo mostrar, qué botones, qué mensajes) desde TypeScript,
  // y el aspecto visual lo pone Bootstrap y el HTML generado.
  // Es una forma práctica de aprovechar lo mejor de ambos mundos: lógica en TypeScript y diseño en Bootstrap/HTML.

  /**
   * MOSTRAR VENTANA DE CONFIRMACIÓN
   * Como preguntar "¿Estás seguro de eliminar esto?"
   * @param config - Cómo queremos que se vea la ventana
   * @returns Promise<boolean> - true si dice "sí", false si dice "no"
   */
  async confirm(config: DialogConfig): Promise<boolean> {
    return new Promise((resolve) => {
      const modalId = 'dynamic-modal-' + Date.now();
      const modalHtml = this.createModalHtml(modalId, config);
      
      // Insertar modal en el DOM
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      
      const modalElement = document.getElementById(modalId);
      if (!modalElement) {
        resolve(false);
        return;
      }

      // Event listeners para los botones
      const confirmBtn = modalElement.querySelector('.btn-confirm') as HTMLButtonElement;
      const cancelBtn = modalElement.querySelector('.btn-cancel') as HTMLButtonElement;
      const closeBtn = modalElement.querySelector('.btn-close') as HTMLButtonElement;

      const handleConfirm = () => {
        this.removeModal(modalId);
        resolve(true);
      };

      const handleCancel = () => {
        this.removeModal(modalId);
        resolve(false);
      };

      confirmBtn?.addEventListener('click', handleConfirm);
      cancelBtn?.addEventListener('click', handleCancel);
      closeBtn?.addEventListener('click', handleCancel);

      // Mostrar modal con Bootstrap
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();

      // Auto-limpiar cuando se cierra
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.removeModal(modalId);
      });
    });
  }

  /**
   * MOSTRAR MENSAJE INFORMATIVO
   * Para decir cosas como "¡El jugador fue agregado correctamente!"
   */
  async info(title: string, message: string): Promise<void> {
    await this.confirm({
      title,
      message,
      confirmText: 'Entendido',
      type: 'info'
    });
  }

  /**
   * MOSTRAR MENSAJE DE ÉXITO
   * Para celebrar cuando algo salió bien
   */
  async success(title: string, message: string): Promise<void> {
    await this.confirm({
      title,
      message,
      confirmText: 'Continuar',
      type: 'success'
    });
  }

  /**
   * MOSTRAR MENSAJE DE ERROR
   * Para avisar cuando algo salió mal
   */
  async error(title: string, message: string): Promise<void> {
    await this.confirm({
      title,
      message,
      confirmText: 'Cerrar',
      type: 'danger'
    });
  }

  // MÉTODOS PRIVADOS - Solo para uso interno del servicio
  
  // Crea el HTML de la ventana emergente con Bootstrap
  private createModalHtml(modalId: string, config: DialogConfig): string {
    const typeClass = this.getTypeClass(config.type || 'info');
    const confirmText = config.confirmText || 'Confirmar';
    const cancelText = config.cancelText || 'Cancelar';
    const showCancel = !!config.cancelText || config.type === 'warning';

    return `
      <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header ${typeClass}">
              <h5 class="modal-title text-white">
                <i class="${this.getTypeIcon(config.type || 'info')} me-2"></i>
                ${config.title}
              </h5>
              <button type="button" class="btn-close btn-close-white" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p class="mb-0">${config.message}</p>
            </div>
            <div class="modal-footer">
              ${showCancel ? `<button type="button" class="btn btn-secondary btn-cancel">${cancelText}</button>` : ''}
              <button type="button" class="btn btn-confirm ${this.getConfirmButtonClass(config.type || 'info')}">${confirmText}</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private getTypeClass(type: string): string {
    const classes = {
      info: 'bg-info',
      warning: 'bg-warning',
      danger: 'bg-danger',
      success: 'bg-success'
    };
    return classes[type as keyof typeof classes] || classes.info;
  }

  private getTypeIcon(type: string): string {
    const icons = {
      info: 'bi bi-info-circle',
      warning: 'bi bi-exclamation-triangle',
      danger: 'bi bi-x-circle',
      success: 'bi bi-check-circle'
    };
    return icons[type as keyof typeof icons] || icons.info;
  }

  private getConfirmButtonClass(type: string): string {
    const classes = {
      info: 'btn-info',
      warning: 'btn-warning',
      danger: 'btn-danger',
      success: 'btn-success'
    };
    return classes[type as keyof typeof classes] || classes.info;
  }

  private removeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      modalElement.remove();
    }
  }
}