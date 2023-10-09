let cuota = 0; // Declaración de cuota fuera del evento submit

let resultados = []

const tabla = document.getElementById("cuadroAmortizacion");
const tablaCuotaEncontrada = document.getElementById("cuotaEncontrada");

// Comprueba si ya hay datos en localStorage
const resultadosEnLS = JSON.parse(localStorage.getItem("arrayResultados"));
if (resultadosEnLS && resultadosEnLS.length > 0) {
    tabla.innerHTML = "<table><tr><th>N° de Cuota</th><th>Cuota a pagar</th><th>Intereses</th><th>Capital amortizado</th><th>Capital vivo</th></tr><tr><td>0</td><td>-</td><td>-</td><td>-</td><td>"  + resultadosEnLS[0].capitalIniciialMostado+ "</td></tr></table>";
    for (let i = 1; i < resultadosEnLS.length; i++) {
        tabla.innerHTML += `<tr><td>${resultadosEnLS[i].numeroCuota}</td><td>${resultadosEnLS[i].cuotaMostrada}</td><td>${resultadosEnLS[i].interesMostrado}</td><td>${resultadosEnLS[i].capitalAmortizadoMostrado}</td><td>${resultadosEnLS[i].capitalVivoMostrado}</td></tr>`;
    }
} else {
    tabla.innerHTML = "<table><tr><th>N° de Cuota</th><th>Cuota a pagar</th><th>Intereses</th><th>Capital amortizado</th><th>Capital vivo</th></tr></table>";
}
document.getElementById("miFormulario").addEventListener("submit", function (event) {
    event.preventDefault();
    resultados=[];
    const prestamo = {
        prestamoPedido: parseInt(document.getElementById("monto_prestamo").value),
        periodo: parseInt(document.getElementById("cantidad_cuotas").value),
        tasaDeInteres: document.getElementById("tasa_de_interes").value / 100,
        
    }
    let capitalIniciialMostado= "$ " + prestamo.prestamoPedido

    const objCapitalInicial = {
        capitalIniciialMostado: capitalIniciialMostado
    };
    resultados.push(objCapitalInicial);
    
    
    if (prestamo.prestamoPedido < 100000) {
        alert("El monto ingresado debe ser mayor a $100,000. Intente de nuevo");
        return; // Salir de la función si no se cumple la condición
    }

    function calcularCuota(prestamo, tasaDeInteres, periodo) {
        // Convierte la tasa de interés anual a tasa periódica
        const tasaPeriodica = tasaDeInteres / 12; // Suponiendo que la tasa es anual y se paga mensualmente

        // Calcula la cuota utilizando la fórmula del sistema de amortización francés
        const cuota = (prestamo * tasaPeriodica * Math.pow(1 + tasaPeriodica, periodo)) / (Math.pow(1 + tasaPeriodica, periodo) - 1);

        return cuota;
    }

    cuota = calcularCuota(prestamo.prestamoPedido, prestamo.tasaDeInteres, prestamo.periodo); // Asignación de cuota

    let cuotaMostrada=  "$" + cuota.toFixed(2)

    const tasaPeriodica = prestamo.tasaDeInteres / 12;
    
    const tabla = document.getElementById("cuadroAmortizacion")
    tabla.innerHTML = `
    <table>
        <tr>
            <th>N° de Cuota</th>
            <th>Cuota a pagar</th>
            <th>Intereses</th>
            <th>Capital amortizado</th>
            <th>Capital vivo</th>
        </tr>
        <tr>
            <td>0</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>${capitalIniciialMostado}</td>
        </tr>
`;


    


    let capitalVivo = prestamo.prestamoPedido;
    // este for hace los calculos correspondientes y los mete en un array
    for (let i = 1; i <= prestamo.periodo; i++) {
        let numeroCuota = i;

        //duplique las variables para que los calculos se hagan teniendo en cuenta todos los decimales y poder obtener un reseltado exacto
        // en la tabla se muestran los resultados redondeados a 2 decimales para una mejor visualizacion
        let interes = capitalVivo * tasaPeriodica;
        let interesMostrado = "$ " + interes.toFixed(2);

        let capitalAmortizado = cuota - interes;
        let capitalAmortizadoMostrado = "$ " + capitalAmortizado.toFixed(2);

        capitalVivo -= capitalAmortizado;
        let capitalVivoMostrado= "$ " + capitalVivo.toFixed(2)

        if (capitalVivoMostrado <= 0 ) {
            capitalVivoMostrado=0
        }

        const cuotaObjeto = {
            numeroCuota: numeroCuota,
            cuota: cuota,
            interes: interes,
            capitalAmortizado: capitalAmortizado,
            capitalVivo: capitalVivo,
            interesMostrado: interesMostrado,
            capitalAmortizadoMostrado: capitalAmortizadoMostrado,
            capitalVivoMostrado: capitalVivoMostrado,
            cuotaMostrada:cuotaMostrada
        };

        resultados.push(cuotaObjeto)
    }

    localStorage.setItem("arrayResultados", JSON.stringify(resultados)) 
    
    console.log(resultadosEnLS)
     // este for busca los datos dentro del array "resultadosEnLs" y los muestra en una tabla
    for (let i = 1; i < resultadosEnLS.length; i++) {
        tabla.innerHTML += `<tr><td>${resultadosEnLS[i].numeroCuota}</td><td>${resultadosEnLS[i].cuotaMostrada}</td><td>${resultadosEnLS[i].interesMostrado}</td><td>${resultadosEnLS[i].capitalAmortizadoMostrado}</td><td>${resultadosEnLS[i].capitalVivoMostrado}</td></tr>`;
    }

    
    

    document.getElementById("buscarCuotaBtn").addEventListener("click", function () {
        const numeroCuotaBuscar = parseInt(document.getElementById("numeroCuotaBuscar").value);
        const cuotaEncontrada = resultados.find((cuotaObjeto) => cuotaObjeto.numeroCuota === numeroCuotaBuscar);
        
        const tablaCuotaEncontrada = document.getElementById("cuotaEncontrada");
    
        if (cuotaEncontrada) {
            tablaCuotaEncontrada.innerHTML = `
                <table>
                    <tr>
                        <th>N° de Cuota</th>
                        <th>Cuota a pagar</th>
                        <th>Intereses</th>
                        <th>Capital amortizado</th>
                        <th>Capital vivo</th>
                    </tr>
                    <tr>
                        <td>${cuotaEncontrada.numeroCuota}</td>
                        <td>${cuotaEncontrada.cuotaMostrada}</td>
                        <td>${cuotaEncontrada.interesMostrado}</td>
                        <td>${cuotaEncontrada.capitalAmortizadoMostrado}</td>
                        <td>${cuotaEncontrada.capitalVivoMostrado}</td>
                    </tr>
                </table>
            `;
        } else {
            tablaCuotaEncontrada.innerHTML = "Cuota no encontrada";
        }
    });
    
})

document.getElementById("limpiarBtn").addEventListener("click", function(){
        localStorage.clear();
        tabla.innerHTML = "<table><tr><th>N° de Cuota</th><th>Cuota a pagar</th><th>Intereses</th><th>Capital amortizado</th><th>Capital vivo</th></tr></table>";
        tablaCuotaEncontrada.innerHTML = "";
    

})

