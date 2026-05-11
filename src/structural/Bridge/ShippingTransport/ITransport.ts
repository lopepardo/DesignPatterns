export interface ITransport {
  centerDistributionCityOrigin(): void;
  sending(): void;
  centerDistributionDestinationCity(): void;
  deliveryFinished(): void;
}

export class ShippingGround implements ITransport {
  centerDistributionCityOrigin(): void {
    console.log("El paquete sera cargado en el camión de envios.");
  }
  sending(): void {
    console.log("El paquete a sido enviado por tierra...");
  }
  centerDistributionDestinationCity(): void {
    console.log("El camión ha llegado a la ciudad destino.");
  }
  deliveryFinished(): void {
    console.log("Ya tienes tu paquete!! Entrega finalizada.");
  }
}

export class ShippingSea implements ITransport {
  centerDistributionCityOrigin(): void {
    console.log("El paquete sera cargado en el barco de envios.");
  }
  sending(): void {
    console.log("El paquete a sido enviado por mar...");
  }
  centerDistributionDestinationCity(): void {
    console.log("El barco ha llegado a la ciudad destino.");
  }
  deliveryFinished(): void {
    console.log("Ya tienes tu paquete!! Entrega finalizada.");
  }
}

export class ShippingAir implements ITransport {
  centerDistributionCityOrigin(): void {
    console.log("El paquete sera cargado en el avión de envios.");
  }
  sending(): void {
    console.log("El paquete a sido enviado por aire...");
  }
  centerDistributionDestinationCity(): void {
    console.log("El avión ha llegado a la ciudad destino.");
  }
  deliveryFinished(): void {
    console.log("Ya tienes tu paquete!! Entrega finalizada.");
  }
}
