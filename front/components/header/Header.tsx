
import './header.css'

export default function Header(){
    return(
        <div className="w-full h-20 flex justify-around items-center bg-white">
            <img className='w-56' src="./solastehcLogo.png" alt="" />
            <div>
                <a href="/visitante">Vistante Manager</a>
                <a href="/salas">salas Manager</a>
                <a href="/agenda">agenda Manager</a>
                <a href="/feriado">feriado Manager</a>
            </div>
        </div>
    )
}