import { ITransport } from "../ShippingTransport/ITransport";

export class ShippingCompany {
  private nameCompany: string;
  private shipping: ITransport;

  constructor(nameCompany: string, shipping: ITransport) {
    this.nameCompany = nameCompany;
    this.shipping = shipping;
  }

  public receivedPackage(): void {
    console.log(
      `El paquete a sido recibido en el centro logistico de [${this.nameCompany}] de la ciudad de origen`
    );
    this.shipping.centerDistributionCityOrigin();
  }

  public sending(): void {
    console.log(`El paquete a sido enviado por [${this.nameCompany}].`);
    this.shipping.sending();
  }

  public deliveredPackage(): void {
    this.shipping.centerDistributionDestinationCity();
    console.log(
      `El paquete a sido recibido en el centro logistico de [${this.nameCompany}] de la ciudad destino.`
    );
  }

  public deliveryFinished(): void {
    this.shipping.deliveryFinished();
  }
}
