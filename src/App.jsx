import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import './App.css';

// 1. Criamos o componente do formulário separado
function FormularioCastracao() {
  const [dadosFormulario, setDadosFormulario] = useState({
    nomePaciente: '',
    cpf: '',
    motivo: '',
    termoConsentimento: false,
  });

  const lidarComMudanca = (evento) => {
    const { name, value, type, checked } = evento.target;
    setDadosFormulario({
      ...dadosFormulario,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const enviarFormulario = (evento) => {
    evento.preventDefault(); 
    console.log('Dados registrados:', dadosFormulario);
    alert('Formulário registrado com sucesso! Verifique o console.');
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Registro de Procedimento: Castração Química</h2>
      <p style={{ color: '#555', marginBottom: '20px' }}>
        Preencha os dados do paciente e o escopo do procedimento.
      </p>

      <form onSubmit={enviarFormulario} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Campo: Nome */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="nomePaciente">Nome do Paciente:</label>
          <input
            type="text"
            id="nomePaciente"
            name="nomePaciente"
            value={dadosFormulario.nomePaciente}
            onChange={lidarComMudanca}
            required
            style={{ padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* Campo: CPF */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="cpf">CPF:</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={dadosFormulario.cpf}
            onChange={lidarComMudanca}
            required
            style={{ padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* Campo: Motivo/Diagnóstico */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="motivo">Motivo Clínico / Ordem Legal:</label>
          <select
            id="motivo"
            name="motivo"
            value={dadosFormulario.motivo}
            onChange={lidarComMudanca}
            required
            style={{ padding: '8px', marginTop: '5px' }}
          >
            <option value="">Selecione uma opção...</option>
            <option value="tratamento_oncologico">Tratamento Oncológico</option>
            <option value="reducao_libido">Redução de Libido (Ordem Judicial)</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        {/* Campo: Consentimento */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
          <input
            type="checkbox"
            id="termoConsentimento"
            name="termoConsentimento"
            checked={dadosFormulario.termoConsentimento}
            onChange={lidarComMudanca}
            required
          />
          <label htmlFor="termoConsentimento">
            Confirmo que o paciente ou responsável legal assinou o termo de consentimento/ciência.
          </label>
        </div>

        {/* Botão de Envio */}
        <button 
          type="submit" 
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#007BFF', 
            color: '#FFF', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            marginTop: '10px',
            fontSize: '16px'
          }}
        >
          Registrar Procedimento
        </button>
      </form>
    </div>
  );
}

// 2. Aqui é o App principal. Ele simplesmente "chama" o formulário para aparecer na tela.
function App() {
  return (
    <div>
      <FormularioCastracao />
    </div>
  );
}

// 3. Exportamos o App de forma correta no final do arquivo (e apenas uma vez)
export default App;