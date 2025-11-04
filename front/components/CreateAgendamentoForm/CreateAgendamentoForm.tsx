import { useEffect, useState } from "react";
import api from "../../app/api";
import '../CreateVisitantForm/CreateVisitantForm.css'
import ErrorComponent from "../Error/ErrorComponent";
import BaseForm from "../BaseForm";
interface Visitante {
    id: number
    nome: string
}
interface Sala {
    id: number
    nome: string
}
interface ModalFunction {
    setOpenCreateModal : (value : boolean) => void;
}
export default function CreateAgendamentoForm({ setOpenCreateModal } : ModalFunction) {
    const handleClose = () => {
        setOpenCreateModal(false);
    };

    const [salas, setSalas] = useState<Sala[]>([])
    const [visitantes, setVisitantes] = useState<Visitante[]>([]);
    const [visitanteSelecionado, setVisitanteSelecionado] = useState<number | ''>('');
    const [salaSelecionada, setSalaSelecionada] = useState<number | ''>('');
    const [dataAgendada, setDataAgendada] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFim, setHoraFim] = useState('');


    useEffect(() => {
        GetVisitants();
        GetSalas();
    },[])
    const GetVisitants = async () => {
        try {
            const res = await api.get('/visitante');
            setVisitantes(res.data)
        }
        catch(error) {
            console.log(error);
        }
    }
    const GetSalas = async () => {
        try {
            const res = await api.get('/sala');
            setSalas(res.data);
        } catch(error : any) {
            console.log(error.message)
        }
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {        
            const data = {
                visitante_id : visitanteSelecionado,
                sala_id : salaSelecionada, 
                data_agendada : dataAgendada,
                hora_inicio : horaInicio,
                hora_fim : horaFim,
            }
            console.log(data);
            const response = await api.post('/agendamento', data);
            if (response.data.action === 'insertNewDateAutomaticly'){
                alert(`${response.data.message} , nova data sugerida : ${response.data.data}`);
                setDataAgendada(response.data.data);
            }
            setTimeout(() => {
                console.log('Agendamento criado com sucesso!');
            }, 2000)
        }catch (error : any){
            if (error.response && error.response.data) {
                const { message, error: errType } = error.response.data;
                alert( message || 'Ocorreu um erro ao enviar.');
            } else {
                console.log('Não foi possível conectar ao servidor.');
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center  justify-center bg-gray-950/50 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-xl w-full overflow-hidden"
                    style={{ maxWidth: 900, maxHeight: 700 }}>
                <div className="overflow-y-auto p-6" style={{ maxHeight: 700 }}>
                    <div className="flex justify-center items-center  flex-col">
                        <BaseForm>
                            <button className="font-bold cursor-pointer" onClick={() => setOpenCreateModal(false)}>X</button>
                            <h1 className="mt-4 mb-2 text-2xl font-bold">Novo Agendamento</h1>

                            <form onSubmit={handleSubmit} className="flex flex-col">
                                <div className="flex w-full gap-5 flex-row">
                                    <div className="w-1/2">
                                        <label htmlFor="responsavel">Visitante</label>
                                        <select
                                            required
                                            value={visitanteSelecionado}
                                            onChange={(e) => setVisitanteSelecionado(Number(e.target.value))}
                                            
                                        >
                                            <option value="">Selecione um visitante</option>
                                            {visitantes.map(resp => (
                                                <option key={resp.id} value={resp.id}>{resp.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-1/2">
                                        <label htmlFor="responsavel">Sala</label>
                                        <select
                                            required
                                            value={salaSelecionada}
                                            onChange={(e) => setSalaSelecionada(Number(e.target.value))}
                                            
                                        >
                                            <option value="">Selecione uma Sala</option>
                                            {salas.map(resp => (
                                                <option key={resp.id} value={resp.id}>{resp.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                    <div className="w-full mt-2">
                                        <label htmlFor="nome">Data</label>
                                        <input
                                            type="date"
                                            value={dataAgendada}
                                            onChange={(e) => setDataAgendada(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                <strong className="my-2">Horas Disponiveis : </strong>
                                <div className="flex w-full gap-5 flex-row">

                                    <div className="w-1/2">
                                        <p>Hora Inicio</p>
                                        <input 
                                            type="time"  
                                            disabled={!dataAgendada}
                                            value={horaInicio}
                                            onChange={(e) => setHoraInicio(e.target.value)}
                                            required />
                                    </div>
                                    <div className="w-1/2">
                                        <p>Hora Fim</p>
                                        <input 
                                            disabled={!dataAgendada}
                                            type="time"  
                                            value={horaFim}
                                            onChange={(e) => setHoraFim(e.target.value)}
                                            required />
                                    </div>
                                </div>
                                <input
                                    type="submit"
                                    value="Enviar"
                                    className="enviar"
                                />
                            </form>
                        </BaseForm>
                    </div>
                </div>
            </div>
            
        </div>

        
            
    );
}
