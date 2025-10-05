document.getElementById("leadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const instagramInput = document.getElementById("instagram");
  const telefoneInput = document.getElementById("telefone");

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const instagram = instagramInput.value.trim();
  const telefone = telefoneInput.value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telefoneRegex = /^\d{11}$/; // Apenas 11 dígitos numéricos

  // Remove classes de erro
  [nomeInput, emailInput, instagramInput, telefoneInput].forEach(input =>
    input.classList.remove("is-invalid")
  );

  let hasError = false;

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
    hasError = true; 
    telefoneInput.nextElementSibling.textContent = "Informe um número válido com 11 dígitos."; // Mensagem específica
  }

  if (hasError) return;

  const data = { nome, email, instagram, telefone };

  try {
    const response = await fetch("https://48cfc6616724.ngrok-free.app/leads", {
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
