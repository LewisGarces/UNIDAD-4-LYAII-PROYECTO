const convertirCodigo = (codigo, deJavaScriptAPHP = true) => {
    // Verificar si el código ya contiene etiquetas PHP
    const esCodigoPHP = /<\?php|<\?=|\?>/g;
    if (esCodigoPHP.test(codigo)) {
        Swal.fire({
            title: 'Error',
            text: 'El código ya está en PHP y no puede convertirse nuevamente.',
            icon: 'error',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            iconColor: '#FF5733',
            customClass: {
                title: 'swal-title'
            },
            buttonsStyling: false
        });
        return '';
    }
    // Expresión regular para detectar caracteres no permitidos en código JavaScript
    const noEsCodigoJS = /[^a-zA-Z0-9\s\(\)\{\}\[\]\=\+\-\*\%\!\&\|\<\>\.\,\;\:]/g;

    // Si no es código JavaScript (contiene caracteres no permitidos), muestra un SweetAlert
    if (noEsCodigoJS.test(codigo)) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingresa un código de JavaScript válido.',
            icon: 'error',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            iconColor: '#FF5733',
            customClass: {
                title: 'swal-title'
            },
            buttonsStyling: false
        });
        return false;
    }

    // Verificar si el código contiene estructuras PHP en JavaScript
    const estructurasPHP = /\$\w+/g; // Verifica si hay variables PHP ($variable)
    if (estructurasPHP.test(codigo) && deJavaScriptAPHP) {
        Swal.fire({
            title: 'Error',
            text: 'No se puede convertir. El código contiene variables o estructuras de PHP.',
            icon: 'error',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            iconColor: '#FF5733',
            customClass: {
                title: 'swal-title'
            },
            buttonsStyling: false
        });
        return '';
    }

    // Expresión regular para detectar estructuras básicas de JavaScript (condicionales, bucles, etc.)
    const tieneEstructuraControlJS = /\b(if|for|while|switch|function|return|else|try|catch|break|continue|let|var|const)\b/g;

    // Verificar que el código contiene estructuras de control JavaScript (incluyendo let, var, const)
    if (!tieneEstructuraControlJS.test(codigo)) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingresa un código JavaScript válido con estructuras de control (if, for, while, function, let, var, const, etc.).',
            icon: 'error',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            iconColor: '#FF5733',
            customClass: {
                title: 'swal-title'
            },
            buttonsStyling: false
        });
        return '';
    }

    // Configuración para la conversión de JavaScript a PHP
    const conversionesJavaScriptAPHP = [
        { expresionRegular: /\b(let|const|var)\b/g, reemplazo: '$' },
        { expresionRegular: /\bconsole\.log\(/g, reemplazo: 'echo ' },
        { expresionRegular: /\bfunction\s+(\w+)/g, reemplazo: 'function $1' },
        { expresionRegular: /\bfor\s*\((.*?)\)/g, reemplazo: 'foreach ($1)' },
        { expresionRegular: /\b===\b/g, reemplazo: '==' },
        { expresionRegular: /\b!==\b/g, reemplazo: '!=' },
        { expresionRegular: /\btrue\b/g, reemplazo: 'true' },
        { expresionRegular: /\bfalse\b/g, reemplazo: 'false' },
        { expresionRegular: /\bnull\b/g, reemplazo: 'null' },
        { expresionRegular: /\belse if\b/g, reemplazo: 'elseif' }
    ];

    // Seleccionar las conversiones según el parámetro deJavaScriptAPHP
    const conversiones = deJavaScriptAPHP ? conversionesJavaScriptAPHP : conversionesPHPaJavaScript;

    // Convertir el código según las expresiones regulares
    let codigoConvertido = conversiones.reduce(
        (resultado, conversion) => resultado.replace(conversion.expresionRegular, conversion.reemplazo),
        codigo
    );

    // Si es conversión a PHP, agregamos las etiquetas PHP al principio y al final
    if (deJavaScriptAPHP) {
        codigoConvertido = `<?php\n${codigoConvertido}\n?>`;
    }

    return codigoConvertido;
};


// Función para validar el código ingresado
const validarCodigo = (codigo) => {
    // Expresión regular para detectar variables sin definición o sin punto y coma
    const variables = /\b(let|const|var)\s+[^\s;]+[^;]*$/g;
    // Expresión regular para detectar arrays mal formados
    const arrays = /\[.*[^\]]/g;  // Si el array no está cerrado

    // Validar que las variables estén correctamente definidas
    if (variables.test(codigo)) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, asegúrate de definir las variables correctamente (debe terminar con un punto y coma).',
            icon: 'error',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            iconColor: '#FF5733',
            customClass: {
                title: 'swal-title'
            },
            buttonsStyling: false
        });
        return false;
    }

    // Validar que los arrays estén bien formados
    if (arrays.test(codigo)) {
        Swal.fire({
            title: 'Error',
            text: 'Asegúrate de que los arrays estén correctamente formados y cerrados.',
            icon: 'error',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            iconColor: '#FF5733',
            customClass: {
                title: 'swal-title'
            },
            buttonsStyling: false
        });
        return false;
    }

    return true; // El código es válido
};

// Evento para convertir el código al presionar el botón "Generar Conversión"
document.getElementById('btnGenerar').addEventListener('click', () => {
    const codigoEntrada = document.getElementById('entradaJS').value.trim();

    if (!codigoEntrada) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor ingresa código en el campo.',
            icon: 'error',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            iconColor: '#FF5733',
            customClass: {
                title: 'swal-title'
            },
            buttonsStyling: false
        });
        return;
    }

    // Validar el código antes de continuar
    if (!validarCodigo(codigoEntrada)) {
        return; // Si el código no es válido, detenemos la ejecución
    }

    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres realizar la conversión a PHP?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, convertir',
        cancelButtonText: 'No, cancelar',
        confirmButtonColor: '#28A745',
        cancelButtonColor: '#FF5733',
        iconColor: '#007BFF'
    }).then((result) => {
        if (result.isConfirmed) {
            const codigoConvertido = convertirCodigo(codigoEntrada);
            if (codigoConvertido) {
                document.getElementById('salidaPHP').value = codigoConvertido;
                Swal.fire({
                    title: 'Conversión exitosa',
                    text: 'Código convertido a PHP.',
                    icon: 'success',
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    iconColor: '#28A745',
                    customClass: {
                        title: 'swal-title'
                    },
                    buttonsStyling: false
                });
            }
        }
    });
});

// Evento para copiar el código convertido al portapapeles
document.getElementById('btnCopiar').addEventListener('click', () => {
    const codigoConvertido = document.getElementById('salidaPHP').value.trim();

    if (!codigoConvertido) {
        Swal.fire({
            title: 'Error',
            text: 'No hay código para copiar.',
            icon: 'error',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            iconColor: '#FF5733',
            customClass: {
                title: 'swal-title'
            },
            buttonsStyling: false
        });
        return;
    }

    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres copiar el código convertido?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, copiar',
        cancelButtonText: 'No, cancelar',
        confirmButtonColor: '#28A745',
        cancelButtonColor: '#FF5733',
        iconColor: '#007BFF'
    }).then((result) => {
        if (result.isConfirmed) {
            navigator.clipboard.writeText(codigoConvertido)
                .then(() => {
                    Swal.fire({
                        title: '¡Copiado!',
                        text: 'El código ha sido copiado al portapapeles.',
                        icon: 'success',
                        timer: 1500,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        iconColor: '#28A745',
                        customClass: {
                            title: 'swal-title'
                        },
                        buttonsStyling: false
                    });
                })
                .catch(err => {
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un problema al copiar el código.',
                        icon: 'error',
                        timer: 1500,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        iconColor: '#FF5733',
                        customClass: {
                            title: 'swal-title'
                        },
                        buttonsStyling: false
                    });
                });
        }
    });
});
// Evento para limpiar las conversiones al presionar el botón "Limpiar Conversiones"
document.getElementById('btnLimpiar').addEventListener('click', () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas limpiar todas las conversiones?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, limpiar',
        cancelButtonText: 'No, cancelar',
        confirmButtonColor: '#28A745',
        cancelButtonColor: '#FF5733',
        iconColor: '#007BFF'
    }).then((result) => {
        if (result.isConfirmed) {
            // Limpiar el contenido de los campos de entrada y salida
            document.getElementById('entradaJS').value = '';
            document.getElementById('salidaPHP').value = '';
            
            Swal.fire({
                title: 'Limpieza exitosa',
                text: 'Todos los campos han sido limpiados.',
                icon: 'success',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
                iconColor: '#28A745',
                customClass: {
                    title: 'swal-title'
                },
                buttonsStyling: false
            });
        }
    });
});
