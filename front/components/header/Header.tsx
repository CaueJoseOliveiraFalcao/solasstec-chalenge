import { useState } from 'react';
import './header.css';

export default function Header() {
  const [menu, setMenu] = useState<boolean>(false);

  return (
    <div className="relative">
      {/* Menu lateral */}
      <div
        className={`bg-gray-300 text-white fixed top-0 right-0 w-80 h-screen p-6 transition-transform duration-300 ease-in-out z-50 shadow-lg ${
          menu ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <img
          src="./x.png"
          alt="Fechar menu"
          className="w-6 absolute top-4 right-4 cursor-pointer hover:scale-110 transition-transform"
          onClick={() => setMenu(false)}
        />
        <nav className="mt-16 space-y-6 text-lg font-medium">
        <a href="/visitante" className="block hover:text-blue-300 transition-colors">
            Gerenciar Visitas
        </a>
        <a href="/feriado" className="block hover:text-blue-300 transition-colors">
            Gerenciar Feriados
        </a>
        <a href="/responsavel" className="block hover:text-blue-300 transition-colors">
            Gerenciar Responsáveis por Salas
        </a>
        <a href="/sala" className="block hover:text-blue-300 transition-colors">
            Gerenciar Salas
        </a>
        <a href="/agendamento" className="block hover:text-blue-300 transition-colors">
            Gerenciar Agendamentos
        </a>
        </nav>
      </div>

      {/* Cabeçalho */}
      <header className="w-full h-20 flex justify-between items-center px-6 bg-white shadow-md">
        <img src="./solastehcLogo.png" alt="Logo" className="w-48" />
        <img
          src="./menu-icon.png"
          alt="Abrir menu"
          className="w-6 cursor-pointer hover:scale-110 transition-transform"
          onClick={() => setMenu(true)}
        />
      </header>
    </div>
  );
}
