import { TitlePage } from "@/components/TitlePage";
import FormRegister from "./components/FormRegister";

export default function Register() {
  return (
    <main>
      <TitlePage title="Cadastro de usuário" />
      <FormRegister />
    </main>
  );
}
