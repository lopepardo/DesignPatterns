interface LoginFormMediator {
  notify(sender: unknown, event: string): void;
}

export class TextInput {
  private value = "";

  constructor(
    private name: string,
    private mediator: LoginFormMediator,
  ) {}

  setValue(value: string): void {
    this.value = value;
    this.mediator.notify(this, "inputChanged");
  }

  getValue(): string {
    return this.value;
  }

  getName(): string {
    return this.name;
  }
}

export class Button {
  private enabled = false;

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    console.log(`Botón ${enabled ? "habilitado" : "deshabilitado"}`);
  }

  click(): void {
    if (!this.enabled) {
      console.log("No se puede enviar: botón deshabilitado");
      return;
    }

    console.log("Formulario enviado");
  }
}

export class LoginMediator implements LoginFormMediator {
  constructor(
    private emailInput: TextInput,
    private passwordInput: TextInput,
    private submitButton: Button,
  ) {}

  notify(sender: unknown, event: string): void {
    if (event === "inputChanged") {
      const canSubmit =
        this.emailInput.getValue().length > 0 &&
        this.passwordInput.getValue().length > 0;

      this.submitButton.setEnabled(canSubmit);
    }
  }
}
