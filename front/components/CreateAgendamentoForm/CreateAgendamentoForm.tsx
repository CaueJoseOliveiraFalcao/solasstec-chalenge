import { useEffect, useState } from "react";
import api from "../../app/api";
import '../GenericInputs.css'
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
interface HorariosLivres {
  inicio: string;
  fim: string;
}
interface AvailableHours {
    init : string;
    end : string;
    livre : HorariosLivres[];
}
export default function CreateAgendamentoForm({ setOpenCreateModal } : ModalFunction) {
    const handleClose = () => {
        setOpenCreateModal(false);
    };
    const [availableHours , setAvalibleHours] = useState<AvailableHours | null>(null);
    const [salas, setSalas] = useState<Sala[]>([])
    const [visitantes, setVisitantes] = useState<Visitante[]>([]);
    const [visitanteSelecionado, setVisitanteSelecionado] = useState<number | ''>('');
    const [salaSelecionada, setSalaSelecionada] = useState<number | ''>('');
    const [dataAgendada, setDataAgendada] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFim, setHoraFim] = useState('');

    const [disponibilidadeVeriricada , setDisponibilidadeVerificada] = useState(false);
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
    const getHorasDaData = async () => {

        if (!dataAgendada || !salaSelecionada) {
            alert('Por favor, selecione uma sala e uma data antes de verificar a disponibilidade.');
            return;
        }

        try {
            let response = await api.post('/agendamento/available-hours', {
            sala_id: salaSelecionada,
            data_agendada: dataAgendada,
            });

            // Caso a data seja inválida e o backend retorne uma nova data sugerida
            if (response.data.action === 'insertNewDateAutomaticly') {
                alert(`Data selecionada não é válida. Próxima data disponível: ${response.data.data}`);
                const novaData = response.data.data;
                setDataAgendada(novaData);
                //manda requisicao denovo pra prencher horarios
                response = await api.post('/agendamento/available-hours', {
                    sala_id: salaSelecionada,
                    data_agendada: novaData,
                });
            }

            setDisponibilidadeVerificada(true);
            setAvalibleHours(response.data);
        } catch (error) {
            console.error('Erro ao buscar horas disponíveis:', error);
        }
        };
        //quando a data mudar ele reseta a disponibilidade
    const dataChanged = (value : string) => {
            setDataAgendada(value);
            setDisponibilidadeVerificada(false);
    }
    const validateHorario = () => {
    if (!horaInicio || !horaFim) {
        alert("Por favor, selecione o horário de início e fim.");
        return false;
    }

    if (!availableHours) {
        alert("As horas disponíveis ainda não foram carregadas.");
        return false;
    }

    const { init, end, livre } = availableHours;

    const toMinutes = (hora: string) => {
        const [h, m] = hora.split(":").map(Number);
        return h * 60 + m;
    };

    const inicioForm = toMinutes(horaInicio);
    const fimForm = toMinutes(horaFim);
    const inicioDia = toMinutes(init);
    const fimDia = toMinutes(end);


    if (inicioForm < inicioDia || fimForm > fimDia) {
        alert(`Horário fora do expediente (${init} às ${end}).`);
        return false;
    }


    if (inicioForm >= fimForm) {
        alert("O horário de início deve ser anterior ao horário de fim.");
        return false;
    }


    const dentroDeAlgumIntervalo = livre.some(
        (intervalo: { inicio: string; fim: string }) => {
        const livreInicio = toMinutes(intervalo.inicio);
        const livreFim = toMinutes(intervalo.fim);
        return inicioForm >= livreInicio && fimForm <= livreFim;
        }
    );

    if (!dentroDeAlgumIntervalo) {
        alert("O horário selecionado não está dentro de um intervalo livre.");
        return false;
    }

    return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateHorario()) {
            return;
        }
        try {        
            const data = {
                visitante_id : visitanteSelecionado,
                sala_id : salaSelecionada, 
                data_agendada : dataAgendada,
                hora_inicio : horaInicio,
                hora_fim : horaFim,
            }
            const response = await api.post('/agendamento', data);
            if (response.data.action === 'insertNewDateAutomaticly'){
                alert(`Data selecionado Nao valida Proxima data disponivel : ${response.data.data}`);
                setDataAgendada(response.data.data);
                return;
            }
            alert('Agendamento criado com sucesso!');
            window.location.reload();
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
                            <h1 className="mt-4 mb-2 text-2xl font-bold">Criar Agendamento</h1>

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
                                    <label htmlFor="nome">Data</label>
                                    <div className="w-full mt-2 gap-5 flex">
                                            <input
                                                type="date"
                                                value={dataAgendada}
                                                onChange={(e) => dataChanged(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                required
                                                />
                                            <button   
                                                type="button"
                                                onClick={getHorasDaData}
                                                className="w-1/2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                                >
                                                Verificar Disponibilidade
                                            </button>
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-800 mb-3">
                                    Disponibilidade de Horários
                                    </h2>

                                    {disponibilidadeVeriricada && availableHours ? (
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 shadow-sm">
                                        <p className="text-sm text-gray-700">
                                            <strong className="text-gray-900">Horário de funcionamento:</strong>{" "}
                                            {availableHours.init} às {availableHours.end}
                                        </p>
                                        </div>
                                        {availableHours.livre && availableHours.livre.length > 0 && (
                                        <div className="bg-green-50 rounded-lg p-3 border border-green-200 shadow-sm">
                                            <h3 className="text-sm font-semibold text-green-800 mb-2">
                                            Horários livres:
                                            </h3>
                                            <ul className="grid grid-cols-2 gap-2">
                                            {availableHours.livre.map(
                                                (horario: { inicio: string; fim: string }, index: number) => (
                                                <li
                                                    key={index}
                                                    className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm text-center cursor-pointer hover:bg-green-200 transition"
                                                    onClick={() => {
                                                    setHoraInicio(horario.inicio);
                                                    setHoraFim(horario.fim);
                                                    }}
                                                >
                                                    {horario.inicio} - {horario.fim}
                                                </li>
                                                )
                                            )}
                                            </ul>
                                        </div>
                                        )}
                                    </div>
                                    ) : (
                                    <p className="text-gray-600 italic">
                                        Verifique a disponibilidade para exibir os horários.
                                    </p>
                                    )}


                                <div className="flex w-full gap-5 flex-row">

                                    <div className="w-1/2">
                                        <p>Hora Inicio</p>
                                        <input 
                                            type="time"  
                                            disabled={!disponibilidadeVeriricada}
                                            value={horaInicio}
                                            onChange={(e) => setHoraInicio(e.target.value)}
                                            required />
                                    </div>
                                    <div className="w-1/2">
                                        <p>Hora Fim</p>
                                        <input 
                                            disabled={!disponibilidadeVeriricada}
                                            type="time"  
                                            value={horaFim}
                                            onChange={(e) => setHoraFim(e.target.value)}
                                            required />
                                    </div>
                                </div>
                                <input
                                disabled={!disponibilidadeVeriricada}
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
