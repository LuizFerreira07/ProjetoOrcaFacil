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