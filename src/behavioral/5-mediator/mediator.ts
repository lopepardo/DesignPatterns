type LoginState = {
  email: string;
  password: string;
};

export const createLoginMediator = () => {
  const state: LoginState = {
    email: "",
    password: "",
  };

  const canSubmit = (): boolean => {
    return state.email.length > 0 && state.password.length > 0;
  };

  return {
    updateEmail(email: string) {
      state.email = email;
      console.log("Submit enabled:", canSubmit());
    },

    updatePassword(password: string) {
      state.password = password;
      console.log("Submit enabled:", canSubmit());
    },

    submit() {
      if (!canSubmit()) {
        console.log("Formulario incompleto");
        return;
      }

      console.log("Enviando login", state);
    },
  };
};
