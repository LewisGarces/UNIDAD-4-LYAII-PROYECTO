const mostrarAlerta = (titulo, texto, icono, iconColor) => {
    Swal.fire({
        title: titulo,
        text: texto,
        icon: icono,
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        iconColor: iconColor,
        customClass: { title: 'swal-title' },
        buttonsStyling: false
    });
};
const convertirCodigo = (codigo, deJavaScriptAPHP = true) => {
    const esCodigoPHP = /<\?php|<\?=|\?>/g;
    if (esCodigoPHP.test(codigo)) {
        mostrarAlerta('Error', 'El código ya está en PHP y no puede convertirse nuevamente.', 'error', '#FF5733');
        return '';
    }
    const noEsCodigoJS = /[^a-zA-Z0-9\s\(\)\{\}\[\]\=\+\-\*\%\!\&\|\<\>\.\,\;\:]/g;
    if (noEsCodigoJS.test(codigo)) {
        mostrarAlerta('Error', 'Por favor, ingresa un código de JavaScript válido.', 'error', '#FF5733');
        return false;
    }
    const estructurasPHP = /\$\w+/g;
    if (estructurasPHP.test(codigo) && deJavaScriptAPHP) {
        mostrarAlerta('Error', 'No se puede convertir. El código contiene variables o estructuras de PHP.', 'error', '#FF5733');
        return '';
    }
    const tieneEstructuraControlJS = /\b(if|for|while|switch|function|return|else|try|catch|break|continue|let|var|const)\b/g;
    if (!tieneEstructuraControlJS.test(codigo)) {
        mostrarAlerta('Error', 'Por favor, ingresa un código JavaScript válido con estructuras de control.', 'error', '#FF5733');
        return '';
    }
    const conversionesJavaScriptAPHP = [
        { expresionRegular: /\b(let|const|var)\b/g, reemplazo: '$' },{ expresionRegular: /\bconsole\.log\(/g, reemplazo: 'echo ' },{ expresionRegular: /\bfunction\s+(\w+)/g, reemplazo: 'function $1' },{ expresionRegular: /\bfor\s*\((.*?)\)/g, reemplazo: 'foreach ($1)' },{ expresionRegular: /\b===\b/g, reemplazo: '==' },{ expresionRegular: /\b!==\b/g, reemplazo: '!=' },{ expresionRegular: /\btrue\b/g, reemplazo: 'true' },{ expresionRegular: /\bfalse\b/g, reemplazo: 'false' },{ expresionRegular: /\bnull\b/g, reemplazo: 'null' },{ expresionRegular: /\belse if\b/g, reemplazo: 'elseif' }
    ];
    const conversiones = deJavaScriptAPHP ? conversionesJavaScriptAPHP : conversionesPHPaJavaScript;
    let codigoConvertido = conversiones.reduce(
        (resultado, conversion) => resultado.replace(conversion.expresionRegular, conversion.reemplazo),
        codigo
    );
    if (deJavaScriptAPHP) {
        codigoConvertido = `<?php\n${codigoConvertido}\n?>`;
    }
    return codigoConvertido;
};
const validarCodigo = (codigo) => {
    const variables = /\b(let|const|var)\s+[^\s;]+[^;]*$/g;
    const arrays = /\[.*[^\]]/g;
    if (variables.test(codigo)) {
        mostrarAlerta('Error', 'Por favor, asegúrate de definir las variables correctamente (debe terminar con un punto y coma).', 'error', '#FF5733');
        return false;
    }
    if (arrays.test(codigo)) {
        mostrarAlerta('Error', 'Asegúrate de que los arrays estén correctamente formados y cerrados.', 'error', '#FF5733');
        return false;
    }
    return true;
};
const procesarCodigo = () => {
    const codigoEntrada = document.getElementById('entradaJS').value.trim();
    if (!codigoEntrada) {
        mostrarAlerta('Error', 'Por favor ingresa código en el campo.', 'error', '#FF5733');
        return;
    }
    if (!validarCodigo(codigoEntrada)) return;
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
                mostrarAlerta('Conversión exitosa', 'Código convertido a PHP.', 'success', '#28A745');
            }
        }
    });
};
const copiarAlPortapapeles = () => {
    const codigoConvertido = document.getElementById('salidaPHP').value.trim();
    if (!codigoConvertido) {
        mostrarAlerta('Error', 'No hay código para copiar.', 'error', '#FF5733');
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
                .then(() => mostrarAlerta('¡Copiado!', 'El código ha sido copiado al portapapeles.', 'success', '#28A745'))
                .catch(() => mostrarAlerta('Error', 'Hubo un problema al copiar el código.', 'error', '#FF5733'));
        }
    });
};
const limpiarCampos = () => {
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
            document.getElementById('entradaJS').value = '';
            document.getElementById('salidaPHP').value = '';
            mostrarAlerta('Limpieza exitosa', 'Todos los campos han sido limpiados.', 'success', '#28A745');
        }
    });
};
document.getElementById('btnGenerar').addEventListener('click', procesarCodigo);
document.getElementById('btnCopiar').addEventListener('click', copiarAlPortapapeles);
document.getElementById('btnLimpiar').addEventListener('click', limpiarCampos);
