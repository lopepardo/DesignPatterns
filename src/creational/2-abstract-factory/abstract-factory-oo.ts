interface Button {
  render(): string;
}

interface Modal {
  render(): string;
}

interface UIThemeFactory {
  createButton(): Button;
  createModal(): Modal;
}

class LightButton implements Button {
  render(): string {
    return "Botón claro";
  }
}

class LightModal implements Modal {
  render(): string {
    return "Modal claro";
  }
}

class DarkButton implements Button {
  render(): string {
    return "Botón oscuro";
  }
}

class DarkModal implements Modal {
  render(): string {
    return "Modal oscuro";
  }
}

export class LightThemeFactory implements UIThemeFactory {
  createButton(): Button {
    return new LightButton();
  }

  createModal(): Modal {
    return new LightModal();
  }
}

export class DarkThemeFactory implements UIThemeFactory {
  createButton(): Button {
    return new DarkButton();
  }

  createModal(): Modal {
    return new DarkModal();
  }
}

export function renderPage(factory: UIThemeFactory) {
  const button = factory.createButton();
  const modal = factory.createModal();

  console.log(button.render());
  console.log(modal.render());
}
