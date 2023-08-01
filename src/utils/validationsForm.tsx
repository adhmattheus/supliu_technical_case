import * as Yup from "yup";

export const albumValidationSchema = Yup.object().shape({
  name: Yup.string().required("O nome do álbum é obrigatório"),
  year: Yup.number()
    .integer("O ano deve ser um número inteiro")
    .min(1900, "Insira um ano maior a partir de 1900")
    .max(new Date().getFullYear(), "Ano inválido")
    .required("O ano é obrigatório")
});

export const trackValidationSchema = Yup.object().shape({
  title: Yup.string().required("O título da faixa é obrigatório"),
  duration: Yup.string().required("A duração da faixa é obrigatória"),
  number: Yup.number()
    .typeError("O número da faixa deve ser um valor numérico") // Mensagem de erro caso não seja um número
    .integer("O número da faixa deve ser um número inteiro") // Verifica se é um número inteiro
    .min(1, "O número da faixa deve ser maior que 0") // Verifica se é maior que 0
    .required("O número da faixa é obrigatório"), // Verifica se é obrigatório
});