document.getElementById("leadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

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
  const telefoneRegex = /^\d{11}$/; // Apenas 11 dígitos numéricos

  // Remove classes de erro anteriores
  [
    nomeInput,
    emailInput,
    instagramInput,
    telefoneInput,
    infoAlunoInput,
  ].forEach((input) => input.classList.remove("is-invalid"));

  alunoSim.classList.remove("is-invalid");
  alunoNao.classList.remove("is-invalid");

  let hasError = false;

  // Validações existentes
  if (!nome) {
    nomeInput.classList.add("is-invalid");
    hasError = true;
  }

  if (!email || !emailRegex.test(email)) {
    emailInput.classList.add("is-invalid");
    hasError = true;
  }

  if (!instagram || !instagram.startsWith("@")) {
    instagramInput.classList.add("is-invalid");
    hasError = true;
  }

  if (!telefone || !telefoneRegex.test(telefone)) {
    telefoneInput.classList.add("is-invalid");
    telefoneInput.nextElementSibling.textContent =
      "Informe um número válido com 11 dígitos.";
    hasError = true;
  }

  // 🔸 Nova validação: Já é nosso aluno?
  if (!jaAluno) {
    alunoSim.classList.add("is-invalid");
    alunoNao.classList.add("is-invalid");
    hasError = true;
  }

  // 🔸 Nova validação: campo condicional "Qual curso ou turma?"
  if (jaAluno === "sim" && !infoAluno) {
    infoAlunoInput.classList.add("is-invalid");
    hasError = true;
  }

  if (hasError) return;

  // Monta objeto final a ser enviado
  const data = {
    nome,
    email,
    instagram,
    telefone,
    jaAluno,
    infoAluno: jaAluno === "sim" ? infoAluno : null,
  };

  try {
    const response = await fetch("https://539f57658fc9.ngrok-free.app/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      document.getElementById("leadForm").classList.add("d-none");
      const downloadDiv = document.getElementById("download");
      downloadDiv.classList.remove("d-none");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const downloadBtn = document.getElementById("download-btn");
      downloadBtn.href = url;
      downloadBtn.download = "meu-arquivo.pdf";
      downloadBtn.click();
    } else {
      alert("Erro ao enviar os dados. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro de conexão. Tente novamente.");
  }
});