import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { DefaultInput } from "../../components/DefaultInput";
import { useAuthContext } from "../../contexts/TaskContext/AuthContext";
import { showMessage } from "../../adapters/showMessage";
import styles from "./styles.module.css";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!username.trim()) {
      showMessage.warn("Informe o nome de usuário");
      return;
    }

    if (!password) {
      showMessage.warn("Informe a senha");
      return;
    }

    if (login(username, password)) {
      showMessage.success("Bem-vindo!");
      navigate("/home");
    } else {
      showMessage.error("Usuário ou senha inválidos");
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>Bem-vindo</h1>
        <p className={styles.subtitle}>Faça login para continuar</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <DefaultInput
              id="login-user"
              labelText="Usuário"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <DefaultInput
              id="login-pass"
              labelText="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.btnPrimary}>
            Entrar
          </button>
        </form>

        <div className={styles.divider}>ou</div>

        <button
          type="button"
          className={styles.btnGhost}
          onClick={() => showMessage.info("Cadastro em breve")}
        >
          Cadastrar
        </button>

        <div className={styles.forgot}>
          <button
            type="button"
            onClick={() => showMessage.info("Recuperação em breve")}
          >
            Esqueci minha senha
          </button>
        </div>
      </div>
    </div>
  );
}