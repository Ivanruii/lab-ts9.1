import "./style.css";

type TipoIva =
    | "general"
    | "reducido"
    | "superreducidoA"
    | "superreducidoB"
    | "superreducidoC"
    | "sinIva";

interface Producto {
    nombre: string;
    precio: number;
    tipoIva: TipoIva;
}

interface LineaTicket {
    producto: Producto;
    cantidad: number;
}

const productos: LineaTicket[] = [
    {
        producto: {
            nombre: "Legumbres",
            precio: 2,
            tipoIva: "general",
        },
        cantidad: 2,
    },
    {
        producto: {
            nombre: "Perfume",
            precio: 20,
            tipoIva: "general",
        },
        cantidad: 3,
    },
    {
        producto: {
            nombre: "Leche",
            precio: 1,
            tipoIva: "superreducidoC",
        },
        cantidad: 6,
    },
    {
        producto: {
            nombre: "Lasaña",
            precio: 5,
            tipoIva: "superreducidoA",
        },
        cantidad: 1,
    },
];

interface ResultadoLineaTicket {
    nombre: string;
    cantidad: number;
    precioSinIva: number;
    tipoIva: TipoIva;
    precioConIva: number;
}

interface ResultadoTotalTicket {
    totalSinIva: number;
    totalConIva: number;
    totalIva: number;
}

interface TotalPorTipoIva {
    tipoIva: TipoIva;
    cuantia: number;
}

const calcularPrecioConIva = (precio: number, tipoIvaValue: number, cantidad: number): number => {
    const precioSinIva = parseFloat((precio * cantidad).toFixed(2));
    const precioConIva = parseFloat((precioSinIva * (1 + tipoIvaValue)).toFixed(2));
    return precioConIva;
};

const calcularTotales = (lineasCalculadas: ResultadoLineaTicket[]): ResultadoTotalTicket => {
    const totalSinIva = parseFloat(lineasCalculadas.reduce((total, linea) => (total + linea.precioSinIva), 0).toFixed(2));
    const totalIva = parseFloat(lineasCalculadas.reduce((total, linea) => (total + linea.precioConIva - linea.precioSinIva), 0).toFixed(2));
    const totalConIva = parseFloat((totalSinIva + totalIva).toFixed(2));

    return {
        totalSinIva,
        totalConIva,
        totalIva,
    };
};

const calcularDesgloseIva = (lineasCalculadas: ResultadoLineaTicket[]): TotalPorTipoIva[] => {
    const desgloseIva = lineasCalculadas.reduce((resultado, linea) => {
        const tipoExistente = resultado.find((item) => item.tipoIva === linea.tipoIva);
        const cuantia = parseFloat((linea.precioConIva - linea.precioSinIva).toFixed(2));
        if (tipoExistente) {
            tipoExistente.cuantia += cuantia;
        } else {
            resultado.push({
                tipoIva: linea.tipoIva,
                cuantia: cuantia,
            });
        }
        return resultado;
    }, [] as TotalPorTipoIva[]);

    return desgloseIva;
};

const calculaTicket = (lineasTicket: LineaTicket[]): {
    lineas: ResultadoLineaTicket[];
    total: ResultadoTotalTicket;
    desgloseIva: TotalPorTipoIva[];
} => {
    const lineasCalculadas = lineasTicket.map((linea) => {
        const { producto, cantidad } = linea;
        const { precio, tipoIva } = producto;
        
        let tipoIvaValue = 0;
        switch (tipoIva) {
            case "general":
                tipoIvaValue = 0.21;
                break;
            case "reducido":
                tipoIvaValue = 0.10;
                break;
            case "superreducidoA":
                tipoIvaValue = 0.05;
                break;
            case "superreducidoB":
                tipoIvaValue = 0.04;
            default:
                tipoIvaValue = 0;
        }

        const precioConIva = calcularPrecioConIva(precio, tipoIvaValue, cantidad);

        return {
            nombre: producto.nombre,
            cantidad,
            precioSinIva: precio * cantidad,
            tipoIva,
            precioConIva,
        };
    });

    const resultadoTotal = calcularTotales(lineasCalculadas);
    const desgloseIva = calcularDesgloseIva(lineasCalculadas);

    return {
        lineas: lineasCalculadas,
        total: resultadoTotal,
        desgloseIva,
    };
};

const ticketCalculado = calculaTicket(productos);

console.log(ticketCalculado);