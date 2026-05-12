type Theme = "light" | "dark";
type Button = {
  render(): string;
};
type Modal = {
  render(): string;
};
type UIThemeFactory = {
  createButton(): Button;
  createModal(): Modal;
};

const lightThemeFactory: UIThemeFactory = {
  createButton() {
    return {
      render: () => "Botón claro",
    };
  },

  createModal() {
    return {
      render: () => "Modal claro",
    };
  },
};

const darkThemeFactory: UIThemeFactory = {
  createButton() {
    return {
      render: () => "Botón oscuro",
    };
  },

  createModal() {
    return {
      render: () => "Modal oscuro",
    };
  },
};

const factories: Record<Theme, UIThemeFactory> = {
  light: lightThemeFactory,
  dark: darkThemeFactory,
};

export function getThemeFactory(theme: Theme): UIThemeFactory {
  return factories[theme];
}

export function renderSettingsPage(factory: UIThemeFactory) {
  const button = factory.createButton();
  const modal = factory.createModal();

  console.log(button.render());
  console.log(modal.render());
}
