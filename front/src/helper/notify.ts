import Swal,{SweetAlertResult} from "sweetalert2";

/**
 * Displays a notification using SweetAlert2.
 *
 * @param message - The message to display in the notification.
 * @param type - The type of notification. Can be one of 'success', 'error', 'warning', 'info'.
 *               Defaults to 'success'.
 */
export function notify(message: string = "", type: 'success' | 'error' | 'warning' | 'info' = 'success'): Promise<SweetAlertResult> {
    return Swal.fire({
        title: `${type}`,
        text: message,
        icon: type,
        showConfirmButton: false,
        timer: 1500,
    });
}
