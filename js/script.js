document.getElementById("leadForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Impede o reload
  e.stopPropagation(); // Garante que nenhum outro evento de submit dispare

  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const instagramInput = document.getElementById("instagram");
  const telefoneInput = document.getElementById("telefone");
  const alunoSim = document.getElementById("alunoSim");
  const alunoNao = document.getElementById("alunoNao");
  const infoAlunoInput = document.getElementById("infoAluno");

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const instagram = instagramInput.value.trim();
  const telefone = telefoneInput.value.trim();
  const jaAluno = alunoSim.checked ? "sim" : alunoNao.checked ? "nao" : "";
  const infoAluno = infoAlunoInput.value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telefoneRegex = /^\d{11}$/;

  [nomeInput, emailInput, instagramInput, telefoneInput, infoAlunoInput].forEach((input) =>
    input.classList.remove("is-invalid")
  );
  alunoSim.classList.remove("is-invalid");
  alunoNao.classList.remove("is-invalid");

  let hasError = false;

  if (!nome) { nomeInput.classList.add("is-invalid"); hasError = true; }
  if (!email || !emailRegex.test(email)) { emailInput.classList.add("is-invalid"); hasError = true; }
  if (!instagram || !instagram.startsWith("@")) { instagramInput.classList.add("is-invalid"); hasError = true; }
  if (!telefone || !telefoneRegex.test(telefone)) {
    telefoneInput.classList.add("is-invalid");
    telefoneInput.nextElementSibling.textContent = "Informe um número válido com 11 dígitos.";
    hasError = true;
  }
  if (!jaAluno) {
    alunoSim.classList.add("is-invalid");
    alunoNao.classList.add("is-invalid");
    hasError = true;
  }
  if (jaAluno === "sim" && !infoAluno) {
    infoAlunoInput.classList.add("is-invalid");
    hasError = true;
  }

  if (hasError) return false;

  const data = { nome, email, instagram, telefone, jaAluno, infoAluno: jaAluno === "sim" ? infoAluno : null };

try {
  const response = await fetch("https://8a9fb454d7a1.ngrok-free.app/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const result = await response.json();
    const driveUrl = result.url;

    // 🔸 Abre o link em nova aba imediatamente
    window.open(driveUrl, "_blank");

    // 🔸 Opcional: limpar o formulário e mostrar mensagem
    document.getElementById("leadForm").reset();
    alert("Cadastro realizado com sucesso! O material foi aberto em outra aba.");
  } else {
    alert("Erro ao enviar os dados. Tente novamente.");
  }
} catch (error) {
  console.error("Erro na requisição:", error);
  alert("Erro de conexão. Tente novamente.");
}

  return false; //impede QUALQUER comportamento padrão residual
});
