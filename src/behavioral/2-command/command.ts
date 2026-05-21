type Command = () => void;

export const editor = {
  copy() {
    console.log("Copiando texto");
  },

  paste() {
    console.log("Pegando texto");
  },
};

export const createButton = (command: Command) => {
  return {
    click() {
      command();
    },
  };
};
