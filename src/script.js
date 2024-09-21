
// Variables clave por sector para cada empresa
const variablesPorEmpresa = {
    "AWS": [
        { id: "tempServidores", label: "Temperatura de los servidores (°C)", type: "number" },
        { id: "tiempoRespuesta", label: "Tiempos de respuesta (ms)", type: "number" },
        { id: "usoCPU", label: "Uso de CPU (%)", type: "number" },
        { id: "downtime", label: "Tiempo sin actividad o downtime (horas)", type: "number" }
    ],
    "Lenovo": [
        { id: "velocidadEnsamblaje", label: "Velocidad de ensamblaje (unidades por hora)", type: "number" },
        { id: "desgasteBoquillas", label: "Desgaste de boquillas SMT (estado de boquillas)", type: "text" },
        { id: "erroresColocacion", label: "Errores de colocación (PPM - Partes por millón)", type: "number" },
        { id: "horasOperacion", label: "Horas de operación (horas)", type: "number" },
        { id: "vibracionesEquipo", label: "Vibraciones del equipo (Hz)", type: "number" }
    ],
    "Motorola": [
        { id: "fallasSoldadura", label: "Fallas de soldadura (unidades defectuosas)", type: "number" },
        { id: "consumoElectrico", label: "Consumo eléctrico (kW)", type: "number" },
        { id: "interferenciasRF", label: "Interferencias en señales RF", type: "text" },
        { id: "horasOperacion", label: "Horas de operación (horas)", type: "number" }
    ],
    "Danone": [
        { id: "presionLlenado", label: "Presión en los sistemas de llenado (PSI)", type: "number" },
        { id: "velocidadProduccion", label: "Velocidad de producción (botellas por minuto)", type: "number" },
        { id: "tempPasteurizacion", label: "Temperatura de pasteurización (°C)", type: "number" },
        { id: "paradasNoPlanificadas", label: "Paradas no planificadas (número)", type: "number" }
    ],
    "Bonafont": [
        { id: "consumoAgua", label: "Consumo de agua (litros)", type: "number" },
        { id: "velocidadLlenado", label: "Velocidad de llenado (botellas por minuto)", type: "number" },
        { id: "tempOperacion", label: "Temperatura de operación (°C)", type: "number" }
    ],
    "Kingston": [
        { id: "fallasPruebas", label: "Fallas en pruebas de calidad (unidades defectuosas)", type: "number" },
        { id: "horasUso", label: "Horas de uso del equipo de prueba (horas)", type: "number" },
        { id: "tempCamara", label: "Temperatura en cámaras de prueba (°C)", type: "number" }
    ]
};

// Function to create input fields based on selected company
document.getElementById('empresa').addEventListener('change', function () {
    const empresaSeleccionada = this.value;
    const campos = variablesPorEmpresa[empresaSeleccionada];
    const contenedor = document.getElementById('formCampos');
    contenedor.innerHTML = '';  // Limpiar campos anteriores

    // Crear campos de entrada dinámicamente
    campos.forEach(campo => {
        const label = document.createElement('label');
        label.innerText = campo.label;
        const input = document.createElement('input');
        input.type = campo.type;
        input.id = campo.id;
        input.required = true;
        contenedor.appendChild(label);
        contenedor.appendChild(input);
    });
});

// Validación de datos antes de procesar
function validarDatos(datos) {
    for (const key in datos) {
        if (isNaN(datos[key]) || datos[key] < 0) {
            return false; // Valor inválido encontrado
        }
    }
    return true;
}

// Calcular métricas para una empresa
function calcularMetricasEmpresa(empresa, datos) {
    let eficiencia = 0;
    let efectividad = 0;
    let probabilidadFallo = 0;

    // Lógica de cálculo personalizada según la empresa
    switch (empresa) {
        case "AWS":
            eficiencia = calcularEficiencia(datos.usoCPU, datos.downtime, datos.tempServidores);
            efectividad = calcularEfectividad(datos.usoCPU, datos.downtime);
            probabilidadFallo = calcularProbabilidadFallo(datos.tempServidores, 50);
            break;
        case "Lenovo":
            eficiencia = calcularEficiencia(datos.velocidadEnsamblaje, datos.horasOperacion, datos.vibracionesEquipo);
            efectividad = calcularEfectividad(datos.velocidadEnsamblaje, datos.erroresColocacion);
            probabilidadFallo = calcularProbabilidadFallo(datos.erroresColocacion, 1000000);
            break;
        case "Motorola":
            eficiencia = calcularEficiencia(datos.downtime, datos.horasOperacion, datos.consumoElectrico);
            efectividad = calcularEfectividad(100, datos.fallasSoldadura);
            probabilidadFallo = calcularProbabilidadFallo(datos.fallasSoldadura, 1000000);
            break;
        case "Danone":
            eficiencia = calcularEficiencia(datos.paradasNoPlanificadas, datos.horasOperacion, datos.velocidadProduccion);
            efectividad = calcularEfectividad(datos.velocidadProduccion, datos.paradasNoPlanificadas);
            probabilidadFallo = calcularProbabilidadFallo(datos.paradasNoPlanificadas, 1000);
            break;
        case "Bonafont":
            eficiencia = calcularEficiencia(datos.velocidadLlenado, datos.horasOperacion, datos.consumoAgua);
            efectividad = calcularEfectividad(datos.velocidadLlenado, datos.tempOperacion);
            probabilidadFallo = calcularProbabilidadFallo(datos.tempOperacion, 100);
            break;
        case "Kingston":
            eficiencia = calcularEficiencia(datos.horasUso, datos.tempCamara, datos.fallasPruebas);
            efectividad = calcularEfectividad(100, datos.fallasPruebas);
            probabilidadFallo = calcularProbabilidadFallo(datos.tempCamara, 100);
            break;
        default:
            return { error: "Empresa no reconocida" };
    }

    return { eficiencia, efectividad, probabilidadFallo };
}

// Funciones auxiliares para cálculo
function calcularEficiencia(param1, param2, param3) {
    return (param1 + param2) / (param3 || 1) * 100;  // Fórmula ejemplo
}

function calcularEfectividad(param1, param2) {
    return param1 / (param2 || 1) * 100;  // Fórmula ejemplo
}

function calcularProbabilidadFallo(param1, limite) {
    return Math.min(100, (param1 / limite) * 100);
}

// Function to update the displayed results in the HTML
function mostrarResultados(empresa, datos) {
    const metricas = calcularMetricasEmpresa(empresa, datos);
    if (metricas.error) {
        alert(metricas.error);
        return;
    }

    document.getElementById('resultadoEficiencia').innerText = metricas.eficiencia.toFixed(2);
    document.getElementById('resultadoEfectividad').innerText = metricas.efectividad.toFixed(2);
    document.getElementById('resultadoFallo').innerText = metricas.probabilidadFallo.toFixed(2);
}

// Capture form submit and calculate results
document.getElementById('formDatos').addEventListener('submit', function (e) {
    e.preventDefault();

    const empresa = document.getElementById('empresa').value;
    const campos = variablesPorEmpresa[empresa];
    const datos = {};

    campos.forEach(campo => {
        datos[campo.id] = parseFloat(document.getElementById(campo.id).value);
    });

    if (validarDatos(datos)) {
        mostrarResultados(empresa, datos);
    } else {
        alert("Por favor, ingrese valores válidos para todos los campos.");
    }
});
