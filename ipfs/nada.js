// Obtén el timestamp en nanosegundos
let timestampInNanoseconds = BigInt("1707681748872206383");

// Conviértelo a milisegundos
let timestampInMilliseconds = Number(timestampInNanoseconds / BigInt(1000000));

// Crea un objeto Date con el timestamp
let date = new Date(timestampInMilliseconds);

// Formatea la fecha y hora
let options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
let formattedDate = date.toLocaleString('es-MX', options);

console.log(`Desactivado desde ${formattedDate}`);
